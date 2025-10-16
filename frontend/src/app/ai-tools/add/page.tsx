'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function AddAiToolPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [aiToolsTypes, setAiToolsTypes] = useState<AiToolsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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

      const apiUrl = getApiUrl();

      // Fetch roles and AI tools types in parallel
      const [rolesResponse, typesResponse] = await Promise.all([
        fetch(`${apiUrl}/roles`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch(`${apiUrl}/ai-tools-types`, {
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

  const handleSubmit = (e: React.FormEvent) => {
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

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const apiUrl = getApiUrl();

      const response = await fetch(`${apiUrl}/ai-tools`, {
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
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Add New AI Tool</h1>
            <p className="text-gray-600">
              Fill in the details to add a new AI tool to the directory
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
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
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create AI Tool
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

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Confirm AI Tool Creation
              </h3>

              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to create "<strong className="text-gray-900">{formData.name}</strong>"?
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Types:</span>
                  <span className="text-gray-900 font-medium">{formData.selectedTypes.length} selected</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Roles:</span>
                  <span className="text-gray-900 font-medium">{formData.selectedRoles.length} selected</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSave}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Confirm & Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
