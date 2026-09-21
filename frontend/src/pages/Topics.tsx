import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Hash, FileText, Layers, Tag, ExternalLink } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface TopicItem {
  id: number;
  name: string;
  document_count: number;
  mention_count: number;
  keywords: string[];
  related_subsidiaries: string[];
}

const Topics: React.FC = () => {
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await axios.get(`${API}/topics`);
      setTopics(res.data);
      if (res.data.length > 0) {
        setSelectedTopic(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load topics', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTopics = topics.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Topics & Themes</h1>
        <p className="text-sm text-gray-500">
          Automated topic clustering across all geological reports, environment studies, safety logs, and production summaries.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Topics List */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[700px]">
            <div className="p-4 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search topics or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                <span>{filteredTopics.length} topics detected</span>
                <span>Sorted by mentions</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {filteredTopics.map((topic) => {
                const isSelected = selectedTopic?.id === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition flex items-start justify-between ${
                      isSelected ? 'bg-blue-50/70 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <div>
                      <h3 className={`text-sm font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                        {topic.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                        <span className="flex items-center">
                          <Layers size={12} className="mr-1 text-gray-400" />
                          {topic.document_count} docs
                        </span>
                        <span>•</span>
                        <span>{topic.mention_count} mentions</span>
                      </div>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-mono">
                      #{topic.id}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Topic Detail View */}
          <div className="lg:col-span-2">
            {selectedTopic ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                          <Hash size={20} />
                        </span>
                        <h2 className="text-xl font-bold text-gray-900">{selectedTopic.name}</h2>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 pl-10">
                        Synthesized cluster from enterprise reporting corpus
                      </p>
                    </div>
                    <a
                      href={`/search?q=${encodeURIComponent(selectedTopic.name)}`}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center font-medium"
                    >
                      Search this topic <ExternalLink size={14} className="ml-1" />
                    </a>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-medium">Mentions</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{selectedTopic.mention_count}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-medium">Covered Docs</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{selectedTopic.document_count}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-medium">Subsidiaries</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{selectedTopic.related_subsidiaries.length}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-medium">Associated Keywords</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{selectedTopic.keywords.length}</p>
                    </div>
                  </div>
                </div>

                {/* Keywords List */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                    <Tag size={16} className="mr-2 text-gray-500" />
                    Associated Semantic Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTopic.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200"
                      >
                        {kw.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Related Subsidiaries */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">
                    Active Subsidiaries
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTopic.related_subsidiaries.map((sub, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md border border-blue-100"
                      >
                        {sub.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Want to dive into this topic with conversational intelligence?
                  </span>
                  <a
                    href={`/ask-ai`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition"
                  >
                    Ask AI about {selectedTopic.name}
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                Select a topic from the list to view detailed analytics.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Topics;
