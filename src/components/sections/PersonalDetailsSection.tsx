'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { Input } from '@/components/ui';
import { useState } from 'react';

export const PersonalDetailsSection: React.FC = () => {
  const { resumeData, updatePersonalDetails } = useResumeStore();
  const { personalDetails } = resumeData;
  const [customField, setCustomField] = useState({ label: '', value: '' });
  const [useHeadline, setUseHeadline] = useState(Boolean(personalDetails.headline));

  const handleInputChange = (field: string, value: string) => {
    updatePersonalDetails({ [field]: value });
  };

  const handleOptionalFieldChange = (field: string, value: string) => {
    updatePersonalDetails({
      optionalFields: {
        ...personalDetails.optionalFields,
        [field]: value
      }
    });
  };

  const handleCustomFieldChange = (field: 'label' | 'value', value: string) => {
    const newCustomField = { ...customField, [field]: value };
    setCustomField(newCustomField);
    
    if (newCustomField.label && newCustomField.value) {
      updatePersonalDetails({
        optionalFields: {
          ...personalDetails.optionalFields,
          custom: newCustomField
        }
      });
    }
  };

  const addOptionalField = (fieldType: string) => {
    // Initialize the field
    handleOptionalFieldChange(fieldType, '');
  };

  const removeOptionalField = (fieldType: string) => {
    const updatedOptionalFields = { ...personalDetails.optionalFields };
    delete updatedOptionalFields[fieldType as keyof typeof updatedOptionalFields];
    updatePersonalDetails({ optionalFields: updatedOptionalFields });
  };

  const handleHeadlineToggle = (checked: boolean) => {
    setUseHeadline(checked);
    if (!checked) {
      handleInputChange('headline', '');
    }
  };

  const availableOptionalFields = [
    { key: 'dob', label: 'Date of birth', type: 'date' },
    { key: 'birthplace', label: 'Place of birth', type: 'text' },
    { key: 'driverLicense', label: 'Driver\'s license', type: 'text' },
    { key: 'gender', label: 'Gender', type: 'text' },
    { key: 'nationality', label: 'Nationality', type: 'text' },
    { key: 'civilStatus', label: 'Civil status', type: 'text' },
    { key: 'website', label: 'Website', type: 'url' },
    { key: 'linkedin', label: 'LinkedIn', type: 'url' },
  ];

  const activeOptionalFields = availableOptionalFields.filter(
    field => personalDetails.optionalFields[field.key as keyof typeof personalDetails.optionalFields] !== undefined
  );

  const inactiveOptionalFields = availableOptionalFields.filter(
    field => personalDetails.optionalFields[field.key as keyof typeof personalDetails.optionalFields] === undefined
  );

  return (
    <div className="space-y-6">
      {/* Photo and Names */}
      <div className="flex gap-6">
        {/* Photo Upload */}
        <div className="flex-shrink-0">
          <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
          <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
            {personalDetails.photo ? (
              <img
                src={personalDetails.photo}
                alt="Profile"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center">
                <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="photo-upload"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  handleInputChange('photo', e.target?.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>

        {/* Names */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          <Input
            label="Given name"
            value={personalDetails.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            required
          />
          <Input
            label="Family name"
            value={personalDetails.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Desired Job Position */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Input
            label="Desired job position"
            value={personalDetails.headline || ''}
            onChange={(e) => handleInputChange('headline', e.target.value)}
            placeholder="e.g., Senior Software Engineer"
            className="flex-1"
          />
          <div className="ml-4 flex items-center">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useHeadline}
                onChange={(e) => handleHeadlineToggle(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Use as headline</span>
            </label>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email address"
          type="email"
          value={personalDetails.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
        />
        <Input
          label="Phone number"
          type="tel"
          value={personalDetails.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          required
        />
      </div>
      
      {/* Address */}
      <Input
        label="Address"
        value={personalDetails.address}
        onChange={(e) => handleInputChange('address', e.target.value)}
        required
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Post code"
          value={personalDetails.postcode}
          onChange={(e) => handleInputChange('postcode', e.target.value)}
          required
        />
        <Input
          label="City"
          value={personalDetails.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
          required
        />
      </div>

      {/* Active Optional Fields */}
      {activeOptionalFields.map((field) => (
        <div key={field.key} className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              label={field.label}
              type={field.type}
              value={personalDetails.optionalFields[field.key as keyof typeof personalDetails.optionalFields] as string || ''}
              onChange={(e) => handleOptionalFieldChange(field.key, e.target.value)}
            />
          </div>
          <button
            onClick={() => removeOptionalField(field.key)}
            className="p-2 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
            title="Remove field"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}

      {/* Custom Field */}
      {personalDetails.optionalFields.custom && (
        <div className="flex gap-2 items-end">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <Input
              label="Field label"
              value={customField.label}
              onChange={(e) => handleCustomFieldChange('label', e.target.value)}
              placeholder="e.g., Portfolio"
            />
            <Input
              label="Field value"
              value={customField.value}
              onChange={(e) => handleCustomFieldChange('value', e.target.value)}
              placeholder="e.g., https://myportfolio.com"
            />
          </div>
          <button
            onClick={() => removeOptionalField('custom')}
            className="p-2 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
            title="Remove field"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}

      {/* Optional Fields Buttons */}
      {(inactiveOptionalFields.length > 0 || !personalDetails.optionalFields.custom) && (
        <div className="flex flex-wrap gap-2 pt-4">
          {inactiveOptionalFields.map((field) => (
            <button
              key={field.key}
              onClick={() => addOptionalField(field.key)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {field.label}
            </button>
          ))}
          {!personalDetails.optionalFields.custom && (
            <button
              onClick={() => addOptionalField('custom')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Champ personnalisé
            </button>
          )}
        </div>
      )}
    </div>
  );
}; 