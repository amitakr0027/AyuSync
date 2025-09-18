// components/DualCodingWorkspace.tsx
'use client';
import { useState } from 'react';
import { pythonApi } from '@/services/python-api';

export default function DualCodingWorkspace() {
  const [namasteQuery, setNamasteQuery] = useState('');
  const [icdQuery, setIcdQuery] = useState('');
  const [namasteResults, setNamasteResults] = useState([]);
  const [icdResults, setIcdResults] = useState([]);
  const [selectedNamaste, setSelectedNamaste] = useState(null);
  const [selectedIcd, setSelectedIcd] = useState(null);
  const [loading, setLoading] = useState(false);

  const testNamasteSearch = async () => {
    setLoading(true);
    try {
      console.log('Testing Python NAMASTE search with:', namasteQuery);
      const data = await pythonApi.searchNamaste(namasteQuery);
      console.log('Python NAMASTE Results:', data);
      setNamasteResults(data);
    } catch (error) {
      console.error('Python NAMASTE Search failed:', error);
      alert('Search failed. Is the Python backend running?');
    } finally {
      setLoading(false);
    }
  };

  const testIcdSearch = async () => {
    setLoading(true);
    try {
      console.log('Testing Python ICD search with:', icdQuery);
      const data = await pythonApi.searchIcd(icdQuery);
      console.log('Python ICD Results:', data);
      setIcdResults(data);
    } catch (error) {
      console.error('Python ICD Search failed:', error);
      alert('Search failed. Is the Python backend running?');
    } finally {
      setLoading(false);
    }
  };

  const saveProblem = async () => {
    if (!selectedNamaste || !selectedIcd) {
      alert('Please select both NAMASTE and ICD codes');
      return;
    }

    try {
      const result = await pythonApi.saveProblem({
        patientId: 'test-patient-123', // You'll get this from context
        namasteCode: selectedNamaste.code,
        icdCodes: [selectedIcd.code]
      });
      
      console.log('Save result:', result);
      alert('Problem saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Save failed. Check console for details.');
    }
  };

  return (
    <div>
      <h2>Dual Coding Workspace - Python Backend</h2>
      {loading && <p>Loading...</p>}
      
      {/* Your UI code here - same as before */}
      <div>
        <h3>NAMASTE Search</h3>
        <input 
          type="text" 
          value={namasteQuery}
          onChange={(e) => setNamasteQuery(e.target.value)}
          placeholder="Search NAMASTE..."
        />
        <button onClick={testNamasteSearch} disabled={loading}>
          Test Python Search
        </button>
        
        <div>
          {namasteResults.map((item: any) => (
            <div key={item.code} onClick={() => setSelectedNamaste(item)}>
              {item.code} - {item.display}
            </div>
          ))}
        </div>
      </div>

      {/* ICD Search and other UI remains similar */}
      {/* ... */}

      <button onClick={saveProblem} disabled={!selectedNamaste || !selectedIcd}>
        Save to Problem List (Python)
      </button>
    </div>
  );
}