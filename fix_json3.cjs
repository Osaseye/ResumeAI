const fs = require('fs');

const path = 'src/features/ai/services/vertexService.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/const clean = text\.replace\(\/\\\(json\)\?\|\\\/g, ''\)\.trim\(\);\n            const jsonMatch = clean\.match\(\/\\\\\{\[\\\\s\\\\S\]\*\\\\\}\/\);/g, 
  "const clean = text.replace(/```json|```/g, '').trim();\n            const jsonMatch = clean.match(/\\{[\\s\\S]*\\}/);");

// Let's also fix all remaining jsonMatch occurrences if I messed some up.
code = code.replace(/const clean = text\.replace\(\/\\`\\`\\`\(json\)\?\\|\\`\\`\\`\/g, ''\)\.trim\(\);\n            const jsonMatch = clean\.match\(\/\\\\\{\\[\\\\s\\\\S\\]\*\\\\\}\/\);/g,
  "const clean = text.replace(/```json|```/g, '').trim();\n            const jsonMatch = clean.match(/\\{[\\s\\S]*\\}/);");

code = code.replace(/const jsonMatch = clean\.match\(\/\\\\\{\\[\\\\s\\\\S\\]\*\\\\\}\/\);/g, "const jsonMatch = clean.match(/\\{[\\s\\S]*\\}/);");
code = code.replace(/const clean = text\.replace\(.*g, ''\)\.trim\(\);/g, "const clean = text.replace(/```json|```/g, '').trim();");

fs.writeFileSync(path, code);
