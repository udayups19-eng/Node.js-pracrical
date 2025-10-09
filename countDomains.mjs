// countDomains.mjs
import fs from 'fs';
import readline from 'readline';

const inputFile = 'data/users.csv';
const outputFile = 'out/domains.json';
const domainCounts = {};

async function processCSV() {
  // Create a stream to read the CSV file
  const fileStream = fs.createReadStream(inputFile);

  // Create a line-by-line reader
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let isFirstLine = true;

  for await (const line of rl) {
    if (isFirstLine) {
      isFirstLine = false; // skip header line
      continue;
    }

    const email = line.trim();
    const domain = email.split('@')[1];
    if (domain) {
      domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    }
  }

  // Create output folder if not present
  await fs.promises.mkdir('out', { recursive: true });

  // Write results to domains.json
  await fs.promises.writeFile(outputFile, JSON.stringify(domainCounts, null, 2));
  console.log('✅ Domain counts saved to out/domains.json');
}

// Run the function directly
await processCSV();

