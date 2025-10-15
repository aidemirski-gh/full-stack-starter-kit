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

export default function AddAiToolPage() {
  const router = useRouter();
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
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch roles and AI tools types in parallel
      const [rolesResponse, typesResponse] = await Promise.all([
        fetch('http://localhost:8201/api/roles', {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch('http://localhost:8201/api/ai-tools-types', {
          headers: {
            'Accept': 'application/json',
          },
        }),
      ]);

      if (rolesResponse.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!rolesResponse.ok || !typesResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const rolesResult = await rolesResponse.json();
      const typesResult = await typesResponse.json();

      setRoles(rolesResult.data);
      setAiToolsTypes(typesResult.data);
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
      setFormError('AI Tool name is required');
      return;
    }

    if (!formData.link.trim()) {
      setFormError('Website link is required');
      return;
    }

    if (!formData.description.trim()) {
      setFormError('Description is required');
      return;
    }

    if (!formData.usage.trim()) {
      setFormError('Usage information is required');
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
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:8201/api/ai-tools', {
        method: 'POST',
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

      if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join(', ');
          setFormError(errorMessages);
        } else {
          setFormError(result.message || 'Failed to create AI tool');
        }
        return;
      }

      // Success - redirect to AI tools page
      router.push('/ai-tools');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New AI Tool</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details to add a new AI tool to the directory
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {formError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                AI Tool Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                placeholder="e.g., ChatGPT, Claude, DALL-E"
                disabled={submitting}
                maxLength={255}
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
                  <div
                    key={type.id}
                    className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                  >
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

            {/* Website Link */}
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                Website Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                placeholder="https://example.com"
                disabled={submitting}
                maxLength={255}
              />
            </div>

            {/* Documentation Link */}
            <div>
              <label htmlFor="documentation" className="block text-sm font-medium text-gray-700 mb-1">
                Documentation Link <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="url"
                id="documentation"
                name="documentation"
                value={formData.documentation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                placeholder="https://docs.example.com"
                disabled={submitting}
                maxLength={255}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                placeholder="Provide a detailed description of the AI tool, its capabilities, and what makes it unique..."
                disabled={submitting}
              />
            </div>

            {/* Usage */}
            <div>
              <label htmlFor="usage" className="block text-sm font-medium text-gray-700 mb-1">
                Usage <span className="text-red-500">*</span>
              </label>
              <textarea
                id="usage"
                name="usage"
                value={formData.usage}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                placeholder="Describe how to use the tool, common use cases, access methods, pricing, etc..."
                disabled={submitting}
              />
            </div>

            {/* Roles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accessible by Roles <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Select one or more roles that can access this AI tool
              </p>
              <div className="space-y-2">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                  >
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
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creating...' : 'Create AI Tool'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/ai-tools')}
                className="flex-1 sm:flex-none px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 focus:outline-none"
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
