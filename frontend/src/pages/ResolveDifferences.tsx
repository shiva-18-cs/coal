import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GitMerge, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ResolveDifferences: React.FC = () => {
  const [diffs, setDiffs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/differences`).then(r => {
      setDiffs(r.data.filter((d: any) => d.status === 'Needs Review'));
      setLoading(false);
    });
  }, []);

  const handleResolve = async (diff: any, resolution: string) => {
    try {
      await axios.post(`${API}/differences/${diff.id}/resolve`, {
        resolution, reason: resolution, resolved_by: 'R.K. Sharma'
      });
      setDiffs(prev => prev.filter(d => d.id !== diff.id));
    } catch (e) { console.error(e); }
  };

  const isUnitMatch = (d: any) => {
    // Check if values are the same when converted
    const va = parseFloat(d.value_a.replace(/,/g, ''));
    const vb = parseFloat(d.value_b.replace(/,/g, ''));
    if (d.unit_a === 'MT' && d.unit_b === 'KG') return Math.abs(va * 1000000 - vb) < 1;
    if (d.unit_a === 'KG' && d.unit_b === 'MT') return Math.abs(vb * 1000000 - va) < 1;
    return false;
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Resolve Differences</h1>
        <p className="text-sm text-gray-500">Sometimes two documents show the same information in different units or formats. This page helps you check and resolve those differences.</p>
      </div>
      {loading ? (
        <div className="flex justify-center p-12"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>
      ) : diffs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center border border-gray-200">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">All differences have been resolved</h3>
          <p className="text-gray-500 mt-2">There are no pending differences to review.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {diffs.map(diff => {
            const unitMatch = isUnitMatch(diff);
            return (
              <div key={diff.id} className={`bg-white rounded-lg shadow border ${unitMatch ? 'border-green-200' : 'border-orange-200'} overflow-hidden`}>
                <div className={`px-6 py-4 ${unitMatch ? 'bg-green-50' : 'bg-orange-50'} border-b flex justify-between items-center`}>
                  <div className="flex items-center">
                    {unitMatch ? <CheckCircle className="text-green-600 mr-2" size={20} /> : <AlertTriangle className="text-orange-500 mr-2" size={20} />}
                    <h3 className="font-bold">{diff.field}</h3>
                    <span className="ml-3 px-2 py-0.5 text-xs font-semibold rounded bg-white border">{diff.diff_id}</span>
                  </div>
                  {unitMatch && <span className="text-sm font-semibold text-green-700">✓ These values are equal</span>}
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded border">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Document A</p>
                    <p className="text-2xl font-bold">{diff.value_a} <span className="text-sm font-normal text-gray-500">{diff.unit_a}</span></p>
                    <p className="text-xs text-gray-500 mt-1">{diff.doc_a_name}</p>
                    <p className="text-xs text-blue-600">{diff.page_a}</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowRight size={24} className="text-gray-300" />
                  </div>
                  <div className="bg-gray-50 p-4 rounded border">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Document B</p>
                    <p className="text-2xl font-bold">{diff.value_b} <span className="text-sm font-normal text-gray-500">{diff.unit_b}</span></p>
                    <p className="text-xs text-gray-500 mt-1">{diff.doc_b_name}</p>
                    <p className="text-xs text-blue-600">{diff.page_b}</p>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
                  {unitMatch ? (
                    <button onClick={() => handleResolve(diff, 'Same value confirmed (unit conversion)')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium flex items-center">
                      <CheckCircle size={16} className="mr-2" /> Confirm Match
                    </button>
                  ) : (
                    <>
                      <button onClick={() => handleResolve(diff, `Used value: ${diff.value_a} ${diff.unit_a}`)}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm">Use Value A</button>
                      <button onClick={() => handleResolve(diff, `Used value: ${diff.value_b} ${diff.unit_b}`)}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm">Use Value B</button>
                      <button onClick={() => handleResolve(diff, 'Not a difference')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">Not a Difference</button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default ResolveDifferences;
