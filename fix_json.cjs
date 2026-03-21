const fs = require('fs');
let code = fs.readFileSync('src/features/ai/services/vertexService.ts', 'utf8');

const target = 'const jsonMatch = text.match(/\\{[\\\\s\\\\S]*\\}/);';
const replacement = "const clean = text.replace(/\\\\\\json|\\\\\\/g, '').trim();\n            const jsonMatch = clean.match(/\\{[\\\\s\\\\S]*\\}/);";

code = code.split(target).join(replacement);

fs.writeFileSync('src/features/ai/services/vertexService.ts', code);
