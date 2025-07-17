import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import type { ResumeData, SectionConfig, StyleSettings } from '@/types/resume';
import { getTemplate } from '@/lib/templates';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeData, sections, styleSettings }: {
      resumeData: ResumeData;
      sections: SectionConfig[];
      styleSettings: StyleSettings;
    } = body;

    if (!resumeData || !sections || !styleSettings) {
      return NextResponse.json(
        { error: 'Missing required data: resumeData, sections, or styleSettings' },
        { status: 400 }
      );
    }

    // Get the selected template
    const selectedTemplate = getTemplate(styleSettings.templateId);
    if (!selectedTemplate) {
      return NextResponse.json(
        { error: `Template '${styleSettings.templateId}' not found` },
        { status: 400 }
      );
    }

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();

    // Set viewport to A4 dimensions
    await page.setViewport({
      width: 816,  // A4 width at 96 DPI
      height: 1056, // A4 height at 96 DPI
      deviceScaleFactor: 1
    });

    // Generate the HTML content using the same template system
    const htmlContent = generateHTMLContent(resumeData, sections, styleSettings, selectedTemplate);

    // Set the content
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      width: '8.27in',
      height: '11.7in',
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      printBackground: true,
      preferCSSPageSize: true
    });

    await browser.close();

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume-${new Date().toISOString().split('T')[0]}.pdf"`,
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function generateHTMLContent(
  resumeData: ResumeData,
  sections: SectionConfig[],
  styleSettings: StyleSettings,
  template: any
): string {
  // Generate the exact same HTML structure as the React templates
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: {
              50: '#eff6ff',
              100: '#dbeafe',
              200: '#bfdbfe',
              300: '#93c5fd',
              400: '#60a5fa',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
              800: '#1e40af',
              900: '#1e3a8a',
            },
          },
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            serif: ['Georgia', 'serif'],
            mono: ['Monaco', 'monospace'],
          },
          width: {
            'a4': '816px',
          },
          height: {
            'a4': '1056px',
          },
          maxWidth: {
            'a4': '816px',
          },
          maxHeight: {
            'a4': '1056px',
          },
          spacing: {
            'a4-margin': '48px',
          },
        },
      },
    }
  </script>
  <style>
    body {
      font-family: ${styleSettings.fontFamily}, sans-serif;
      font-size: ${styleSettings.fontSize}px;
      line-height: ${styleSettings.lineHeight};
      width: 816px;
      margin: 0 auto;
      background: white;
      color: #000;
    }
    
    /* Page break styles */
    .page-break {
      page-break-before: always;
      break-before: page;
      height: 1px;
      width: 100%;
      border: none;
      margin: 0;
    }
    
    /* Template-specific styles that match the React components */
    ${generateTemplateStyles(styleSettings)}
    
    /* Prevent section headers from being orphaned */
    h1, h2, h3 {
      page-break-after: avoid;
      break-after: avoid;
    }
    
    /* Entry-level page break prevention */
    .entry, .modern-section .entry, .classic-section .entry {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    
    /* Print specific styles */
    @media print {
      body {
        width: 100%;
        margin: 0;
      }
      
      .page-break {
        page-break-before: always;
      }
    }
  </style>
</head>
<body>
  ${generateTemplateHTML(resumeData, sections, styleSettings)}
</body>
</html>`;

  return htmlContent;
}

function generateTemplateStyles(styleSettings: StyleSettings): string {
  if (styleSettings.templateId === 'modern') {
    return `
      /* Modern Template Styles - matching ModernTemplate.tsx */
      .modern-header h1 {
        font-size: 2rem;
        font-weight: bold;
        color: ${styleSettings.primaryColor};
        margin-bottom: 0.5rem;
      }
      .modern-header .subtitle {
        font-size: 1.1rem;
        color: #6b7280;
        margin-bottom: 1rem;
      }
      .contact-grid svg {
        color: ${styleSettings.primaryColor};
      }
      .modern-section h2 {
        font-size: 1.25rem;
        font-weight: 600;
        color: ${styleSettings.primaryColor};
        border-bottom: 2px solid ${styleSettings.primaryColor};
        padding-bottom: 0.25rem;
        margin-bottom: 1rem;
      }
      .modern-section .tag {
        display: inline-block;
        background: ${styleSettings.primaryColor};
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.875rem;
        margin: 0.125rem;
      }
    `;
  } else {
    return `
      /* Classic Template Styles - matching ClassicTemplate.tsx */
      .classic-header {
        text-align: center;
        border-bottom: 3px double #6b7280;
        padding-bottom: 1rem;
        margin-bottom: 1.5rem;
      }
      .classic-header h1 {
        font-size: 2.2rem;
        font-weight: bold;
        color: #1f2937;
        margin-bottom: 0.5rem;
        font-family: 'Times New Roman', 'Georgia', serif;
      }
      .classic-section {
        margin-bottom: 1.5rem;
        font-family: 'Times New Roman', 'Georgia', serif;
      }
      .classic-section h2 {
        font-size: 1.1rem;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #374151;
        border-bottom: 1px solid #d1d5db;
        padding-bottom: 0.25rem;
        margin-bottom: 1rem;
      }
      .classic-section .entry-date {
        font-size: 0.9rem;
        color: #6b7280;
        font-style: italic;
        float: right;
      }
    `;
  }
}

function generateTemplateHTML(
  resumeData: ResumeData,
  sections: SectionConfig[],
  styleSettings: StyleSettings
): string {
  const visibleSections = sections
    .filter(section => section.isVisible)
    .sort((a, b) => a.order - b.order);

  const isModern = styleSettings.templateId === 'modern';
  let html = '';

  // Render each section using exact template structure
  for (const section of visibleSections) {
    html += renderSectionHTML(section, resumeData, styleSettings, isModern);
    
    // Add page break if specified
    if (section.hasPageBreak) {
      html += '<div class="page-break"></div>';
    }
  }

  return html;
}

function renderSectionHTML(
  section: SectionConfig,
  resumeData: ResumeData,
  styleSettings: StyleSettings,
  isModern: boolean
): string {
  switch (section.type) {
    case 'personalDetails':
      return renderPersonalDetailsHTML(resumeData, styleSettings, isModern);
    
    case 'profile':
      return resumeData.profile ? `
        <div class="${isModern ? 'modern-section' : 'classic-section'} mb-6">
          <h2>${isModern ? 'Profile' : 'Professional Summary'}</h2>
          <div>${resumeData.profile}</div>
        </div>` : '';

    case 'employment':
      return resumeData.employment.length > 0 ? `
        <div class="${isModern ? 'modern-section' : 'classic-section'} mb-6">
          <h2>${isModern ? 'Experience' : 'Professional Experience'}</h2>
          ${resumeData.employment.map(emp => `
            <div class="entry mb-4 pb-3 ${isModern ? 'border-b border-gray-100' : ''}">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h3 class="font-semibold text-gray-900">${emp.position}</h3>
                  <p class="text-gray-700 ${isModern ? '' : 'font-medium'}">${emp.company}</p>
                </div>
                <span class="text-sm text-gray-600 ${isModern ? '' : 'italic'} whitespace-nowrap">
                  ${emp.start} - ${emp.ongoing ? 'Present' : emp.end}
                </span>
              </div>
              ${emp.description ? `<div class="text-sm text-gray-700">${emp.description}</div>` : ''}
            </div>
          `).join('')}
        </div>` : '';

    case 'education':
      return resumeData.education.length > 0 ? `
        <div class="${isModern ? 'modern-section' : 'classic-section'} mb-6">
          <h2>Education</h2>
          ${resumeData.education.map(edu => `
            <div class="entry mb-4 pb-3 ${isModern ? 'border-b border-gray-100' : ''}">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h3 class="font-semibold text-gray-900">${edu.degree}</h3>
                  <p class="text-gray-700 ${isModern ? '' : 'font-medium'}">${edu.school}</p>
                </div>
                <span class="text-sm text-gray-600 ${isModern ? '' : 'italic'} whitespace-nowrap">
                  ${edu.start} - ${edu.ongoing ? 'Present' : edu.end}
                </span>
              </div>
              ${edu.description ? `<div class="text-sm text-gray-700">${edu.description}</div>` : ''}
            </div>
          `).join('')}
        </div>` : '';

    case 'skills':
      return resumeData.skills.length > 0 ? `
        <div class="${isModern ? 'modern-section' : 'classic-section'} mb-6">
          <h2>Skills</h2>
          <div class="flex flex-wrap gap-2">
            ${resumeData.skills.map(skill => 
              isModern ? 
                `<span class="tag">${skill.name} • ${skill.level}</span>` :
                `<span class="inline text-gray-700 mr-4">${skill.name} • ${skill.level}</span>`
            ).join('')}
          </div>
        </div>` : '';

    case 'languages':
      return resumeData.languages.length > 0 ? `
        <div class="${isModern ? 'modern-section' : 'classic-section'} mb-6">
          <h2>Languages</h2>
          <div class="flex flex-wrap gap-2">
            ${resumeData.languages.map(lang => 
              isModern ? 
                `<span class="tag">${lang.name} • ${lang.level}</span>` :
                `<span class="inline text-gray-700 mr-4">${lang.name} • ${lang.level}</span>`
            ).join('')}
          </div>
        </div>` : '';

    case 'hobbies':
      return resumeData.hobbies.length > 0 ? `
        <div class="${isModern ? 'modern-section' : 'classic-section'} mb-6">
          <h2>${isModern ? 'Hobbies' : 'Personal Interests'}</h2>
          <div class="flex flex-wrap gap-2">
            ${resumeData.hobbies.map(hobby => 
              isModern ? 
                `<span class="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">${hobby}</span>` :
                `<span class="inline text-gray-700 mr-4">${hobby}</span>`
            ).join('')}
          </div>
        </div>` : '';

    default:
      return '';
  }
}

function renderPersonalDetailsHTML(
  resumeData: ResumeData,
  styleSettings: StyleSettings,
  isModern: boolean
): string {
  const { firstName, lastName, headline, email, phone, address, city, postcode, photo } = resumeData.personalDetails;
  
  if (isModern) {
    return `
      <div class="mb-8">
        <div class="modern-header flex items-start gap-6">
          ${photo ? `<img src="${photo}" alt="Profile" class="w-24 h-24 object-cover rounded-lg shadow-md" />` : ''}
          <div class="flex-1">
            <h1>${firstName} ${lastName}</h1>
            ${headline ? `<p class="subtitle">${headline}</p>` : ''}
            <div class="grid grid-cols-2 gap-2 text-sm text-gray-700">
              ${email ? `
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  ${email}
                </div>` : ''}
              ${phone ? `
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  ${phone}
                </div>` : ''}
              ${address ? `
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  ${address}
                </div>` : ''}
              ${postcode || city ? `
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  ${postcode} ${city}
                </div>` : ''}
            </div>
          </div>
        </div>
      </div>`;
  } else {
    // Classic template
    return `
      <div class="mb-8">
        <div class="classic-header">
          <h1>${firstName} ${lastName}</h1>
          ${headline ? `<p class="text-lg text-gray-700 italic mb-4">${headline}</p>` : ''}
          <div class="flex justify-center flex-wrap gap-4 text-sm text-gray-700">
            ${email ? `
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                ${email}
              </div>` : ''}
            <div>•</div>
            ${phone ? `
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                ${phone}
              </div>` : ''}
            <div>•</div>
            ${address || city || postcode ? `
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                ${[address, city, postcode].filter(Boolean).join(', ')}
              </div>` : ''}
          </div>
          ${photo ? `
            <div class="text-center mt-4">
              <img src="${photo}" alt="Profile" class="inline-block w-30 h-30 object-cover border-2 border-gray-500" />
            </div>` : ''}
        </div>
      </div>`;
  }
} 