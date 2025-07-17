'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { RichTextEditor } from '@/components/ui';

export const ProfileSection: React.FC = () => {
  const { resumeData, updateProfile } = useResumeStore();

  return (
    <div>
      <RichTextEditor
        value={resumeData.profile}
        onChange={updateProfile}
        placeholder="Write a brief professional summary that highlights your key skills, experience, and career objectives..."
        minHeight={120}
      />
    </div>
  );
}; 