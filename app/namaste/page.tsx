'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';

// Simplified Icons as React components for easy use
const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
    <path d="M12 17V3M8 7l4-4 4 4" strokeWidth={2} />
    <path d="M20 21H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4" strokeWidth={2} />
  </svg>
);

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
    <circle cx={11} cy={11} r={7} strokeWidth={2} />
    <path d="M21 21l-4.35-4.35" strokeWidth={2} />
  </svg>
);

const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
    <circle cx={12} cy={12} r={10} strokeWidth={2} />
    <path d="M12 16v-4M12 8h.01" strokeWidth={2} />
  </svg>
);

// Mock Python API client
const pythonApi = {
  searchNamaste: async (query: string) => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock response - replace with actual API call
    return [
      { code: 'NAM001', display: 'Prameha (Live)' },
      { code: 'NAM006', display: 'Vata Disorder (Live)' },
      { code: 'NAM007', display: 'Pitta Imbalance (Live)' },
      { code: 'NAM008', display: 'Kapha Excess (Live)' },
    ].filter(item => 
      item.display.toLowerCase().includes(query.toLowerCase()) || 
      item.code.toLowerCase().includes(query.toLowerCase())
    );
  }
};

// TypeScript: define disorder type for data consistency
type Disorder = {
  code: string;
  display: string;
  tm2Code: string;
  tm2Text: string;
  bioCode: string;
  bioText: string;
};

const staticTerms: Disorder[] = [
  {
    code: 'NAM001',
    display: 'Prameha',
    tm2Code: 'TM2-101',
    tm2Text: 'Diabetes Mellitus (Traditional Medicine)',
    bioCode: 'E10',
    bioText: 'Type 1 Diabetes Mellitus',
  },
  {
    code: 'NAM002',
    display: 'Vatavyadi',
    tm2Code: 'TM2-102',
    tm2Text: 'Neurological Disorder (TM)',
    bioCode: 'G60',
    bioText: 'Hereditary and idiopathic neuropathy',
  },
  {
    code: 'NAM003',
    display: 'Jwara',
    tm2Code: 'TM2-103',
    tm2Text: 'Fever (TM)',
    bioCode: 'R50',
    bioText: 'Fever of unknown origin',
  },
  {
    code: 'NAM004',
    display: 'Shwasa',
    tm2Code: 'TM2-104',
    tm2Text: 'Asthma (TM)',
    bioCode: 'J45',
    bioText: 'Asthma',
  },
  {
    code: 'NAM005',
    display: 'Madhumeha',
    tm2Code: 'TM2-105',
    tm2Text: 'Diabetes-related disorder (TM)',
    bioCode: 'E11',
    bioText: 'Type 2 Diabetes Mellitus',
  },
];

// Tree node type
type TreeNode = {
  code: string;
  display: string;
  children?: TreeNode[];
};

// Create dummy tree hierarchy
const staticHierarchy: TreeNode = {
  code: 'root',
  display: 'All Disorders',
  children: staticTerms.map((term) => ({ code: term.code, display: term.display })),
};

type ConsentProps = {
  consent: null | object; // dummy, no real data in demo
};

const ConsentPane: React.FC<ConsentProps> = ({ consent }) => (
  <div className="bg-sky-50 border border-sky-100 rounded-lg p-4">
    <h3 className="font-semibold mb-1">Consent Metadata</h3>
    <div className="text-gray-500 italic">No consent metadata in demo.</div>
  </div>
);

type VersionProps = {
  version: null | object; // dummy, no real data
};

const VersionPane: React.FC<VersionProps> = ({ version }) => (
  <div className="bg-lime-50 border border-lime-100 rounded-lg p-4">
    <h3 className="font-semibold mb-1">Terminology Version</h3>
    <div className="text-gray-500 italic">No version metadata in demo.</div>
  </div>
);

// Improved NAMASTETree component with level indent
type NAMASTETreeProps = {
  hierarchy: TreeNode | null;
  onSelect: (node: TreeNode) => void;
  selectedCode?: string;
};

const NAMASTETree: React.FC<NAMASTETreeProps> = ({ hierarchy, onSelect, selectedCode }) => {
  if (!hierarchy) return <div className="text-gray-400">Loading hierarchy...</div>;

  // Recursive render with level indent
  const renderNode = (node: TreeNode, level: number = 0): JSX.Element => (
    <li key={node.code} className={`mb-1 ${level === 0 ? 'font-bold text-gray-600' : ''}`}>
      <span
        className={`cursor-pointer block px-3 py-1 rounded transition 
          ${node.code === selectedCode ? 'bg-blue-200 text-blue-900' : 'hover:bg-blue-50'}
        `}
        style={{ marginLeft: level * 12 }}
        onClick={() => onSelect(node)}
      >
        {node.display}
        <span className="ml-2 text-xs text-gray-400">{node.code !== 'root' ? node.code : ''}</span>
      </span>
      {node.children && node.children.length > 0 && (
        <ul className="ml-1 mt-1">{node.children.map((child) => renderNode(child, level + 1))}</ul>
      )}
    </li>
  );

  return <ul className="divide-y">{renderNode(hierarchy)}</ul>;
};

// Main page component
const NamsatePage: React.FC = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [search, setSearch] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Disorder[]>([]);
  const [apiResults, setApiResults] = useState<any[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<Disorder | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchNamaste = async () => {
      if (search.length > 2) {
        setLoading(true);
        try {
          console.log('Searching Python backend for:', search);
          const data = await pythonApi.searchNamaste(search);
          console.log('Python API results:', data);
          setApiResults(data);
          
          // Also keep your static results for fallback
          const filtered = staticTerms.filter(
            (term) =>
              term.display.toLowerCase().includes(search.toLowerCase()) || 
              term.code.toLowerCase().includes(search.toLowerCase())
          );
          setSearchResults(filtered);
        } catch (error) {
          console.error('Search failed:', error);
          // Fallback to static search if API fails
          const filtered = staticTerms.filter(
            (term) =>
              term.display.toLowerCase().includes(search.toLowerCase()) || 
              term.code.toLowerCase().includes(search.toLowerCase())
          );
          setSearchResults(filtered);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
        setApiResults([]);
      }
    };

    const debounceTimer = setTimeout(searchNamaste, 300);
    return () => clearTimeout(debounceTimer);
  }, [search]);

  const handleCsvUpload = (evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    setCsvFile(file || null);
    alert('CSV Upload is not implemented in this demo.');
  };

  return (
    <main className="max-w-6xl mx-auto py-10 px-4 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left panel */}
        <section className="flex-1 bg-white/70 shadow-lg rounded-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-bold">NAMASTE Terminology (Live)</h1>
            <label className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-gray-50 hover:bg-blue-100 transition">
              <UploadIcon />
              <span className="text-sm">Upload CSV</span>
              <input type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} />
            </label>
          </div>

          <div className="mb-4 flex items-center gap-3">
            <SearchIcon className="text-gray-500" />
            <input
              type="text"
              className="w-full rounded border border-gray-300 bg-gray-50 py-2 px-4 focus:border-blue-500 outline-none transition"
              placeholder="Search disorders (e.g. Vata)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
            {search && (
              <button
                className="ml-2 rounded bg-blue-500 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                onClick={() => setSearch('')}
              >
                Clear
              </button>
            )}
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Searching Python backend...</p>
            </div>
          )}

          {search.length > 2 && !loading && (
            <div>
              <h3 className="font-semibold mb-2">Python Backend Results:</h3>
              <ul className="max-h-64 overflow-y-auto rounded border border-gray-300 bg-white shadow mb-4">
                {apiResults.length === 0 ? (
                  <li className="p-3 text-center text-gray-400 italic">No results from backend</li>
                ) : (
                  apiResults.map((item: any) => (
                    <li
                      key={item.code}
                      className="cursor-pointer rounded px-3 py-2 hover:bg-blue-100 border-b"
                      onClick={() => {
                        // Create a disorder object from API result
                        const disorder: Disorder = {
                          code: item.code,
                          display: item.display,
                          tm2Code: "TM2-API", // Placeholder
                          tm2Text: "From Python API",
                          bioCode: "BIO-API", // Placeholder
                          bioText: "From Python API"
                        };
                        setSelectedTerm(disorder);
                      }}
                    >
                      <span className="font-semibold">{item.display}</span>{' '}
                      <span className="ml-2 text-xs text-gray-400">{item.code}</span>
                      <span className="ml-2 text-xs text-green-600">• Live</span>
                    </li>
                  ))
                )}
              </ul>

              <h3 className="font-semibold mb-2">Static Demo Results:</h3>
              <ul className="max-h-64 overflow-y-auto rounded border border-gray-300 bg-white shadow">
                {searchResults.length === 0 ? (
                  <li className="p-3 text-center text-gray-400 italic">No results found</li>
                ) : (
                  searchResults.map((term) => (
                    <li
                      key={term.code}
                      className={`cursor-pointer rounded px-3 py-2 hover:bg-blue-100 ${
                        selectedTerm?.code === term.code ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedTerm(term)}
                    >
                      <span className="font-semibold">{term.display}</span>{' '}
                      <span className="ml-2 text-xs text-gray-400">{term.code}</span>
                      <span className="ml-2 text-xs text-blue-600">• Demo</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}

          {/* Browse Disorder Hierarchy */}
          <div className="mt-6">
            <h2 className="mb-2 font-bold">Browse Disorder Hierarchy</h2>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
              <NAMASTETree
                hierarchy={staticHierarchy}
                onSelect={(node) => {
                  const found = staticTerms.find((term) => term.code === node.code);
                  if (found) setSelectedTerm(found);
                }}
                selectedCode={selectedTerm?.code}
              />
            </div>
          </div>
        </section>

        {/* Right panel */}
        <section className="flex-1 flex flex-col gap-4">
          <div className="min-h-[220px] rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-indigo-700">
              <InfoIcon /> Disorder Details
            </h2>

            {selectedTerm ? (
              <>
                <div className="mb-4">
                  <span className="mb-1 block text-sm font-medium uppercase text-gray-500">NAMASTE Code</span>
                  <p className="text-lg font-bold text-gray-900">{selectedTerm.code}</p>
                </div>

                <div className="mb-4">
                  <span className="mb-1 block text-sm font-medium uppercase text-gray-500">Description</span>
                  <p className="text-lg text-gray-800">{selectedTerm.display}</p>
                </div>

                <div className="mb-4 rounded border border-indigo-200 bg-indigo-50 p-4">
                  <span className="mb-1 block text-sm font-medium uppercase text-indigo-700">ICD-11 TM2</span>
                  <p className="font-semibold text-indigo-900">
                    {selectedTerm.tm2Code} - {selectedTerm.tm2Text}
                  </p>
                </div>

                <div className="rounded border border-emerald-200 bg-emerald-50 p-4">
                  <span className="mb-1 block text-sm font-medium uppercase text-emerald-700">ICD-11 Biomedicine</span>
                  <p className="font-semibold text-emerald-900">
                    {selectedTerm.bioCode} - {selectedTerm.bioText}
                  </p>
                </div>
              </>
            ) : (
              <p className="py-12 text-center italic text-gray-400">Select a disorder to see details</p>
            )}
          </div>

          <ConsentPane consent={null} />
          <VersionPane version={null} />
        </section>
      </div>
    </main>
  );
};

export default NamsatePage;