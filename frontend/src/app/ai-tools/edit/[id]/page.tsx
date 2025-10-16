'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { getApiUrl } from '@/lib/config';

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

export default function EditAiToolPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [roles, setRoles] = useState<Role[]>([]);
  const [aiToolsTypes, setAiToolsTypes] = useState<AiToolsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    documentation: '',
    description: '',
    usage: '',
    selectedTypes: [] as number[],
    selectedRoles: [] as number[],
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const apiUrl = getApiUrl();

      // Fetch AI tool, roles, and AI tools types in parallel
      const [toolResponse, rolesResponse, typesResponse] = await Promise.all([
        fetch(`${apiUrl}/api/ai-tools/${id}`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch(`${apiUrl}/api/roles`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch(`${apiUrl}/api/ai-tools-types`, {
          headers: {
            'Accept': 'application/json',
          },
        }),
      ]);

      if (toolResponse.status === 401 || rolesResponse.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!toolResponse.ok) {
        throw new Error('Failed to fetch AI tool');
      }

      if (!rolesResponse.ok || !typesResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const toolResult = await toolResponse.json();
      const rolesResult = await rolesResponse.json();
      const typesResult = await typesResponse.json();

      const tool = toolResult.data;

      setRoles(rolesResult.data);
      setAiToolsTypes(typesResult.data);

      // Populate form with existing data
      setFormData({
        name: tool.name,
        link: tool.link,
        documentation: tool.documentation || '',
        description: tool.description,
        usage: tool.usage,
        selectedTypes: tool.ai_tools_types?.map((t: AiToolsType) => t.id) || [],
        selectedRoles: tool.roles?.map((r: Role) => r.id) || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeToggle = (typeId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedTypes: prev.selectedTypes.includes(typeId)
        ? prev.selectedTypes.filter(id => id !== typeId)
        : [...prev.selectedTypes, typeId]
    }));
  };

  const handleRoleToggle = (roleId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedRoles: prev.selectedRoles.includes(roleId)
        ? prev.selectedRoles.filter(id => id !== roleId)
        : [...prev.selectedRoles, roleId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!formData.name.trim()) {
      setFormError('Name is required');
      return;
    }

    if (!formData.link.trim()) {
      setFormError('Link is required');
      return;
    }

    if (!formData.description.trim()) {
      setFormError('Description is required');
      return;
    }

    if (!formData.usage.trim()) {
      setFormError('Usage is required');
      return;
    }

    if (formData.selectedTypes.length === 0) {
      setFormError('Please select at least one AI tool type');
      return;
    }

    if (formData.selectedRoles.length === 0) {
      setFormError('Please select at least one role');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setFormError('You must be logged in to update an AI tool');
        return;
      }

      const apiUrl = getApiUrl();

      const response = await fetch(`${apiUrl}/api/ai-tools/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          link: formData.link,
          documentation: formData.documentation || null,
          description: formData.description,
          usage: formData.usage,
          ai_tools_type_ids: formData.selectedTypes,
          role_ids: formData.selectedRoles,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update AI tool');
      }

      // Redirect to AI tools list page on success
      router.push('/ai-tools');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full"></div>
            <div className="text-gray-500 font-medium">Loading...</div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <div className="flex items-center space-x-3 mb-2">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-red-900">Error</h3>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Edit AI Tool</h1>
            <p className="text-gray-600">
              Update the details of this AI tool
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
          {formError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., ChatGPT"
                required
                disabled={submitting}
              />
            </div>

            {/* Link */}
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://example.com"
                required
                disabled={submitting}
              />
            </div>

            {/* Documentation */}
            <div>
              <label htmlFor="documentation" className="block text-sm font-medium text-gray-700 mb-2">
                Documentation Link
              </label>
              <input
                type="url"
                id="documentation"
                name="documentation"
                value={formData.documentation}
                onChange={handleInputChange}
                className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://docs.example.com"
                disabled={submitting}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe what this AI tool does..."
                required
                disabled={submitting}
              />
            </div>

            {/* Usage */}
            <div>
              <label htmlFor="usage" className="block text-sm font-medium text-gray-700 mb-2">
                Usage <span className="text-red-500">*</span>
              </label>
              <textarea
                id="usage"
                name="usage"
                value={formData.usage}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Explain how to use this AI tool..."
                required
                disabled={submitting}
              />
            </div>

            {/* AI Tool Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Tool Types <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Select one or more types that describe this AI tool
              </p>
              <div className="space-y-2">
                {aiToolsTypes.map((type) => (
                  <div key={type.id} className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                    <input
                      type="checkbox"
                      id={`type-${type.id}`}
                      checked={formData.selectedTypes.includes(type.id)}
                      onChange={() => handleTypeToggle(type.id)}
                      className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      disabled={submitting}
                    />
                    <label htmlFor={`type-${type.id}`} className="ml-3 flex-1 cursor-pointer">
                      <span className="block text-sm font-medium text-gray-900">
                        {type.name}
                      </span>
                      <span className="block text-xs text-gray-500">
                        {type.description}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Roles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accessible by Roles <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Select which roles can access this AI tool
              </p>
              <div className="space-y-2">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                    <input
                      type="checkbox"
                      id={`role-${role.id}`}
                      checked={formData.selectedRoles.includes(role.id)}
                      onChange={() => handleRoleToggle(role.id)}
                      className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      disabled={submitting}
                    />
                    <label htmlFor={`role-${role.id}`} className="ml-3 flex-1 cursor-pointer">
                      <span className="block text-sm font-medium text-gray-900">
                        {role.name}
                      </span>
                      <span className="block text-xs text-gray-500">
                        {role.description}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Update AI Tool
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/ai-tools')}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                disabled={submitting}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    </AppLayout>
  );
}
