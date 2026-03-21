const fs = require('fs');
let code = fs.readFileSync('src/features/ai/services/vertexService.ts', 'utf8');

code = code.replace(/import \{ model \} from '@\/lib\/firebase';/g, "import { getModel } from '@/lib/firebase';");
code = code.replace(/model\.generateContent/g, 'getModel().generateContent');
code = code.replace(/const jsonMatch = text\.match\(\/\\\{\[\\\\s\\\\S\]\*\\\}\/\);/g, "const clean = text.replace(/`json|`/g, '').trim();\n            const jsonMatch = clean.match(/\\{[\\\\s\\\\S]*\\}/);");

fs.writeFileSync('src/features/ai/services/vertexService.ts', code);
