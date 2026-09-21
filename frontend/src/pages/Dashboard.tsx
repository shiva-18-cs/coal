import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Files, FileCheck, CheckCircle, AlertTriangle, FileText, MessageSquare, ArrowRight, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState<string>('');

  useEffect(() => {
    fetchStats();
  }, [selectedYear, selectedSubsidiary]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedYear) params.year = parseInt(selectedYear);
      if (selectedSubsidiary) params.subsidiary = selectedSubsidiary;
      const res = await axios.get(`${API}/dashboard`, { params });
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    { 
      name: 'Total Documents', 
      value: stats.total_documents, 
      icon: <Files size={24} className="text-blue-600" />,
      path: '/documents',
      desc: 'View all reports'
    },
    { 
      name: 'Documents Processed', 
      value: stats.processed_documents, 
      icon: <FileCheck size={24} className="text-emerald-600" />,
      path: '/documents',
      desc: 'OCR & indexed'
    },
    { 
      name: 'Information Found', 
      value: stats.information_found, 
      icon: <CheckCircle size={24} className="text-teal-600" />,
      path: '/check-data',
      desc: 'Extracted metrics'
    },
    { 
      name: 'Differences Found', 
      value: stats.differences_found, 
      icon: <AlertTriangle size={24} className="text-amber-600" />,
      path: '/differences',
      desc: 'Requires review'
    },
    { 
      name: 'Reports Created', 
      value: stats.reports_created, 
      icon: <FileText size={24} className="text-purple-600" />,
      path: '/reports',
      desc: 'Generated files'
    },
    { 
      name: 'AI Questions', 
      value: stats.ai_questions, 
      icon: <MessageSquare size={24} className="text-indigo-600" />,
      path: '/ask-ai',
      desc: 'Queries resolved'
    },
  ] : [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enterprise Dashboard</h1>
          <p className="text-sm text-gray-500">Live operational overview, extracted mining facts, and discrepancy audits.</p>
        </div>
        <div className="flex flex-wrap items-center space-x-3">
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
          >
            <option value="">All Years</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>
          <select 
            value={selectedSubsidiary} 
            onChange={(e) => setSelectedSubsidiary(e.target.value)}
            className="border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
          >
            <option value="">All Subsidiaries</option>
            {['MCL', 'WCL', 'NCL', 'SECL', 'CCL', 'BCCL', 'ECL'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {loading || !stats ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Clickable KPI Stat Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {statCards.map((card) => (
              <button
                key={card.name}
                onClick={() => navigate(card.path)}
                className="bg-white p-5 text-left rounded-xl shadow-xs border border-gray-200 hover:border-blue-400 hover:shadow-md transition group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <span className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition">
                    {card.icon}
                  </span>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-blue-600 transition" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                  <div className="text-xs font-semibold text-gray-700 mt-0.5">{card.name}</div>
                  <div className="text-[11px] text-gray-400 mt-1">{card.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 5-Year Production Trend Line Chart */}
            <div className="bg-white p-6 shadow-xs rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Production Trend (MT)</h2>
                  <p className="text-xs text-gray-500">Historical performance across coal subsidiaries</p>
                </div>
                <span className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                  <TrendingUp size={16} />
                </span>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.production_trend || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="year" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    {(!selectedSubsidiary || selectedSubsidiary === 'MCL') && (
                      <Line type="monotone" dataKey="MCL" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} />
                    )}
                    {(!selectedSubsidiary || selectedSubsidiary === 'WCL') && (
                      <Line type="monotone" dataKey="WCL" stroke="#059669" strokeWidth={2} dot={{ r: 3 }} />
                    )}
                    {(!selectedSubsidiary || selectedSubsidiary === 'NCL') && (
                      <Line type="monotone" dataKey="NCL" stroke="#D97706" strokeWidth={2} dot={{ r: 3 }} />
                    )}
                    {(!selectedSubsidiary || selectedSubsidiary === 'SECL') && (
                      <Line type="monotone" dataKey="SECL" stroke="#7C3AED" strokeWidth={2} dot={{ r: 3 }} />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Target vs Actual Bar Chart */}
            <div className="bg-white p-6 shadow-xs rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Target vs Actual Output ({selectedYear || '2024'})</h2>
                  <p className="text-xs text-gray-500">Achievement comparison in Million Tonnes (MT)</p>
                </div>
                <button 
                  onClick={() => navigate('/analytics')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  View Details &rarr;
                </button>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.target_vs_actual || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="target" name="Target (MT)" fill="#93C5FD" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" name="Actual (MT)" fill="#1D4ED8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Audit Activities Table with Link */}
          {stats.recent_activity && stats.recent_activity.length > 0 && (
            <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900">Recent Enterprise Audit Actions</h2>
                <button
                  onClick={() => navigate('/activity')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Full Activity Log <ArrowRight size={13} className="ml-1" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Details</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stats.recent_activity.slice(0, 5).map((act: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2.5 font-medium text-gray-900 text-xs">{act.user}</td>
                        <td className="px-4 py-2.5 font-semibold text-blue-700 text-xs">{act.action}</td>
                        <td className="px-4 py-2.5 text-gray-600 text-xs truncate max-w-sm">{act.details || '—'}</td>
                        <td className="px-4 py-2.5 text-gray-400 text-xs">{new Date(act.timestamp).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
