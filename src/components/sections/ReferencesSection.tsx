'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { Input, Button } from '@/components/ui';
import { useState } from 'react';
import type { Reference } from '@/types/resume';

export const ReferencesSection: React.FC = () => {
  const { resumeData, addReference, updateReference, deleteReference } = useResumeStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    city: '',
    phone: '',
    email: ''
  });

  const resetForm = () => {
    setFormData({ name: '', organization: '', city: '', phone: '', email: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.organization) return;

    if (editingId) {
      updateReference(editingId, formData);
    } else {
      addReference(formData);
    }
    resetForm();
  };

  const handleEdit = (reference: Reference) => {
    setFormData({
      name: reference.name,
      organization: reference.organization,
      city: reference.city,
      phone: reference.phone,
      email: reference.email
    });
    setEditingId(reference.id);
    setIsAdding(true);
  };

  return (
    <div className="space-y-4">
      {/* Existing References */}
      {resumeData.references.map((reference) => (
        <div key={reference.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{reference.name}</h4>
              <p className="text-sm text-gray-600">{reference.organization} • {reference.city}</p>
              <div className="text-xs text-gray-500 mt-1">
                {reference.phone && <span>Phone: {reference.phone}</span>}
                {reference.phone && reference.email && <span> • </span>}
                {reference.email && <span>Email: {reference.email}</span>}
              </div>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => handleEdit(reference)} className="btn-icon" title="Edit">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button onClick={() => deleteReference(reference.id)} className="btn-icon text-red-600 hover:text-red-700" title="Delete">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="border border-primary-200 rounded-lg p-4 bg-primary-50">
          <div className="space-y-4">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., John Smith"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Organization"
                value={formData.organization}
                onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                placeholder="e.g., ABC Company"
                required
              />
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="e.g., New York, NY"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="e.g., +1 (555) 123-4567"
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="e.g., john@company.com"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSubmit} disabled={!formData.name || !formData.organization}>
                {editingId ? 'Update' : 'Add'} Reference
              </Button>
              <Button variant="secondary" onClick={resetForm}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-colors"
        >
          + Add Reference
        </button>
      )}
    </div>
  );
}; 