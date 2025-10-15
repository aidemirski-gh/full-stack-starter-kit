'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Role {
  id: number;
  name: string;
  description: string;
}

interface AiToolsType {
  id: number;
  name: string;
  description: string;
}

interface AiTool {
  id: number;
  name: string;
  link: string;
  documentation: string | null;
  description: string;
  usage: string;
  created_at: string;
  roles?: Role[];
  ai_tools_type?: AiToolsType;
  ai_tools_types?: AiToolsType[];
}

export default function AiToolsPage() {
  const router = useRouter();
  const [aiTools, setAiTools] = useState<AiTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAiTools();
  }, []);

  const fetchAiTools = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:8201/api/ai-tools', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch AI tools');
      }

      const result = await response.json();
      setAiTools(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Tools Directory</h1>
            <p className="mt-2 text-sm text-gray-600">
              Explore popular AI tools and their capabilities
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/ai-tools/add')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New AI Tool
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* AI Tools Grid */}
        {aiTools.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No AI tools found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {aiTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Tool Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="mb-2">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          {tool.name}
                        </h2>
                        {tool.ai_tools_types && tool.ai_tools_types.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {tool.ai_tools_types.map((type) => (
                              <span
                                key={type.id}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800"
                                title={type.description}
                              >
                                {type.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 mb-3">
                        <a
                          href={tool.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          Visit Website
                        </a>
                        {tool.documentation && (
                          <a
                            href={tool.documentation}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-green-600 hover:text-green-800 font-medium"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            Documentation
                          </a>
                        )}
                      </div>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 ml-4">
                      ID: {tool.id}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  {/* Usage */}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Usage</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {tool.usage}
                    </p>
                  </div>

                  {/* Accessible by Roles */}
                  {tool.roles && tool.roles.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Accessible by Roles
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {tool.roles.map((role) => (
                          <span
                            key={role.id}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                            title={role.description}
                          >
                            {role.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Created Date */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Added on {new Date(tool.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600">
            Total AI Tools: <span className="font-semibold text-gray-900">{aiTools.length}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
