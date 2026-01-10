// frontend/src/pages/Ingest.tsx
import React, { useState } from 'react';
import { CodeIngestionService } from '../services/codeIngestionService';
import { GraphData } from '../types';

const Ingest: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleParse = async () => {
    if (file) {
      setLoading(true);
      const data = await CodeIngestionService.parseZipFile(file);
      setGraphData(data);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Code Ingestion</h1>
      <div className="flex items-center space-x-4">
        <input type="file" accept=".zip" onChange={handleFileChange} />
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={handleParse}
          disabled={!file || loading}
        >
          {loading ? 'Parsing...' : 'Parse Zip File'}
        </button>
      </div>
      {graphData && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Results</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(graphData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Ingest;
