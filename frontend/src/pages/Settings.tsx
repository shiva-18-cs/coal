import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Settings as SettingsIcon, Save, CheckCircle2, Shield, Database, Cpu, FileCheck } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API}/settings`);
      setSettings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/settings`, settings);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex justify-center p-16">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
          <p className="text-sm text-gray-500">
            Configure application runtime, AI intelligence endpoints, OCR extraction thresholds, and database storage.
          </p>
        </div>
        {savedMessage && (
          <div className="flex items-center text-xs font-semibold bg-green-100 text-green-800 px-3 py-1.5 rounded-lg border border-green-200 animate-fade-in">
            <CheckCircle2 size={14} className="mr-1.5" />
            Configurations Saved
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Application Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 text-gray-900 font-bold mb-4 pb-2 border-b border-gray-100">
            <Shield size={18} className="text-blue-600" />
            <span>Platform Overview</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Application Name</label>
              <input
                type="text"
                value={settings.general?.app_name || 'MineSight'}
                disabled
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm font-medium text-gray-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Version Build</label>
              <input
                type="text"
                value={settings.general?.version || '1.0.0 (Production Core)'}
                disabled
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm font-mono text-gray-700"
              />
            </div>
          </div>
        </div>

        {/* AI & Cognitive Engine */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 text-gray-900 font-bold mb-4 pb-2 border-b border-gray-100">
            <Cpu size={18} className="text-indigo-600" />
            <span>Cognitive & Natural Language Engine</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">AI Reasoning Provider</label>
              <select
                value={settings.ai?.provider || 'Built-in Engine'}
                onChange={(e) => setSettings({ ...settings, ai: { ...settings.ai, provider: e.target.value } })}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-600"
              >
                <option value="Built-in Engine">Built-in Offline Intelligence (CMPDI On-Prem)</option>
                <option value="External LLM Integration">Enterprise Ollama / Local Private LLM</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Inference Model</label>
              <input
                type="text"
                value={settings.ai?.model || 'Deterministic Mining Rule Engine'}
                onChange={(e) => setSettings({ ...settings, ai: { ...settings.ai, model: e.target.value } })}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Document Ingestion & Storage */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 text-gray-900 font-bold mb-4 pb-2 border-b border-gray-100">
            <FileCheck size={18} className="text-emerald-600" />
            <span>Document Ingestion & OCR Processing</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">OCR Parser Engine</label>
              <input
                type="text"
                value={settings.document_processing?.ocr_provider || 'Hybrid PDF/OCR Engine'}
                disabled
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Supported File Extensions</label>
              <input
                type="text"
                value={settings.document_processing?.supported_formats || 'PDF, DOCX, XLSX, CSV'}
                disabled
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-700 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Persistence & Export */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 text-gray-900 font-bold mb-4 pb-2 border-b border-gray-100">
            <Database size={18} className="text-amber-600" />
            <span>Persistence & Exports</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Database Engine</label>
              <input
                type="text"
                value={settings.database?.mode || 'SQLite (Local High-Performance)'}
                disabled
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-700 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Database Location</label>
              <input
                type="text"
                value={settings.database?.path || 'data/minesight.db'}
                disabled
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-700 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg text-sm transition shadow-sm"
          >
            <Save size={16} className="mr-2" />
            Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
