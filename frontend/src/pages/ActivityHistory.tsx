import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { History, Filter, Search, User, Clock, CheckCircle2, Shield } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ActivityItem {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  page: string;
  item: string;
  status: string;
  details: string;
}

const ActivityHistoryPage: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await axios.get(`${API}/activity`);
      setActivities(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = activities.filter(a => {
    const matchesSearch = 
      a.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.page.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction ? a.action === filterAction : true;
    return matchesSearch && matchesAction;
  });

  const distinctActions = Array.from(new Set(activities.map(a => a.action)));

  const formatTime = (ts: string) => {
    if (!ts) return '';
    try {
      const d = new Date(ts);
      return d.toLocaleString();
    } catch {
      return ts;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Activity & Audit History</h1>
        <p className="text-sm text-gray-500">
          Complete immutable audit trail of document uploads, discrepancy resolutions, AI queries, and report downloads.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search user, action, details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Filter size={15} />
            <span className="font-medium">Action:</span>
          </div>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-600"
          >
            <option value="">All Actions ({activities.length})</option>
            {distinctActions.map(act => (
              <option key={act} value={act}>{act}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Activity Table */}
      {loading ? (
        <div className="flex justify-center p-16">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Module</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Details / Target</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition">
                    <td className="px-6 py-3 text-xs text-gray-500 whitespace-nowrap flex items-center">
                      <Clock size={13} className="mr-1.5 text-gray-400" />
                      {formatTime(item.timestamp)}
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <User size={13} className="text-gray-400" />
                        <span>{item.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 font-semibold text-gray-800 text-xs">
                      {item.action}
                    </td>
                    <td className="px-6 py-3 text-xs text-gray-600">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                        {item.page}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-xs text-gray-600 max-w-md truncate" title={item.details || item.item}>
                      {item.item ? <span className="font-semibold mr-1">{item.item}:</span> : null}
                      {item.details || '—'}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle2 size={11} className="mr-1" />
                        {item.status || 'Completed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
            <span>Showing {filtered.length} of {activities.length} total logged events</span>
            <span className="flex items-center text-gray-400">
              <Shield size={13} className="mr-1" /> MineSight Integrity Assured
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityHistoryPage;
