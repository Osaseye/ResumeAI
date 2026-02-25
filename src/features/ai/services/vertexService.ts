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

    async improveResumeFromJob(resumeText: string, jobDescription: string): Promise<ResumeFormData> {
        const prompt = `
        You are an expert resume writer and ATS specialist. 
        Analyze the following resume text and rewrite it into a structured JSON format to better match the provided job description.
        
        Job Description:
        ${jobDescription}

        Current Resume Text:
        ${resumeText}

        Instructions:
        1. Parse the resume text into the following JSON structure:
           {
             "title": "Optimized Resume for [Job Title]",
             "headline": "Professional Headline",
             "contact": { "fullName": "Name", "email": "Email", "phone": "Phone", "location": "Location", "linkedin": "", "website": "" },
             "summary": "Compelling summary tailored to the job description...",
             "experience": [ { "id": "1", "role": "Job Title", "company": "Company", "location": "Location", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "current": boolean, "description": "Bullet points..." } ],
             "education": [ { "id": "1", "school": "School", "degree": "Degree", "field": "Field", "location": "Location", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "current": boolean } ],
             "skills": [ { "id": "1", "name": "Skill" } ],
             "projects": []
           }
        2. Rewrite bullet points and summary to include keywords from the job description naturally.
        3. Improve the impact of the resume by using stronger action verbs.
        5. Use "2020-01" format for dates or "Present".
        4. Return ONLY the valid JSON object. Do not add markdown formatting or explanations.
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
            console.error("Error optimizing resume with Vertex AI:", error);
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
        console.log("Starting analyzeMatch...");
        console.log("Resume Text Length:", resumeText.length);
        console.log("Job Description Length:", jobDescription.length);

        const prompt = `
        You are an expert ATS (Applicant Tracking System) simulation engine. Analyze the following resume against the job description.
        
        Job Description:
        ${jobDescription}

        Resume Text:
        ${resumeText}

        Provide a structured analysis in JSON format with the following fields:
        - score: An integer from 0 to 100 representing the match percentage.
        - matchedKeywords: An array of strings containing relevant hard skills found in the resume.
        - missingKeywords: An array of strings containing important keywords from the JD that are missing.
        - summary: A brief analysis of the fit (2 sentences max).
        - role: The inferred job role from the JD.
        - company: The inferred company name from the JD.

        Example Response Structure (do not copy the values):
        {
            "score": 0, 
            "matchedKeywords": [],
            "missingKeywords": [],
            "summary": "",
            "role": "",
            "company": ""
        }

        Important:
        - Return ONLY valid JSON.
        - Be critical but fair.
        - Score based on keyword matching, experience relevance, and skills.
        `;

        try {
            console.log("Sending prompt to AI model...");
            const result = await model.generateContent(prompt);
            console.log("Received response from AI model.");
            
            const response = result.response;
            const text = response.text();
            console.log("Raw AI Response Text:", text);

             // Extract JSON from response (handle potential markdown blocks)
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.error("Failed to find JSON in response:", text);
                throw new Error("Failed to parse AI response as JSON");
            }
            
            const parsedResult = JSON.parse(jsonMatch[0]);
            console.log("Parsed Analysis Result:", parsedResult);
            return parsedResult;
        } catch (error) {
            console.error("Error analyzing ATS match with AI:", error);
            throw error;
        }
    },

    async startInterviewSession(resumeText: string, jobDescription: string) {
        const prompt = `
        You are an expert technical interviewer conducting a mock interview.
        Your goal is to assess the candidate based on their resume and the job description provided.
        START THE INTERVIEW NOW.

        Job Description:
        ${jobDescription}

        Candidate Resume:
        ${resumeText}

        Instructions:
        1. Start by briefly introducing yourself as the interviewer for this role.
        2. Ask the FIRST interview question. It should be an ice-breaker or a "tell me about yourself" style question relevant to the role.
        3. Do NOT provide feedback yet.
        4. Keep your response professional but conversational.
        5. Output JSON format.

        Response Format:
        {
            "message": "Hello, I'm the AI interviewer... [Introduction] ... [First Question]",
            "question": "[The actual question text for tracking]"
        }
        `;

        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Failed to parse start interview response");
            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error("Error starting interview:", error);
            throw error;
        }
    },

    async chatInterview(history: { role: string, content: string }[], newMessage: string, isLast: boolean = false) {
        const historyText = history.map(h => `${h.role === 'user' ? 'Candidate' : 'Interviewer'}: ${h.content}`).join('\n');
        
        const prompt = `
        You are an expert technical interviewer. Continue the interview.
        
        Interview History:
        ${historyText}
        
        Candidate's Last Response:
        "${newMessage}"

        Instructions:
        1. Acknowledge the candidate's answer.
        2. Provide brief, constructive feedback.
        ${isLast 
            ? "3. This is the end of the interview. Provide a concluding remark and stop asking questions. Do NOT ask another question." 
            : "3. Ask the NEXT question. Dig deeper into their resume or technical skills required for the job."
        }
        4. Output JSON format.

        Response Format:
        {
            "message": "[Acknowledgement] [Feedback] ${isLast ? '[Closing Remark]' : '[Next Question]'}",
            "feedback": "[Specific feedback on the last answer]",
            "nextQuestion": "${isLast ? '' : '[The text of the next question]'}",
            "isComplete": ${isLast}
        }
        `;

        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Failed to parse chat interview response");
            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error("Error in interview chat:", error);
            throw error;
        }
    },

    async generateInterviewFeedback(history: { role: string, content: string }[]) {
        const historyText = history.map(h => `${h.role === 'user' ? 'Candidate' : 'Interviewer'}: ${h.content}`).join('\n');
        
        const prompt = `
        You are an expert technical interviewer. The interview has concluded.
        Analyze the candidate's performance based on the following transcript.

        Interview Transcript:
        ${historyText}

        PROVIDE A DETAILED ASSESSMENT IN JSON FORMAT:
        - score: An integer from 0-100 representing overall performance.
        - summary: A 2-3 sentence summary of their performance.
        - strengths: An array of 3 key strengths demonstrated.
        - improvements: An array of 3 areas for improvement.
        - keyTopics: An array of technical topics covered.
        
        Response Format:
        {
            "score": 85,
            "summary": "The candidate showed strong knowledge in...",
            "strengths": ["Communication", "React hooks"],
            "improvements": ["System design depth"],
            "keyTopics": ["React", "State Management"]
        }
        `;

        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Failed to parse interview feedback");
            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error("Error generating interview feedback:", error);
            // Return mock feedback on error to prevent crashing
            return {
                score: 75,
                summary: "Attempted analysis but encountered an error. The candidate completed the interview.",
                strengths: ["Completed the session"],
                improvements: ["Could not analyze details"],
                keyTopics: ["General Interview"]
            };
        }
    }
};
