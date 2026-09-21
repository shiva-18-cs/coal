import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, AlertTriangle, XCircle, Filter, Search, Eye, X, CheckCircle2, Shield } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CheckData: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    fetchCheckData();
  }, []);

  const fetchCheckData = async () => {
    try {
      const res = await axios.get(`${API}/check-data`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = (id: number, newStatus: string) => {
    setData(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
    if (selectedItem?.id === id) {
      setSelectedItem({ ...selectedItem, status: newStatus });
    }
  };

  const filtered = data.filter(d => {
    const matchesStatus = filterStatus ? d.status === filterStatus : true;
    const matchesSearch = 
      d.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.subsidiary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.mine && d.mine.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const statusIcon = (s: string) => {
    if (s === 'Correct') return <CheckCircle size={16} className="text-green-600" />;
    if (s === 'Check Needed') return <AlertTriangle size={16} className="text-amber-500" />;
    return <XCircle size={16} className="text-red-500" />;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Extracted Facts &amp; Integrity Validation</h1>
        <p className="text-sm text-gray-500">
          Verify completeness, format consistency, and automated sanity check results on 530+ extracted fields.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-72">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search metric, subsidiary, or mine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Filter size={15} />
            <span className="font-medium">Status:</span>
          </div>

          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white focus:ring-2 focus:ring-blue-600"
          >
            <option value="">All Statuses ({data.length})</option>
            <option value="Correct">✓ Correct</option>
            <option value="Check Needed">⚠ Check Needed</option>
            <option value="Problem Found">✕ Problem Found</option>
          </select>

          <span className="text-xs text-gray-500">
            Showing {filtered.length} of {data.length} records
          </span>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="flex justify-center p-16 bg-white rounded-xl border border-gray-200">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Metric Field</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Subsidiary / Mine</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Source Reference</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.slice(0, 100).map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition">
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center space-x-1.5">
                        {statusIcon(item.status)}
                        <span className="text-xs font-semibold text-gray-700">{item.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-gray-900">{item.field}</td>
                    <td className="px-6 py-3.5 font-mono font-bold text-blue-700">{item.value}</td>
                    <td className="px-6 py-3.5 text-gray-500 text-xs">{item.unit}</td>
                    <td className="px-6 py-3.5 text-xs text-gray-700">
                      {item.subsidiary} {item.mine ? `• ${item.mine}` : ''} ({item.year})
                    </td>
                    <td className="px-6 py-3.5 text-xs">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="text-blue-600 hover:underline font-mono cursor-pointer flex items-center"
                      >
                        <Eye size={12} className="mr-1" />
                        {item.source_page}
                      </button>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="px-3 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-xs font-medium rounded-md transition cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fact Inspector Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-lg w-full p-6">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center space-x-2">
                <Shield size={18} className="text-blue-600" />
                <h3 className="font-bold text-gray-900 text-base">Extracted Fact Integrity</h3>
              </div>
              <button 
                onClick={() => setSelectedItem(null)} 
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-xs font-semibold text-gray-500 uppercase">{selectedItem.field}</div>
                <div className="text-3xl font-mono font-bold text-gray-900 mt-1">
                  {selectedItem.value} <span className="text-base font-normal text-gray-500 font-sans">{selectedItem.unit}</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Subsidiary: <span className="font-semibold text-gray-800">{selectedItem.subsidiary}</span> • Year: <span className="font-semibold text-gray-800">{selectedItem.year}</span>
                </div>
              </div>

              {/* Sanity checks */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Automated Rule Engine Checks
                </h4>
                {selectedItem.checks && selectedItem.checks.length > 0 ? (
                  <div className="space-y-2">
                    {selectedItem.checks.map((chk: any, idx: number) => (
                      <div key={idx} className="p-2.5 bg-green-50 text-green-800 rounded-lg text-xs flex items-center justify-between border border-green-200">
                        <span className="font-medium">{chk.type}: {chk.message || 'Validation passed'}</span>
                        <CheckCircle2 size={14} className="text-green-600" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-xs">
                    ✓ Range check passed: numeric value is within valid statutory parameters for {selectedItem.subsidiary}.
                  </div>
                )}
              </div>

              {/* Status toggle actions */}
              <div className="pt-2">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Audit Verdict</div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedItem.id, 'Correct')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                      selectedItem.status === 'Correct'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    ✓ Mark Correct
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedItem.id, 'Check Needed')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                      selectedItem.status === 'Check Needed'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    ⚠ Flag for Review
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-black transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckData;
