import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Difference } from '../types';
import { AlertTriangle, GitMerge, Check, Eye, X, ArrowRight, CheckCircle2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Differences: React.FC = () => {
  const navigate = useNavigate();
  const [differences, setDifferences] = useState<Difference[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [subsidiaryFilter, setSubsidiaryFilter] = useState('');
  const [inspectDiff, setInspectDiff] = useState<Difference | null>(null);

  useEffect(() => {
    fetchDiffs();
  }, [statusFilter, subsidiaryFilter]);

  const fetchDiffs = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (subsidiaryFilter) params.subsidiary = subsidiaryFilter;
      const res = await axios.get(`${API}/differences`, { params });
      setDifferences(res.data);
    } catch (error) {
      console.error("Error fetching differences", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickResolve = async (diffId: number, resolutionText: string) => {
    try {
      await axios.post(`${API}/differences/${diffId}/resolve`, {
        resolution: resolutionText,
        reason: 'Direct audit reconciliation',
        resolved_by: 'R.K. Sharma'
      });
      setDifferences(prev => prev.map(d => d.id === diffId ? { ...d, status: 'Resolved' } : d));
      if (inspectDiff?.id === diffId) setInspectDiff(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discrepancy Audit</h1>
          <p className="text-sm text-gray-500">
            Detected conflicting metrics, unit variations, and values across statutory reports.
          </p>
        </div>
        <button
          onClick={() => navigate('/resolve')}
          className="flex items-center px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg text-sm transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <GitMerge size={16} className="mr-2" />
          Batch Reconciliation Tool &rarr;
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white focus:ring-2 focus:ring-blue-600"
          >
            <option value="">All Statuses ({differences.length})</option>
            <option value="Needs Review">Needs Review</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={subsidiaryFilter}
            onChange={(e) => setSubsidiaryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white focus:ring-2 focus:ring-blue-600"
          >
            <option value="">All Subsidiaries</option>
            {['MCL', 'WCL', 'NCL', 'SECL', 'CCL', 'BCCL', 'ECL'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <span className="text-xs text-gray-500">
          Showing {differences.length} identified conflict items
        </span>
      </div>

      {/* Main Differences List */}
      {loading ? (
        <div className="flex justify-center p-16 bg-white rounded-xl border border-gray-200">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      ) : differences.length === 0 ? (
        <div className="bg-white rounded-xl shadow-xs p-16 text-center border border-gray-200">
          <Check className="mx-auto h-12 w-12 text-green-500 mb-3" />
          <h3 className="text-lg font-bold text-gray-900">All discrepancies verified &amp; cleared</h3>
          <p className="text-gray-500 text-sm mt-1">No pending conflicts for your current filter selection.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {differences.map(diff => (
            <div key={diff.id} className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden hover:border-gray-300 transition">
              <div className="bg-amber-50/70 px-6 py-3.5 border-b border-amber-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="text-amber-600" size={18} />
                  <h3 className="font-bold text-gray-900">{diff.field}</h3>
                  <span className="px-2 py-0.5 bg-white rounded text-xs font-mono font-semibold text-gray-700 border border-gray-200">
                    {diff.diff_id}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {diff.subsidiary} • FY {diff.year}
                  </span>
                </div>
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                  diff.status === 'Resolved' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {diff.status}
                </span>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-gray-200 hidden md:block"></div>
                
                {/* Document A */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Document A Source</span>
                    <span className="text-xs font-mono text-gray-400">{diff.doc_a_id}</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="text-2xl font-extrabold text-gray-900 font-mono">
                      {diff.value_a} <span className="text-sm font-normal text-gray-500 font-sans">{diff.unit_a}</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-1 font-medium">{diff.doc_a_name}</p>
                    <button 
                      onClick={() => setInspectDiff(diff)}
                      className="text-xs text-blue-600 hover:text-blue-800 mt-2 font-medium flex items-center cursor-pointer"
                    >
                      <Eye size={13} className="mr-1" /> {diff.page_a || 'Page 1'} • Compare Full Context
                    </button>
                  </div>
                </div>

                {/* Document B */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Document B Source</span>
                    <span className="text-xs font-mono text-gray-400">{diff.doc_b_id}</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="text-2xl font-extrabold text-gray-900 font-mono">
                      {diff.value_b} <span className="text-sm font-normal text-gray-500 font-sans">{diff.unit_b}</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-1 font-medium">{diff.doc_b_name}</p>
                    <button 
                      onClick={() => setInspectDiff(diff)}
                      className="text-xs text-blue-600 hover:text-blue-800 mt-2 font-medium flex items-center cursor-pointer"
                    >
                      <Eye size={13} className="mr-1" /> {diff.page_b || 'Page 2'} • Compare Full Context
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="bg-gray-50/70 px-6 py-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-gray-500">
                  {diff.status === 'Resolved' && (
                    <span className="flex items-center text-green-700 font-medium">
                      <CheckCircle2 size={13} className="mr-1 text-green-600" />
                      Resolution: {diff.resolution || 'Confirmed accurate'}
                    </span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => setInspectDiff(diff)}
                    className="px-3.5 py-1.5 border border-gray-300 text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition cursor-pointer"
                  >
                    Inspect Side-by-Side
                  </button>
                  {diff.status !== 'Resolved' ? (
                    <button 
                      onClick={() => navigate('/resolve')}
                      className="flex items-center px-4 py-1.5 text-xs font-semibold rounded-lg text-white bg-blue-700 hover:bg-blue-800 transition cursor-pointer shadow-xs"
                    >
                      <GitMerge size={14} className="mr-1.5" />
                      Resolve Difference
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleQuickResolve(diff.id, 'Re-audited and confirmed')}
                      className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                    >
                      Re-open
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Side-by-Side Context Inspection Modal */}
      {inspectDiff && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-2xl w-full p-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Side-by-Side Source Comparison</h3>
                <p className="text-xs text-gray-500">Field: {inspectDiff.field} • Subsidiary: {inspectDiff.subsidiary}</p>
              </div>
              <button 
                onClick={() => setInspectDiff(null)} 
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <span className="text-xs font-bold text-blue-900 uppercase">Value in {inspectDiff.doc_a_name}</span>
                <div className="text-2xl font-bold text-blue-950 font-mono mt-2">
                  {inspectDiff.value_a} {inspectDiff.unit_a}
                </div>
                <div className="text-xs text-blue-700 mt-2">
                  Reference: {inspectDiff.page_a} ({inspectDiff.doc_a_id})
                </div>
              </div>

              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                <span className="text-xs font-bold text-purple-900 uppercase">Value in {inspectDiff.doc_b_name}</span>
                <div className="text-2xl font-bold text-purple-950 font-mono mt-2">
                  {inspectDiff.value_b} {inspectDiff.unit_b}
                </div>
                <div className="text-xs text-purple-700 mt-2">
                  Reference: {inspectDiff.page_b} ({inspectDiff.doc_b_id})
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-gray-500">Choose quick reconciliation decision:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleQuickResolve(inspectDiff.id, `Accepted Value A: ${inspectDiff.value_a} ${inspectDiff.unit_a}`)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Use Value A
                </button>
                <button
                  onClick={() => handleQuickResolve(inspectDiff.id, `Accepted Value B: ${inspectDiff.value_b} ${inspectDiff.unit_b}`)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Use Value B
                </button>
                <button
                  onClick={() => {
                    setInspectDiff(null);
                    navigate('/resolve');
                  }}
                  className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Open Full Resolver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Differences;
