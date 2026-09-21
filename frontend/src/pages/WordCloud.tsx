import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Cloud, Filter, RotateCw, Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface WordItem {
  word: string;
  count: number;
}

const WordCloud: React.FC = () => {
  const navigate = useNavigate();
  const [words, setWords] = useState<WordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [subsidiary, setSubsidiary] = useState('');
  const [year, setYear] = useState('');
  const [viewMode, setViewMode] = useState<'cloud' | 'table'>('cloud');
  const [hoveredWord, setHoveredWord] = useState<WordItem | null>(null);

  useEffect(() => {
    fetchWordCloud();
  }, [subsidiary, year]);

  const fetchWordCloud = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (subsidiary) params.subsidiary = subsidiary;
      if (year) params.year = parseInt(year);
      const res = await axios.get(`${API}/wordcloud`, { params });
      setWords(res.data);
    } catch (err) {
      console.error('Failed to load word cloud', err);
    } finally {
      setLoading(false);
    }
  };

  // Color palette for words
  const colors = [
    'text-blue-900', 'text-blue-700', 'text-indigo-800', 'text-blue-600',
    'text-cyan-800', 'text-slate-800', 'text-sky-700', 'text-teal-800'
  ];

  const maxCount = words.length > 0 ? Math.max(...words.map(w => w.count)) : 1;
  const minCount = words.length > 0 ? Math.min(...words.map(w => w.count)) : 1;

  const getFontSize = (count: number) => {
    if (maxCount === minCount) return 16;
    const normalized = (count - minCount) / (maxCount - minCount);
    return Math.round(14 + normalized * 36); // between 14px and 50px
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Word Cloud</h1>
          <p className="text-sm text-gray-500">
            Visual breakdown of most frequent terminology and key concepts extracted from mining reports.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-lg self-start">
          <button
            onClick={() => setViewMode('cloud')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition ${
              viewMode === 'cloud' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Cloud View
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition ${
              viewMode === 'table' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Frequency Table
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Filter size={16} />
            <span className="font-medium">Filter:</span>
          </div>

          <select
            value={subsidiary}
            onChange={(e) => setSubsidiary(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-600"
          >
            <option value="">All Subsidiaries</option>
            {['MCL', 'WCL', 'NCL', 'SECL', 'CCL', 'BCCL', 'ECL'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-600"
          >
            <option value="">All Years</option>
            {[2025, 2024, 2023, 2022, 2021, 2020].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-3 text-xs text-gray-500">
          <span>{words.length} distinct terms analyzed</span>
          <button
            onClick={fetchWordCloud}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition"
            title="Refresh"
          >
            <RotateCw size={14} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center p-16 bg-white rounded-xl border border-gray-200">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      ) : viewMode === 'cloud' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 min-h-[460px] flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 py-8">
            {words.map((item, idx) => {
              const fontSize = getFontSize(item.count);
              const colorClass = colors[idx % colors.length];
              return (
                <button
                  key={item.word}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(item.word)}`)}
                  onMouseEnter={() => setHoveredWord(item)}
                  onMouseLeave={() => setHoveredWord(null)}
                  style={{ fontSize: `${fontSize}px` }}
                  className={`font-semibold hover:opacity-80 transition cursor-pointer select-none px-2 py-1 rounded hover:bg-blue-50 ${colorClass}`}
                  title={`Click to search "${item.word}" (Frequency: ${item.count})`}
                >
                  {item.word}
                </button>
              );
            })}
          </div>

          {/* Bottom helper info */}
          <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <Cloud size={14} className="text-blue-600" />
              <span>Click any word to instantly search related records and documents.</span>
            </div>
            {hoveredWord && (
              <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">
                "{hoveredWord.word}": {hoveredWord.count} occurrences
              </span>
            )}
          </div>
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase text-xs">Rank</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase text-xs">Term / Keyword</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase text-xs">Frequency</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase text-xs">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {words.map((item, index) => (
                <tr key={item.word} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-mono text-gray-500 text-xs">#{index + 1}</td>
                  <td className="px-6 py-3 font-semibold text-gray-900">{item.word}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-blue-700">{item.count}</span>
                      <div className="w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${(item.count / maxCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => navigate(`/search?q=${encodeURIComponent(item.word)}`)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                    >
                      Search <ArrowRight size={12} className="ml-1" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WordCloud;
