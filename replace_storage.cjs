const fs = require('fs');

const files = [
    'src/components/dashboard/Header.tsx',
    'src/contexts/NotificationContext.tsx',
    'src/features/auth/AuthContext.tsx',
    'src/features/dashboard/DashboardPage.tsx',
    'src/features/interview/ActiveInterviewSession.tsx',
    'src/features/interview/InterviewConfigurationPage.tsx',
    'src/features/interview/MockInterviewPage.tsx',
    'src/features/jobs/JobMatchesPage.tsx',
    'src/features/jobs/services/jobService.ts'
];

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        
        // Skip if already imported
        if (!content.includes('import { storage }')) {
            // Find the last import
            const lastImportIndex = content.lastIndexOf('import ');
            if (lastImportIndex !== -1) {
                const endOfLastImport = content.indexOf('\n', lastImportIndex);
                content = content.slice(0, endOfLastImport + 1) + 
                         "import { storage } from '@/utils/storage';\n" + 
                         content.slice(endOfLastImport + 1);
            }
        }
        
        content = content.replace(/localStorage\./g, 'storage.');
        
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
    } catch(e) {
        console.error('Error on ' + file, e);
    }
});
