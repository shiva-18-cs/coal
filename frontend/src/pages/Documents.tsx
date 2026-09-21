import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Search as SearchIcon, 
  Eye, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Building2, 
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface DocumentRecord {
  id: number;
  doc_id: string;
  name: string;
  doc_type: string;
  year: number;
  subsidiary: string;
  mine: string;
  department: string;
  upload_date: string;
  uploaded_by: string;
  status: string;
  reading_accuracy: number;
  pages: number;
  file_type: string;
}

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('');
  const [subsidiaryFilter, setSubsidiaryFilter] = useState('');

  // Modals
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [viewDoc, setViewDoc] = useState<any>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await axios.get(`${API}/documents`);
      setDocuments(res.data);
    } catch (error) {
      console.error("Error fetching documents", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const res = await axios.post(`${API}/documents/upload`);
      await fetchDocs();
      setIsUploading(false);
      setUploadModalOpen(false);
      // Auto open preview of the newly ingested document
      handleViewDoc(res.data.id);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  const handleViewDoc = async (id: number) => {
    setViewLoading(true);
    try {
      const res = await axios.get(`${API}/documents/${id}`);
      setViewDoc(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setViewLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this document and its extracted index?")) return;
    try {
      await axios.delete(`${API}/documents/${id}`);
      setDocuments(prev => prev.filter(d => d.id !== id));
      if (viewDoc?.document?.id === id) setViewDoc(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = (doc: DocumentRecord) => {
    const blob = new Blob([
      `MineSight Ingested Document Extract\nDocument ID: ${doc.doc_id}\nName: ${doc.name}\nSubsidiary: ${doc.subsidiary}\nMine: ${doc.mine}\nFiscal Year: ${doc.year}\nPages: ${doc.pages}\nReading Accuracy: ${doc.reading_accuracy}%\nUploaded By: ${doc.uploaded_by}`
    ], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.doc_id}_summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredDocs = documents.filter(d => {
    const matchesSearch = 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      d.subsidiary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.doc_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.mine && d.mine.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = docTypeFilter ? d.doc_type === docTypeFilter : true;
    const matchesSub = subsidiaryFilter ? d.subsidiary === subsidiaryFilter : true;
    return matchesSearch && matchesType && matchesSub;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Archive</h1>
          <p className="text-sm text-gray-500">Ingest, search, inspect extracted tables, and audit OCR document text.</p>
        </div>
        <button 
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg shadow-xs transition text-sm self-start sm:self-auto cursor-pointer"
        >
          <Upload size={16} className="mr-2" />
          Upload &amp; Extract Document
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-72">
          <SearchIcon size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, ID, or mine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center space-x-3">
          <select 
            value={docTypeFilter}
            onChange={(e) => setDocTypeFilter(e.target.value)}
            className="py-2 px-3 border border-gray-300 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">All Document Types</option>
            <option value="Annual Mining Report">Annual Mining Report</option>
            <option value="Production Report">Production Report</option>
            <option value="Geological Report">Geological Report</option>
            <option value="Safety Report">Safety Report</option>
            <option value="Environmental Report">Environmental Report</option>
          </select>

          <select 
            value={subsidiaryFilter}
            onChange={(e) => setSubsidiaryFilter(e.target.value)}
            className="py-2 px-3 border border-gray-300 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">All Subsidiaries</option>
            {['MCL', 'WCL', 'NCL', 'SECL', 'CCL', 'BCCL', 'ECL'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <span className="text-xs text-gray-500 font-medium">
            {filteredDocs.length} of {documents.length}
          </span>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="p-16 flex justify-center bg-white rounded-xl border border-gray-200">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Document</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type &amp; Dept</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Subsidiary / Mine</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Accuracy</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 text-blue-700 rounded-lg shrink-0">
                          <FileText size={18} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{doc.name}</div>
                          <div className="text-xs text-gray-400 font-mono">{doc.doc_id} • {doc.pages} pages</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      <div className="font-medium text-gray-800">{doc.doc_type}</div>
                      <div className="text-gray-400">{doc.department || 'Operations'}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-700">
                      <div className="font-semibold text-gray-900 flex items-center">
                        <Building2 size={13} className="mr-1 text-gray-400" />
                        {doc.subsidiary}
                      </div>
                      <div className="text-gray-500">{doc.mine || 'Area Level'} • FY {doc.year}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono">
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 font-bold rounded border border-green-200">
                        {doc.reading_accuracy || 98.4}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button 
                        onClick={() => handleViewDoc(doc.id)} 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition cursor-pointer" 
                        title="View Extracted Facts & Text"
                      >
                        <Eye size={17} />
                      </button>
                      <button 
                        onClick={() => handleDownload(doc)} 
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition cursor-pointer" 
                        title="Download Summary"
                      >
                        <Download size={17} />
                      </button>
                      <button 
                        onClick={() => handleDelete(doc.id)} 
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition cursor-pointer" 
                        title="Delete Document"
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                  <Upload size={18} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Upload Mining Document</h3>
              </div>
              <button 
                onClick={() => setUploadModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition bg-gray-50/50">
                <FileText className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">Annual_Production_Report_2024.pdf</p>
                <p className="text-xs text-gray-400 mt-1">PDF, DOCX, XLSX up to 50MB</p>
                <div className="mt-3 inline-flex items-center text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                  <Sparkles size={13} className="mr-1" /> Automated Optical Character Recognition Ready
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Target Subsidiary</label>
                <select className="w-full border border-gray-300 rounded-lg p-2.5 text-sm">
                  {['MCL', 'WCL', 'NCL', 'SECL', 'CCL', 'BCCL', 'ECL'].map(s => (
                    <option key={s} value={s}>{s} (Coalfields Limited)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Report Category</label>
                <select className="w-full border border-gray-300 rounded-lg p-2.5 text-sm">
                  <option>Annual Mining Report</option>
                  <option>Production Report</option>
                  <option>Geological Reserve Assessment</option>
                  <option>Safety Audit</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 text-sm bg-blue-700 hover:bg-blue-800 text-white rounded-md font-semibold transition disabled:opacity-50 cursor-pointer flex items-center"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Extracting Information...
                    </>
                  ) : (
                    'Upload & Extract'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Details & Extracted Facts Modal */}
      {viewDoc && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-3xl w-full p-6 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-start border-b border-gray-200 pb-4 mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {viewDoc.document?.doc_id}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    FY {viewDoc.document?.year}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mt-1">{viewDoc.document?.name}</h3>
                <p className="text-xs text-gray-500">
                  {viewDoc.document?.subsidiary} • {viewDoc.document?.mine} • Accuracy: {viewDoc.document?.reading_accuracy}%
                </p>
              </div>
              <button 
                onClick={() => setViewDoc(null)} 
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {/* Extracted Facts Table */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center">
                  <CheckCircle size={14} className="text-green-600 mr-1.5" />
                  Extracted Structured Facts ({viewDoc.extracted_information?.length || 0})
                </h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-600">Metric</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-600">Value</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-600">Unit</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-600">Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {viewDoc.extracted_information?.map((info: any) => (
                        <tr key={info.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2.5 font-semibold text-gray-800">{info.field}</td>
                          <td className="px-4 py-2.5 font-mono font-bold text-blue-700">{info.value}</td>
                          <td className="px-4 py-2.5 text-gray-500">{info.unit}</td>
                          <td className="px-4 py-2.5 text-blue-600 font-mono">{info.source_page}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Document Text Snippet */}
              {viewDoc.document_text && viewDoc.document_text.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center">
                    <Layers size={14} className="text-blue-600 mr-1.5" />
                    OCR Raw Text Excerpt (Page {viewDoc.document_text[0].page})
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs text-gray-700 leading-relaxed font-mono">
                    {viewDoc.document_text[0].text}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setViewDoc(null)}
                className="px-5 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-black transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
