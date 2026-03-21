const fs = require('fs');

const path = 'src/features/ai/services/vertexService.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/const jsonMatch = text\.match\(.*?\);/g, "const clean = text.replace(/\\\(json)?|\\\/g, '').trim();\n            const jsonMatch = clean.match(/\\\\{[\\\\s\\\\S]*\\\\}/);");

code = code.replace("import { model } from '@/lib/firebase';", "import { getModel } from '@/lib/firebase';");
code = code.replace(/model\.generateContent/g, "getModel().generateContent");

fs.writeFileSync(path, code);
