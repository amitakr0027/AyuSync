// app/test-api/page.tsx
// http://localhost:3000/test-api
'use client';
import { useState } from 'react';

export default function TestAPI() {
  const [namasteQuery, setNamasteQuery] = useState('');
  const [icdQuery, setIcdQuery] = useState('');
  const [namasteResults, setNamasteResults] = useState<any[]>([]);
  const [icdResults, setIcdResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const testNamasteSearch = async () => {
    setLoading(true);
    setMessage('');
    try {
      console.log('Testing NAMASTE search with:', namasteQuery);
      const response = await fetch(`http://localhost:8000/api/namaste/search?q=${encodeURIComponent(namasteQuery)}`);
      const data = await response.json();
      console.log('NAMASTE Results:', data);
      setNamasteResults(data);
      setMessage(`Found ${data.length} NAMASTE results`);
    } catch (error) {
      console.error('NAMASTE Search failed:', error);
      setMessage('Search failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const testIcdSearch = async () => {
    setLoading(true);
    setMessage('');
    try {
      console.log('Testing ICD search with:', icdQuery);
      const response = await fetch(`http://localhost:8000/api/icd/search?q=${encodeURIComponent(icdQuery)}`);
      const data = await response.json();
      console.log('ICD Results:', data);
      setIcdResults(data);
      setMessage(`Found ${data.length} ICD results`);
    } catch (error) {
      console.error('ICD Search failed:', error);
      setMessage('Search failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{padding: '20px', fontFamily: 'Arial'}}>
      <h1>API Connection Test</h1>
      <p>This page tests the connection to your Python backend</p>
      
      <div style={{margin: '20px 0', padding: '10px', background: '#f0f0f0'}}>
        <h2>Test 1: NAMASTE Search</h2>
        <input 
          type="text" 
          value={namasteQuery}
          onChange={(e) => setNamasteQuery(e.target.value)}
          placeholder="Type 'Vata' here..."
          style={{padding: '8px', marginRight: '10px'}}
        />
        <button 
          onClick={testNamasteSearch} 
          disabled={loading}
          style={{padding: '8px 16px', background: '#0070f3', color: 'white', border: 'none'}}
        >
          Test NAMASTE Search
        </button>
        
        <h3>Results:</h3>
        <ul>
          {namasteResults.map((item, index) => (
            <li key={index}>{item.code} - {item.display}</li>
          ))}
        </ul>
      </div>

      <div style={{margin: '20px 0', padding: '10px', background: '#f0f0f0'}}>
        <h2>Test 2: ICD Search</h2>
        <input 
          type="text" 
          value={icdQuery}
          onChange={(e) => setIcdQuery(e.target.value)}
          placeholder="Type 'bowel' here..."
          style={{padding: '8px', marginRight: '10px'}}
        />
        <button 
          onClick={testIcdSearch} 
          disabled={loading}
          style={{padding: '8px 16px', background: '#0070f3', color: 'white', border: 'none'}}
        >
          Test ICD Search
        </button>
        
        <h3>Results:</h3>
        <ul>
          {icdResults.map((item, index) => (
            <li key={index}>{item.code} - {item.display}</li>
          ))}
        </ul>
      </div>

      {message && (
        <div style={{
          margin: '20px 0',
          padding: '10px',
          background: message.includes('failed') ? '#ffebee' : '#e8f5e8',
          border: message.includes('failed') ? '1px solid #f44336' : '1px solid #4caf50'
        }}>
          <strong>Status:</strong> {message}
        </div>
      )}

      <div style={{margin: '20px 0', padding: '10px', background: '#fff3cd'}}>
        <h3>Debug Instructions:</h3>
        <p>1. Open Browser Developer Tools (F12)</p>
        <p>2. Go to Console tab to see logs</p>
        <p>3. Go to Network tab to see API calls</p>
        <p>4. Make sure Python backend is running on http://localhost:8000</p>
      </div>
    </div>
  );
}