import JSZip from 'jszip';
import { parse } from '@babel/parser';
import { CodeNode, CodeLink, GraphData, NodeType } from '../types';

// Lightweight AST Traversal (No babel-traverse dependency required)
function traverse(node: any, visitors: Record<string, (node: any) => void>) {
  if (!node || typeof node !== 'object') return;

  if (node.type && visitors[node.type]) {
    visitors[node.type](node);
  }

  for (const key in node) {
    // Skip internal properties to avoid infinite loops or unnecessary checks
    if (key === 'loc' || key === 'start' || key === 'end' || key === 'comments' || key === 'leadingComments' || key === 'trailingComments') continue;

    const child = node[key];
    if (Array.isArray(child)) {
      child.forEach(c => traverse(c, visitors));
    } else {
      traverse(child, visitors);
    }
  }
}

export class CodeIngestionService {

  private static determineType(filename: string): NodeType {
    if (filename.endsWith('.tsx') || filename.endsWith('.jsx') || filename.endsWith('.css')) return 'ui';
    if (filename.endsWith('.ts') || filename.endsWith('.js')) return 'logic';
    if (filename.endsWith('.json') || filename.endsWith('.config.js')) return 'config';
    return 'util';
  }

  /**
   * Parses code content to extract Imports and calculate Cyclomatic Complexity.
   */
  private static processFileAST(content: string, filename: string): { complexity: number, imports: string[], vulnerability: number } {
    const imports: string[] = [];
    let complexity = 1; // Base cyclomatic complexity is 1
    let vulnerability = 0;

    // Only attempt AST parsing on JS/TS-like files
    if (!/\.(js|jsx|ts|tsx)$/.test(filename)) {
        return { complexity: 1, imports: [], vulnerability: 0 };
    }

    try {
        const isTs = filename.endsWith('.ts') || filename.endsWith('.tsx');
        const ast = parse(content, {
            sourceType: 'module',
            plugins: [
                'jsx',
                isTs ? 'typescript' : 'flow',
                'classProperties',
                'decorators-legacy',
                'dynamicImport',
                'exportDefaultFrom',
                'exportNamespaceFrom',
                'objectRestSpread',
                'nullishCoalescingOperator',
                'optionalChaining'
            ],
            errorRecovery: true
        });

        traverse(ast, {
            // --- IMPORT EXTRACTION ---
            ImportDeclaration: (node: any) => {
                if (node.source && node.source.value) {
                    imports.push(node.source.value);
                }
            },
            ExportNamedDeclaration: (node: any) => {
                if (node.source && node.source.value) imports.push(node.source.value);
            },
            CallExpression: (node: any) => {
                // Dynamic imports
                if (node.callee && node.callee.type === 'Import' && node.arguments.length > 0) {
                    if (node.arguments[0].type === 'StringLiteral') {
                        imports.push(node.arguments[0].value);
                    }
                }
                // Basic security check: eval() or document.write()
                if (node.callee.name === 'eval' || (node.callee.object?.name === 'document' && node.callee.property?.name === 'write')) {
                    vulnerability += 20;
                }
            },

            // --- COMPLEXITY ---
            IfStatement: () => complexity++,
            WhileStatement: () => complexity++,
            ForStatement: () => complexity++,
            ForInStatement: () => complexity++,
            ForOfStatement: () => complexity++,
            DoWhileStatement: () => complexity++,
            CatchClause: () => complexity++,
            ConditionalExpression: () => complexity++,
            LogicalExpression: (node: any) => {
                if (['||', '&&', '??'].includes(node.operator)) complexity++;
            },
            SwitchCase: (node: any) => {
                if (node.test) complexity++;
            }
        });

    } catch (e) {
        console.warn(`AST Parse failed for ${filename}. Falling back to regex.`, e);
        const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            imports.push(match[1]);
        }
        complexity = Math.max(1, Math.round(content.split('\n').length / 50));
    }

    const normalizedScore = Math.min(Math.round((complexity * 2)), 100);
    return { complexity: normalizedScore, imports, vulnerability };
  }

  static async parseZipFile(file: File): Promise<GraphData> {
    const zip = new JSZip();
    const loadedZip = await zip.loadAsync(file);

    const nodes: CodeNode[] = [];
    const links: CodeLink[] = [];
    const filePaths = new Set<string>();
    const folderMap = new Map<string, CodeNode>();

    // 1. First Pass: Create Nodes & Folder Structure
    const filePromises: Promise<void>[] = [];

    loadedZip.forEach((relativePath, zipEntry) => {
      if (zipEntry.dir || relativePath.includes('node_modules') || relativePath.includes('.git') || relativePath.startsWith('.')) {
        return;
      }

      filePaths.add(relativePath);

      const promise = zipEntry.async('string').then((content) => {
        const lines = content.split('\n');
        const loc = lines.length;

        // --- Folder Structure Logic ---
        const parts = relativePath.split('/');
        parts.pop(); // Remove filename

        let currentPath = "";
        let parentPath = "";

        parts.forEach((part) => {
            parentPath = currentPath;
            currentPath = currentPath ? `${currentPath}/${part}` : part;

            if (!folderMap.has(currentPath)) {
                const folderNode: CodeNode = {
                    id: currentPath,
                    name: part,
                    type: 'folder',
                    loc: 0,
                    complexity: 0,
                    content: '', // Folders have no content
                    imports: [],
                    incomingCount: 0,
                    heatIndex: 0,
                    vulnerabilityScore: 0
                };
                folderMap.set(currentPath, folderNode);
                nodes.push(folderNode);

                if (parentPath) {
                    links.push({
                        source: currentPath,
                        target: parentPath,
                        value: 5,
                        type: 'structure'
                    });
                }
            }
        });

        if (currentPath) {
            links.push({
                source: relativePath,
                target: currentPath,
                value: 5,
                type: 'structure'
            });
        }

        // --- AST ANALYSIS ---
        const { complexity, imports, vulnerability } = this.processFileAST(content, relativePath);

        const node: CodeNode = {
          id: relativePath,
          name: relativePath.split('/').pop() || relativePath,
          type: this.determineType(relativePath),
          loc: loc,
          complexity: complexity,
          content: content, // Store content for 2D view/export
          imports: imports,
          incomingCount: 0,
          heatIndex: 0, // Calculated in pass 3
          vulnerabilityScore: vulnerability
        };

        nodes.push(node);
      });

      filePromises.push(promise);
    });

    await Promise.all(filePromises);

    // 2. Second Pass: Create Links
    nodes.forEach(node => {
        if (node.type === 'folder') return;

        node.imports.forEach(imp => {
        let targetId: string | null = null;
        const cleanImport = imp.replace(/['"]/g, '');

        const candidates = Array.from(filePaths).filter(path => {
            const normalizedPath = path.substring(0, path.lastIndexOf('.'));
            const normalizedImport = cleanImport.replace(/^(\.\/|\.\.\/)/, '');
            return normalizedPath.endsWith(normalizedImport);
        });

        if (candidates.length > 0) targetId = candidates[0];

        if (targetId && targetId !== node.id) {
          links.push({
            source: node.id,
            target: targetId,
            value: 1,
            type: 'dependency'
          });

          const targetNode = nodes.find(n => n.id === targetId);
          if (targetNode) {
            targetNode.incomingCount = (targetNode.incomingCount || 0) + 1;
          }
        }
      });
    });

    // 3. Third Pass: Scoring & God Objects
    nodes.forEach(node => {
      if (node.type === 'folder') return;

      // Calculate Heat Index
      // Formula: Complexity (0-100) + (Incoming Couplings * 5)
      const couplingScore = (node.incomingCount || 0) * 5;
      node.heatIndex = Math.min(node.complexity + couplingScore, 100);

      // Vulnerability Score adjustment based on God Object status
      if (node.heatIndex > 80) node.vulnerabilityScore += 30;

      if ((node.incomingCount || 0) > 5 && node.complexity > 50) {
        node.isGodObject = true;
      }
    });

    return { nodes, links };
  }

  /**
   * Generates a single text file containing the Project Map and all file contents.
   */
  static generateMonolithReport(nodes: CodeNode[]): string {
      const date = new Date().toLocaleString();
      let report = `================================================================================\n`;
      report += ` CODEATLAS 3D - REPOSITORY EXPORT\n`;
      report += ` Generated: ${date}\n`;
      report += ` Files: ${nodes.filter(n => n.type !== 'folder').length}\n`;
      report += ` Total Lines: ${nodes.reduce((acc, n) => acc + n.loc, 0)}\n`;
      report += `================================================================================\n\n`;

      // 1. Generate Component Map (ASCII Tree)
      report += `--- COMPONENT MAP --------------------------------------------------------------\n`;
      const sortedNodes = [...nodes].sort((a, b) => a.id.localeCompare(b.id));
      sortedNodes.forEach(node => {
          const depth = node.id.split('/').length - 1;
          const indent = '  '.repeat(depth);
          const icon = node.type === 'folder' ? '📁' : '📄';
          const info = node.type !== 'folder' ? ` (LOC: ${node.loc} | Risk: ${node.heatIndex})` : '';
          report += `${indent}${icon} ${node.name}${info}\n`;
      });
      report += `\n`;

      // 2. File Contents
      report += `--- FILE CONTENTS --------------------------------------------------------------\n`;
      const files = sortedNodes.filter(n => n.type !== 'folder');

      files.forEach(file => {
          report += `\n\n`;
          report += `/* ==========================================================================\n`;
          report += `   FILE: ${file.id}\n`;
          report += `   LOC: ${file.loc}  |  COMPLEXITY: ${file.complexity}  |  VULNERABILITY: ${file.vulnerabilityScore}\n`;
          report += `   IMPORTS: ${file.imports.length}\n`;
          report += `   ========================================================================== */\n\n`;
          report += file.content;
      });

      return report;
  }
}
