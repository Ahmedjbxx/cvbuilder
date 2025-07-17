'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { clsx } from 'clsx';

// Dynamic import to avoid SSR issues with ReactQuill
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  minHeight?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label,
  error,
  helperText,
  required,
  placeholder,
  className,
  minHeight = 100,
}) => {
  const modules = useMemo(
    () => ({
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: ['', 'center', 'right', 'justify'] }],
        ['link'],
        ['clean'],
      ],
    }),
    []
  );

  const formats = [
    'bold',
    'italic',
    'underline',
    'list',
    'bullet',
    'align',
    'link',
  ];

  // Add custom styles for Quill editor
  const customStyles = `
    .ql-editor {
      min-height: ${minHeight}px;
    }
    .ql-editor ol {
      list-style-type: decimal !important;
      padding-left: 1.5em !important;
    }
    .ql-editor ul {
      list-style-type: disc !important;
      padding-left: 1.5em !important;
    }
    .ql-editor.ql-blank::before {
      font-style: normal;
      color: #9ca3af;
    }
    .ql-editor p {
      margin-bottom: 0.5em;
    }
    .ql-editor p[data-align='center'] {
      text-align: center;
    }
    .ql-editor p[data-align='right'] {
      text-align: right;
    }
    .ql-editor p[data-align='justify'] {
      text-align: justify;
    }
  `;

  const editorId = `editor-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      <style>{customStyles}</style>
      {label && (
        <label
          htmlFor={editorId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div
        className={clsx(
          'rich-text-editor border border-gray-300 rounded-md overflow-hidden',
          error && 'border-red-300',
          className
        )}
      >
        <ReactQuill
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          theme="snow"
          id={editorId}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};