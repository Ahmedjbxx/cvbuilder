'use client';

import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useResumeStore } from '@/store/useResumeStore';
import { Input, Button, Select, RichTextEditor } from '@/components/ui';
import type { Certificate } from '@/types/resume';

const monthOptions = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 50 }, (_, i) => {
  const year = currentYear - i + 10;
  return { value: year.toString(), label: year.toString() };
});

interface DragItem {
  type: string;
  id: string;
  index: number;
}

interface DraggableCertificateItemProps {
  certificate: Certificate;
  index: number;
  moveCertificate: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (certificate: Certificate) => void;
  onDelete: (id: string) => void;
  formatDateRange: (certificate: Certificate) => string;
}

const DraggableCertificateItem: React.FC<DraggableCertificateItemProps> = ({
  certificate,
  index,
  moveCertificate,
  onEdit,
  onDelete,
  formatDateRange,
}) => {
  const dragRef = React.useRef<HTMLDivElement>(null);
  const dropRef = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'certificate',
    item: { type: 'certificate', id: certificate.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'certificate',
    hover: (item: DragItem) => {
      if (!item) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveCertificate(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  drag(dragRef);
  drop(dropRef);

  return (
    <div
      ref={dropRef}
      className={`border border-gray-200 rounded-lg p-4 bg-gray-50 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start space-x-3 flex-1">
          <div
            ref={dragRef}
            className="cursor-move text-gray-400 hover:text-gray-600 mt-1"
            title="Drag to reorder"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{certificate.name}</h4>
            <p className="text-sm text-gray-600">{formatDateRange(certificate)}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => onEdit(certificate)} className="btn-icon" title="Edit">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button onClick={() => onDelete(certificate.id)} className="btn-icon text-red-600 hover:text-red-700" title="Delete">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      {certificate.description && (
        <div className="text-sm text-gray-700 mt-2" dangerouslySetInnerHTML={{ __html: certificate.description }} />
      )}
    </div>
  );
};

export const CertificatesSection: React.FC = () => {
  const { resumeData, addCertificate, updateCertificate, deleteCertificate, reorderCertificates } = useResumeStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    date: '',
    startMonth: '',
    startYear: '',
    endMonth: '',
    endYear: '',
    ongoing: false,
    description: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      issuer: '',
      date: '',
      startMonth: '',
      startYear: '',
      endMonth: '',
      endYear: '',
      ongoing: false,
      description: ''
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.startMonth || !formData.startYear) return;

    if (editingId) {
      updateCertificate(editingId, formData);
    } else {
      addCertificate(formData);
    }
    resetForm();
  };

  const handleEdit = (certificate: Certificate) => {
    setFormData({
      name: certificate.name,
      issuer: certificate.issuer,
      date: certificate.date,
      startMonth: certificate.startMonth,
      startYear: certificate.startYear,
      endMonth: certificate.endMonth,
      endYear: certificate.endYear,
      ongoing: certificate.ongoing,
      description: certificate.description
    });
    setEditingId(certificate.id);
    setIsAdding(true);
  };

  const formatDateRange = (certificate: Certificate) => {
    const startDate = `${monthOptions.find(m => m.value === certificate.startMonth)?.label} ${certificate.startYear}`;
    if (certificate.ongoing) {
      return `${startDate} - Present`;
    }
    const endDate = certificate.endMonth && certificate.endYear 
      ? `${monthOptions.find(m => m.value === certificate.endMonth)?.label} ${certificate.endYear}`
      : '';
    return endDate ? `${startDate} - ${endDate}` : startDate;
  };

  const moveCertificate = (dragIndex: number, hoverIndex: number) => {
    const draggedItem = resumeData.certificates[dragIndex];
    const newCertificates = [...resumeData.certificates];
    newCertificates.splice(dragIndex, 1);
    newCertificates.splice(hoverIndex, 0, draggedItem);
    reorderCertificates(newCertificates);
  };

  return (
    <div className="space-y-4">
      {/* Existing Certificates */}
      {resumeData.certificates.map((certificate, index) => (
        <DraggableCertificateItem
          key={certificate.id}
          certificate={certificate}
          index={index}
          moveCertificate={moveCertificate}
          onEdit={handleEdit}
          onDelete={deleteCertificate}
          formatDateRange={formatDateRange}
        />
      ))}

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="border border-primary-200 rounded-lg p-4 bg-primary-50">
          <div className="space-y-4">
            <Input
              label="Certificate Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., AWS Certified Solutions Architect"
              required
            />
            <Input
              label="Issuing Organization"
              value={formData.issuer}
              onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
              placeholder="e.g., Amazon Web Services"
              required
            />
            <div className="grid grid-cols-4 gap-4">
              <Select
                label="Issue Month"
                value={formData.startMonth}
                onChange={(e) => setFormData(prev => ({ ...prev, startMonth: e.target.value }))}
                options={monthOptions}
                placeholder="Month"
                required
              />
              <Select
                label="Issue Year"
                value={formData.startYear}
                onChange={(e) => setFormData(prev => ({ ...prev, startYear: e.target.value }))}
                options={yearOptions}
                placeholder="Year"
                required
              />
              <Select
                label="Expiry Month"
                value={formData.endMonth}
                onChange={(e) => setFormData(prev => ({ ...prev, endMonth: e.target.value }))}
                options={monthOptions}
                placeholder="Month"
                disabled={formData.ongoing}
              />
              <Select
                label="Expiry Year"
                value={formData.endYear}
                onChange={(e) => setFormData(prev => ({ ...prev, endYear: e.target.value }))}
                options={yearOptions}
                placeholder="Year"
                disabled={formData.ongoing}
              />
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.ongoing}
                onChange={(e) => setFormData(prev => ({ ...prev, ongoing: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">No expiry date</span>
            </label>
            <RichTextEditor
              label="Description"
              value={formData.description}
              onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
              placeholder="Describe the certificate, skills gained, or relevance..."
              minHeight={100}
            />
            <div className="flex space-x-2">
              <Button onClick={handleSubmit} disabled={!formData.name || !formData.issuer || !formData.startMonth || !formData.startYear}>
                {editingId ? 'Update' : 'Add'} Certificate
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
          + Add Certificate
        </button>
      )}
    </div>
  );
};