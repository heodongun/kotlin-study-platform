import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import type { Chapter, Lesson, ParsedContent, Section, CodeBlock } from '@/types';

export class ContentParser {
  /**
   * Parse all HTML files in the docs directory
   */
  parseAllHtmlFiles(docsDir: string): ParsedContent {
    const htmlFiles = this.findHtmlFiles(docsDir);
    const chapters: Chapter[] = [];

    htmlFiles.forEach((filePath, index) => {
      try {
        const chapter = this.parseHtmlFile(filePath);
        chapter.order = index;
        chapters.push(chapter);
      } catch (error) {
        console.warn(`Failed to parse ${filePath}:`, error);
      }
    });

    return { chapters };
  }

  /**
   * Recursively find all HTML files in a directory
   */
  private findHtmlFiles(dir: string): string[] {
    const files: string[] = [];

    if (!fs.existsSync(dir)) {
      return files;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        files.push(...this.findHtmlFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Parse a single HTML file into a Chapter
   */
  parseHtmlFile(filePath: string): Chapter {
    const html = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath, '.html');
    const $ = cheerio.load(html);

    // Extract title from page-title or first h1
    const title = $('.page-title').first().text().trim() ||
      $('h1').first().text().trim() ||
      fileName;

    // Extract description from page-description or first paragraph
    const description = $('.page-description').first().text().trim() ||
      $('p').first().text().trim() ||
      '';

    // Extract sections
    const sections = this.extractSections(html);

    // Convert sections to lessons
    const lessons = sections.map((section, index) =>
      this.convertToLesson(section, index)
    );

    return {
      id: this.generateChapterId(fileName),
      title,
      description,
      lessons,
      order: 0 // Will be set by parseAllHtmlFiles
    };
  }

  /**
   * Extract sections from HTML content
   */
  extractSections(html: string): Section[] {
    const $ = cheerio.load(html);
    const sections: Section[] = [];

    // Find all headings (h1, h2, h3)
    $('h1, h2, h3').each((_, element) => {
      const $heading = $(element);
      const heading = $heading.text().trim();
      const tagName = $heading.prop('tagName')?.toLowerCase() || '';
      const level = parseInt(tagName.substring(1));

      // Get content until next heading of same or higher level
      let content = '';
      let $current = $heading.next();

      while ($current.length > 0) {
        const tagName = $current.prop('tagName')?.toLowerCase();

        // Stop if we hit another heading of same or higher level
        if (tagName && ['h1', 'h2', 'h3'].includes(tagName)) {
          const currentLevel = parseInt(tagName.substring(1));
          if (currentLevel <= level) {
            break;
          }
        }

        content += $current.toString();
        $current = $current.next();
      }

      // Extract code blocks from this section
      const codeBlocks = this.extractCodeBlocks(content);

      sections.push({
        heading,
        level,
        content,
        codeBlocks
      });
    });

    return sections;
  }

  /**
   * Extract code blocks from HTML content
   */
  extractCodeBlocks(html: string): CodeBlock[] {
    const $ = cheerio.load(html);
    const codeBlocks: CodeBlock[] = [];

    $('pre code, .code code').each((_, element) => {
      const $code = $(element);
      const code = $code.text().trim();

      // Try to detect language from class
      const className = $code.attr('class') || '';
      const languageMatch = className.match(/language-(\w+)/);
      const language = languageMatch ? languageMatch[1] : 'kotlin';

      if (code) {
        codeBlocks.push({ language, code });
      }
    });

    return codeBlocks;
  }

  /**
   * Convert a section to a Lesson
   */
  convertToLesson(section: Section, order: number): Lesson {
    // Clean HTML content for display
    const $ = cheerio.load(section.content);

    // Remove code blocks from content (they'll be shown separately)
    $('pre, .code').remove();

    const cleanContent = $.root().text().trim();

    // Use first code block as example if available
    const codeExample = section.codeBlocks.length > 0
      ? section.codeBlocks[0].code
      : undefined;

    return {
      id: this.generateLessonId(section.heading, order),
      title: section.heading,
      content: cleanContent,
      codeExample,
      initialCode: codeExample ? '// Write your code here\n' : undefined,
      order
    };
  }

  /**
   * Generate a chapter ID from filename
   */
  generateChapterId(fileName: string): string {
    return fileName
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Generate a lesson ID from heading and order
   */
  private generateLessonId(heading: string, order: number): string {
    const slug = heading
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, '-')
      .replace(/^-|-$/g, '');

    return `${slug}-${order}`;
  }
}
