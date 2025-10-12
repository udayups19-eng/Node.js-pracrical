import { pathToFileURL } from 'url';
import fs from 'fs/promises';

// Function to dynamically import files (.mjs, .js, .json)
export async function dynamicImport(file) {
  try {
    const fileUrl = pathToFileURL(file).href;
    let module;

    // --- JSON Handling with Fallback ---
    if (file.endsWith('.json')) {
      try {
        // Try JSON import assertion (new Node versions)
        module = await import(fileUrl, {
          assert: { type: 'json' }
        });
        return module.default;
      } catch {
        // Fallback for older Node versions
        const jsonText = await fs.readFile(file, 'utf-8');
        return JSON.parse(jsonText);
      }
    }

    // --- JS or MJS Module Import ---
    module = await import(fileUrl);
    return module.default || module;

  } catch (error) {
    console.error("Error importing file:", error);
  }
}

// Example usage
(async () => {
  const jsModule = await dynamicImport('./module.mjs');
  console.log(jsModule.greet("Student"));
  console.log("Subject:", jsModule.subject);

  const jsonData = await dynamicImport('./data.json');
  console.log("JSON Data:", jsonData);
})();
