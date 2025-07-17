# CV Builder - Professional Resume Creator

A comprehensive, modern CV/Resume builder with live preview and PDF export capabilities. Built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

### 📝 **Complete Resume Sections**
- **Personal Details**: Photo upload, contact information, optional fields
- **Professional Profile**: Rich text editor with formatting
- **Education**: Multiple entries with descriptions
- **Employment**: Work experience with detailed descriptions
- **Skills**: Skill management with proficiency levels
- **Languages**: Language proficiency tracking
- **Hobbies**: Personal interests and activities
- **Optional Sections**: Courses, Internships, References, etc.

### 🎨 **Live Styling Controls**
- **Template Selection**: Modern, Classic, and Minimal templates
- **Typography**: Font family, size, and line height control
- **Color Themes**: Multiple color options for personalization
- **Real-time Preview**: See changes instantly

### 🔧 **Advanced Features**
- **Drag & Drop**: Reorder sections (planned)
- **Auto-save**: Persistent storage with localStorage
- **A4 Format**: Print-ready design with proper pagination
- **Responsive Design**: Works on desktop and mobile
- **Rich Text Editing**: Formatting toolbar for descriptions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository** (if from git) or the files are already set up
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## 📱 How to Use

### 1. **Personal Details**
- Upload a professional photo
- Fill in your contact information
- Add optional fields like LinkedIn, website, etc.

### 2. **Build Your Resume**
- Add sections by clicking the optional section tags
- Fill in your information using the intuitive forms
- Use the rich text editor for detailed descriptions

### 3. **Customize Appearance**
- Use the bottom toolbar to change templates
- Adjust font settings and colors
- Preview changes in real-time

### 4. **Export Your Resume**
- Click "Export PDF" to download your resume
- Use "Export JSON" to save your data
- Import JSON to restore previous resumes

## 🏗️ Technical Architecture

### **Frontend Stack**
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Zustand**: State management
- **React Hook Form**: Form handling
- **React Quill**: Rich text editing

### **Key Components**
- **FormPanel**: Main form interface with sections
- **PreviewPanel**: Live A4 preview with styling
- **StyleToolbar**: Bottom toolbar for customization
- **Section Components**: Modular resume sections

### **Data Structure**
```typescript
interface ResumeData {
  personalDetails: PersonalDetails;
  profile: string;
  education: Education[];
  employment: Employment[];
  skills: Skill[];
  languages: Language[];
  hobbies: string[];
  // ... other sections
}
```

## 📋 Implementation Status

### ✅ **Completed Features**
- [x] Project setup with Next.js and TypeScript
- [x] State management with Zustand
- [x] Reusable UI components
- [x] Personal Details section
- [x] Profile section with rich text
- [x] Education section (add/edit/delete)
- [x] Employment section (add/edit/delete)
- [x] Skills and Languages sections
- [x] Hobbies section
- [x] Live preview with A4 formatting
- [x] Style controls (fonts, colors, templates)
- [x] localStorage persistence

### 🚧 **In Progress / Planned**
- [ ] PDF export with Puppeteer
- [ ] Drag and drop reordering
- [ ] Additional optional sections
- [ ] Multiple resume templates
- [ ] Import/Export functionality
- [ ] Page break management
- [ ] Print optimization

## 🎯 **Usage Tips**

1. **Start with Personal Details**: This forms the header of your resume
2. **Use Rich Text Formatting**: Bold key achievements and use bullet points
3. **Keep it Concise**: Aim for 1-2 pages depending on experience
4. **Customize Colors**: Match your industry or personal brand
5. **Preview Often**: Use the live preview to see how it looks

## 🔧 **Development**

### **Available Scripts**
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript checks

### **Project Structure**
```
src/
├── app/                 # Next.js app router
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── sections/       # Resume section components
│   └── forms/          # Form components
├── store/              # Zustand store
├── types/              # TypeScript interfaces
├── lib/                # Utility functions
└── templates/          # Resume templates
```

## 🤝 **Contributing**

This CV builder is designed to be extensible:

1. **Add New Sections**: Create components in `src/components/sections/`
2. **Create Templates**: Add new templates in `src/templates/`
3. **Enhance UI**: Improve components in `src/components/ui/`
4. **Extend Features**: Add functionality to the Zustand store

## 📄 **License**

This project is open source and available under the MIT License.

---
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/Ahmedjbxx/cvbuilder?utm_source=oss&utm_medium=github&utm_campaign=Ahmedjbxx%2Fcvbuilder&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

**Built with ❤️ using Next.js, TypeScript, and modern web technologies.** 
