import { model } from '@/lib/firebase';
import type { ResumeFormData } from '@/features/resumes/types';
// import { GenerateContentResult } from 'firebase/ai';

export const vertexService = {
    async enhanceResume(formData: ResumeFormData): Promise<ResumeFormData> {
        const prompt = `
        You are an expert resume writer. Improve the following resume content to be more impactful and professional.
        Keep the structure exactly the same, but rewrite the descriptions and summary to be more compelling.
        Return ONLY the JSON object matching the ResumeFormData structure.

        Here is the current resume data:
        ${JSON.stringify(formData, null, 2)}
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            
            // Extract JSON from response (handle potential markdown blocks)
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("Failed to parse AI response as JSON");
            }
            
            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error("Error enhancing resume with Vertex AI:", error);
            throw error;
        }
    },

    async generateCoverLetter(jobTitle: string, company: string, description: string): Promise<{ intro: string, body: string, conclusion: string }> {
        const prompt = `
        Write a professional cover letter for a ${jobTitle} position at ${company}.
        
        Job Description:
        ${description}

        Structure the response as a JSON object with three fields:
        - intro: An engaging opening paragraph.
        - body: Two strong paragraphs highlighting relevant skills and experience based on the job description.
        - conclusion: A professional closing statement with a call to action.

        Return ONLY the JSON object.
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("Failed to parse AI response as JSON");
            }
            
            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error("Error generating cover letter with Vertex AI:", error);
            throw error;
        }
    },

    // Structured Parsing Methods
    async parseResume(textContent: string): Promise<any> {
        const prompt = `
        You are an expert resume parser. Extract structured data from the following resume text.
        Structure the output to strictly match the following JSON schema:
        
        {
          "title": "Extracted Resume",
          "contact": {
            "fullName": "",
            "email": "",
            "phone": "",
            "location": "",
            "linkedin": "",
            "website": ""
          },
          "summary": "",
          "experience": [
            {
              "id": "exp-1",
              "company": "",
              "role": "",
              "location": "",
              "startDate": "YYYY-MM",
              "endDate": "YYYY-MM or Present",
              "current": false,
              "description": ""
            }
          ],
          "education": [
            {
              "id": "edu-1",
              "school": "",
              "degree": "",
              "field": "",
              "location": "",
              "startDate": "",
              "endDate": "",
              "current": false
            }
          ],
          "skills": [
            {
              "id": "skill-1",
              "name": "",
              "level": "Intermediate" 
            }
          ]
        }

        Important:
        - Return ONLY valid JSON.
        - Generate simple random IDs for array items (e.g. "exp-1").
        - If a field is missing, use an empty string or empty array.
        - Ensure dates are in YYYY-MM format if possible.

        Resume Text:
        ${textContent}
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
             // Extract JSON from response (handle potential markdown blocks)
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("Failed to parse AI response as JSON");
            }
            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error("Error parsing resume with AI:", error);
            throw error;
        }
    },

    async parseCoverLetter(textContent: string): Promise<any> {
        const prompt = `
        You are an expert document parser. Extract structured data from the following cover letter text.
        Structure the output to strictly match the following JSON schema:

        {
            "title": "Imported Cover Letter",
            "jobTitle": "",
            "company": "",
            "jobDescription": "",
            "recipientName": "",
            "recipientRole": "",
            "content": {
                "intro": "",
                "body": "",
                "conclusion": ""
            }
        }

        Important:
        - Return ONLY valid JSON.
        - Infer job title and company if possible from the text.
        - Split content into intro/body/conclusion logically.
        
        Cover Letter Text:
        ${textContent}
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
             // Extract JSON from response (handle potential markdown blocks)
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("Failed to parse AI response as JSON");
            }
            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error("Error parsing cover letter with AI:", error);
            throw error;
        }
    },

    async analyzeMatch(resumeText: string, jobDescription: string): Promise<any> {
        const prompt = `
        You are an expert ATS (Applicant Tracking System) simulation engine. Analyze the following resume against the job description.
        
        Job Description:
        ${jobDescription}

        Resume Text:
        ${resumeText}

        Provide a structured analysis in JSON format:
        {
            "score": 85, // 0-100 integer
            "matchedKeywords": ["React", "TypeScript"],
            "missingKeywords": ["GraphQL", "AWS"],
            "summary": "Brief analysis of the fit (2 sentences max).",
            "role": "Inferred Role from JD",
            "company": "Inferred Company from JD"
        }

        Important:
        - Return ONLY valid JSON.
        - Be critical but fair.
        - Score based on keyword matching, experience relevance, and skills.
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
             // Extract JSON from response (handle potential markdown blocks)
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("Failed to parse AI response as JSON");
            }
            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error("Error analyzing ATS match with AI:", error);
            throw error;
        }
    }
};
