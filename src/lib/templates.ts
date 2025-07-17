import { ModernTemplate } from '@/templates/ModernTemplate';
import { ClassicTemplate } from '@/templates/ClassicTemplate';

export interface Template {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<any>;
}

export const templates: Template[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and professional design with colored accents',
    component: ModernTemplate
  },
  {
    id: 'classic', 
    name: 'Classic',
    description: 'Traditional formal design with serif fonts',
    component: ClassicTemplate
  }
];

export const getTemplate = (id: string): Template | undefined => {
  return templates.find(template => template.id === id);
};

export const getDefaultTemplate = (): Template => {
  return templates[0]; // Modern template as default
}; 