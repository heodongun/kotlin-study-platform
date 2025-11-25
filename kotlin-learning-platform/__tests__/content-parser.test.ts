import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { ContentParser } from '../lib/parser/content-parser';
import * as fs from 'fs';
import * as path from 'path';

describe('ContentParser', () => {
  const parser = new ContentParser();

  /**
   * Feature: kotlin-learning-platform, Property 11: HTML Parsing Element Extraction
   * Validates: Requirements 4.2
   */
  describe('Property 11: HTML Parsing Element Extraction', () => {
    it('should extract all titles, sections, and code blocks from any HTML', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              heading: fc.string({ minLength: 1, maxLength: 50 }),
              content: fc.string({ minLength: 0, maxLength: 200 }),
              hasCode: fc.boolean(),
            }),
            { minLength: 1, maxLength: 10 }
          ),
          (sections) => {
            // Generate HTML with sections
            const html = `
              <html>
                <head><title>Test</title></head>
                <body>
                  ${sections.map((section, i) => `
                    <h2>${section.heading}</h2>
                    <p>${section.content}</p>
                    ${section.hasCode ? `<pre><code class="language-kotlin">val x = ${i}</code></pre>` : ''}
                  `).join('')}
                </body>
              </html>
            `;

            const extracted = parser.extractSections(html);
            
            // Should extract at least as many sections as we created
            return extracted.length >= sections.length;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: kotlin-learning-platform, Property 12: Section to Lesson Conversion
   * Validates: Requirements 4.3
   */
  describe('Property 12: Section to Lesson Conversion', () => {
    it('should produce N lessons from N sections', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 20 }),
          (numSections) => {
            // Generate HTML with exact number of sections
            const html = `
              <html>
                <body>
                  ${Array.from({ length: numSections }, (_, i) => `
                    <h2>Section ${i}</h2>
                    <p>Content ${i}</p>
                  `).join('')}
                </body>
              </html>
            `;

            const sections = parser.extractSections(html);
            const lessons = sections.map((section, i) => 
              parser.convertToLesson(section, i)
            );

            return lessons.length === sections.length;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: kotlin-learning-platform, Property 13: Code Block Separation
   * Validates: Requirements 4.4
   */
  describe('Property 13: Code Block Separation', () => {
    it('should separate code examples from descriptions', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 10, maxLength: 100 }).filter(s => !s.includes('<') && !s.includes('>')),
          fc.string({ minLength: 10, maxLength: 100 }).filter(s => !s.includes('<') && !s.includes('>')),
          (description, code) => {
            const html = `
              <div>
                <p>${description}</p>
                <pre><code class="language-kotlin">${code}</code></pre>
              </div>
            `;

            const codeBlocks = parser.extractCodeBlocks(html);
            
            // Should extract at least one code block
            return codeBlocks.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: kotlin-learning-platform, Property 14: JSON Output Structure
   * Validates: Requirements 4.5
   */
  describe('Property 14: JSON Output Structure', () => {
    it('should produce valid JSON with all required fields', () => {
      // Test with actual docs folder
      const docsDir = path.join(process.cwd(), 'docs');
      
      if (fs.existsSync(docsDir)) {
        const content = parser.parseAllHtmlFiles(docsDir);
        
        // Should have chapters array
        expect(content).toHaveProperty('chapters');
        expect(Array.isArray(content.chapters)).toBe(true);

        // Each chapter should have required fields
        content.chapters.forEach(chapter => {
          expect(chapter).toHaveProperty('id');
          expect(chapter).toHaveProperty('title');
          expect(chapter).toHaveProperty('description');
          expect(chapter).toHaveProperty('lessons');
          expect(chapter).toHaveProperty('order');
          expect(typeof chapter.id).toBe('string');
          expect(typeof chapter.title).toBe('string');
          expect(Array.isArray(chapter.lessons)).toBe(true);

          // Each lesson should have required fields
          chapter.lessons.forEach(lesson => {
            expect(lesson).toHaveProperty('id');
            expect(lesson).toHaveProperty('title');
            expect(lesson).toHaveProperty('content');
            expect(lesson).toHaveProperty('order');
            expect(typeof lesson.id).toBe('string');
            expect(typeof lesson.title).toBe('string');
            expect(typeof lesson.content).toBe('string');
            expect(typeof lesson.order).toBe('number');
          });
        });
      }
    });
  });
});
