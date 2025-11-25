import { ContentParser } from '../lib/parser/content-parser';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Generate lessons.json from HTML files in docs folder
 */
function generateContent() {
  const parser = new ContentParser();
  const docsDir = path.join(process.cwd(), 'docs');
  const outputDir = path.join(process.cwd(), 'lib', 'content');
  const outputFile = path.join(outputDir, 'lessons.json');

  console.log('📚 Parsing HTML files from:', docsDir);

  try {
    // Parse all HTML files
    const content = parser.parseAllHtmlFiles(docsDir);

    console.log(`✅ Found ${content.chapters.length} chapters`);
    content.chapters.forEach(chapter => {
      console.log(`   - ${chapter.title} (${chapter.lessons.length} lessons)`);
    });

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write to JSON file
    fs.writeFileSync(
      outputFile,
      JSON.stringify(content, null, 2),
      'utf-8'
    );

    console.log('✅ Content generated successfully:', outputFile);
  } catch (error) {
    console.error('❌ Error generating content:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateContent();
}

export { generateContent };
