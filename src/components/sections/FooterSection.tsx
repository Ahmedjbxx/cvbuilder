'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { RichTextEditor } from '@/components/ui';

export const FooterSection: React.FC = () => {
  const { resumeData, updateFooter } = useResumeStore();

  return (
    <div>
      <RichTextEditor
        value={resumeData.footer.description}
        onChange={updateFooter}
        placeholder="Add footer text such as references, disclaimers, or additional information..."
        minHeight={80}
      />
    </div>
  );
}; 