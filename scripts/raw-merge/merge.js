import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pocDir = join(__dirname, '../../poc');

const sources = ['claude', 'gemini', 'openai', 'parallel'];

const merged = sources.flatMap((source) => {
  const filePath = join(pocDir, `${source}.json`);
  const stocks = JSON.parse(readFileSync(filePath, 'utf-8'));
  return stocks.map((stock) => ({ ...stock, agent: source }));
});

const outputPath = join(pocDir, 'merged.json');
writeFileSync(outputPath, JSON.stringify(merged, null, 2), 'utf-8');

console.log(`Merged ${merged.length} stocks into ${outputPath}`);
