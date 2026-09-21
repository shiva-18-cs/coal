import React, { useState } from 'react';
import axios from 'axios';
import { Search, FileText, Database, Tag, ArrowRight, Building2, Calendar } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const SmartSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [subsidiary, setSubsidiary] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'documents' | 'information' | 'topics'>('all');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const params: any = { q: query.trim() };
      if (subsidiary) params.subsidiary = subsidiary;
      if (year) params.year = parseInt(year);
      const res = await axios.get(`${API}/search`, { params });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = [
    'MCL coal production 2024',
    'Safety inspection',
    'Overburden removal SECL',
    'Environmental clearance',
    'Target achievement'
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Smart Search</h1>
        <p className="text-sm text-gray-500">
          Find any information across all documents, subsidiaries, and extracted datasets with intelligent matching.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keywords, mine name, metric, subsidiary, or topic..."
              className="w-full pl-12 pr-28 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-base outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 px-5 py-2 bg-blue-700 text-white font-medium rounded-md hover:bg-blue-800 transition text-sm disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Filters & Sample queries */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100 text-sm">
            <div className="flex items-center space-x-3">
              <span className="text-gray-500 font-medium">Filter by:</span>
              <select
                value={subsidiary}
                onChange={(e) => setSubsidiary(e.target.value)}
                className="border border-gray-200 rounded-md px-3 py-1.5 text-sm bg-gray-50 text-gray-700 focus:bg-white"
              >
                <option value="">All Subsidiaries</option>
                {['MCL', 'WCL', 'NCL', 'SECL', 'CCL', 'BCCL', 'ECL'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="border border-gray-200 rounded-md px-3 py-1.5 text-sm bg-gray-50 text-gray-700 focus:bg-white"
              >
                <option value="">All Years</option>
                {[2025, 2024, 2023, 2022, 2021, 2020].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>Try:</span>
              {sampleQueries.map(sq => (
                <button
                  type="button"
                  key={sq}
                  onClick={() => { setQuery(sq); }}
                  className="bg-gray-100 hover:bg-blue-50 hover:text-blue-700 px-2 py-1 rounded transition"
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {results && (
        <div className="space-y-6">
          {/* Tab Selection */}
          <div className="flex border-b border-gray-200 space-x-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-3 text-sm font-medium border-b-2 transition ${
                activeTab === 'all'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All Matches ({results.documents.length + results.information.length + results.topics.length})
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`pb-3 text-sm font-medium border-b-2 transition ${
                activeTab === 'documents'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Documents ({results.documents.length})
            </button>
            <button
              onClick={() => setActiveTab('information')}
              className={`pb-3 text-sm font-medium border-b-2 transition ${
                activeTab === 'information'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Extracted Facts ({results.information.length})
            </button>
            <button
              onClick={() => setActiveTab('topics')}
              className={`pb-3 text-sm font-medium border-b-2 transition ${
                activeTab === 'topics'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Topics ({results.topics.length})
            </button>
          </div>

          {/* Documents Section */}
          {(activeTab === 'all' || activeTab === 'documents') && results.documents.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="mr-2 text-blue-600" size={20} />
                Matching Documents ({results.documents.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.documents.map((doc: any) => (
                  <div key={doc.id} className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {doc.doc_id}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar size={12} className="mr-1" /> {doc.year}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mt-2 text-base">{doc.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{doc.doc_type}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-100">
                      <span className="flex items-center font-medium">
                        <Building2 size={13} className="mr-1 text-gray-400" />
                        {doc.subsidiary} {doc.mine ? `• ${doc.mine}` : ''}
                      </span>
                      <a href={`/documents`} className="text-blue-600 hover:underline flex items-center">
                        View document <ArrowRight size={12} className="ml-1" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extracted Information Section */}
          {(activeTab === 'all' || activeTab === 'information') && results.information.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Database className="mr-2 text-indigo-600" size={20} />
                Extracted Data Points ({results.information.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Field / Metric</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subsidiary</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {results.information.map((info: any) => (
                      <tr key={info.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900 text-sm">{info.field}</td>
                        <td className="px-4 py-3 font-mono font-bold text-blue-700 text-sm">{info.value}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm">{info.unit}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{info.subsidiary}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{info.year}</td>
                        <td className="px-4 py-3 text-xs text-blue-600">{info.source_page}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Topics Section */}
          {(activeTab === 'all' || activeTab === 'topics') && results.topics.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Tag className="mr-2 text-emerald-600" size={20} />
                Related Topics ({results.topics.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {results.topics.map((topic: any) => (
                  <div key={topic.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900">{topic.name}</h3>
                    <div className="mt-2 text-xs text-gray-500 space-y-1">
                      <div>Mentions: <span className="font-semibold text-gray-700">{topic.mention_count}</span></div>
                      <div>Documents: <span className="font-semibold text-gray-700">{topic.document_count}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results fallback */}
          {results.documents.length === 0 && results.information.length === 0 && results.topics.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Search className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-base font-medium text-gray-900">No matching records found</h3>
              <p className="text-sm text-gray-500 mt-1">Try broadening your search keywords or removing subsidiary/year filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartSearch;
