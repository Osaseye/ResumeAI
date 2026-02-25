// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker?url';
import mammoth from 'mammoth';

// Configure the worker explicitly for Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const fileParser = {
    async extractText(file: File): Promise<string> {
        const fileType = file.name.split('.').pop()?.toLowerCase();

        if (fileType === 'pdf') {
            return this.extractFromPdf(file);
        } else if (fileType === 'docx') {
            return this.extractFromDocx(file);
        } else {
            throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
        }
    },

    async extractFromPdf(file: File): Promise<string> {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            
            let fullText = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map((item: any) => item.str)
                    .join(' ');
                fullText += pageText + '\n\n';
            }
            
            return fullText;
        } catch (error) {
            console.error('Error parsing PDF:', error);
            throw new Error('Failed to extract text from PDF');
        }
    },

    async extractFromDocx(file: File): Promise<string> {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            return result.value;
        } catch (error) {
            console.error('Error parsing DOCX:', error);
            throw new Error('Failed to extract text from DOCX');
        }
    }
};