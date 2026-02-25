// Placeholder for real API integration (JSearch / RapidAPI)
// Currently returns mock data for development.

export interface Job {
    job_id: string;
    employer_name: string;
    employer_logo?: string;
    job_title: string;
    job_city: string;
    job_country: string;
    job_is_remote: boolean;
    job_posted_at_timestamp: number;
    job_description: string;
    job_apply_link: string;
    job_min_salary?: number;
    job_max_salary?: number;
    job_salary_currency?: string;
    match_score?: number; // Calculated by our app, not the API
}

const MOCK_JOBS: Job[] = [
    {
        job_id: "1",
        employer_name: "Paystack",
        employer_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Paystack_Logo.png/1200px-Paystack_Logo.png",
        job_title: "Senior Frontend Engineer",
        job_city: "Lagos",
        job_country: "Nigeria",
        job_is_remote: true,
        job_posted_at_timestamp: Date.now() - 86400000 * 2,
        job_description: "Paystack is looking for a Senior Frontend Engineer to join our Core Payments team. You will be responsible for building pixel-perfect, buttery smooth UIs that millions of users rely on daily. \n\nRequirements:\n- 5+ years of experience with React and TypeScript.\n- Deep understanding of web performance.\n- Experience with GraphQL.\n- Strong eye for design details.",
        job_apply_link: "https://paystack.com/careers",
        job_min_salary: 800000,
        job_max_salary: 1500000,
        job_salary_currency: "NGN",
        match_score: 92
    },
    {
        job_id: "2",
        employer_name: "Flutterwave",
        employer_logo: "https://flutterwave.com/images/logo-colored.svg",
        job_title: "Product Manager, Enterprise",
        job_city: "Lagos",
        job_country: "Nigeria",
        job_is_remote: false,
        job_posted_at_timestamp: Date.now() - 86400000 * 5,
        job_description: "We are looking for an experienced Product Manager to lead our Enterprise solutions. You will work closely with engineering, design, and sales to deliver world-class payment products.\n\nResponsibilities:\n- Define product strategy and roadmap.\n- Gather requirements from enterprise customers.\n- Lead sprint planning and execution.",
        job_apply_link: "https://flutterwave.com/careers",
        job_min_salary: 1000000,
        job_max_salary: 2000000,
        job_salary_currency: "NGN",
        match_score: 85
    },
    {
        job_id: "3",
        employer_name: "Andela",
        employer_logo: "https://andela.com/wp-content/uploads/2022/03/Andela-Logo-1.png",
        job_title: "Remote Senior DevOps Engineer",
        job_city: "Remote",
        job_country: "Nigeria",
        job_is_remote: true,
        job_posted_at_timestamp: Date.now() - 86400000 * 1,
        job_description: "Andela is hiring a Senior DevOps Engineer to support our partner clients in the US. \n\nMust have:\n- AWS Certified Solutions Architect.\n- Strong experience with Kubernetes and Terraform.\n- CI/CD pipeline mastery (GitHub Actions, Jenkins).",
        job_apply_link: "https://andela.com/jobs",
        job_min_salary: 3000,
        job_max_salary: 5000,
        job_salary_currency: "USD",
        match_score: 78
    },
    {
        job_id: "4",
        employer_name: "Kuda Bank",
        employer_logo: "https://kuda.com/static/kuda-logo-2.png",
        job_title: "Mobile Engineer (React Native)",
        job_city: "Lagos",
        job_country: "Nigeria",
        job_is_remote: true,
        job_posted_at_timestamp: Date.now() - 86400000 * 10,
        job_description: "Join the bank of the free! We are looking for a React Native engineer to help us build the next generation of mobile banking features.\n\nSkills:\n- React Native\n- Redux/Zustand\n- Native modules (iOS/Android) experience is a plus.",
        job_apply_link: "https://kuda.com/careers",
        job_min_salary: 600000,
        job_max_salary: 1200000,
        job_salary_currency: "NGN",
        match_score: 88
    },
    {
        job_id: "5",
        employer_name: "Interswitch",
        employer_logo: "https://www.interswitchgroup.com/assets/images/home/logo.png",
        job_title: "Backend Java Developer",
        job_city: "Lagos",
        job_country: "Nigeria",
        job_is_remote: false,
        job_posted_at_timestamp: Date.now() - 86400000 * 12,
        job_description: "Interswitch is hiring a Backend Developer with strong Java and Spring Boot experience. You will be working on high-volume transaction processing systems.\n\nRequirements:\n- Java 11+\n- Spring Boot\n- Microservices architecture\n- SQL/NoSQL databases.",
        job_apply_link: "https://interswitchgroup.com/careers",
        match_score: 75
    }
];

export const jobsService = {
    async searchJobs(query: string, location: string = 'Nigeria'): Promise<Job[]> {
        console.log(`Searching for ${query} in ${location}...`);
        
        const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;
        const apiHost = 'jsearch.p.rapidapi.com';

        if (!apiKey) {
            console.warn("RapidAPI Key missing. Returning mock data.");
            return MOCK_JOBS;
        }

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apiHost
            }
        };

        try {
            const response = await fetch(`https://${apiHost}/search?query=${encodeURIComponent(query + ' in ' + location)}&num_pages=1`, options);
            
            if (!response.ok) {
                if (response.status === 429) {
                     console.warn("RapidAPI Rate Limit Exceeded. Returning mock data.");
                     return MOCK_JOBS;
                }
                throw new Error(`RapidAPI Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (!data.data || !Array.isArray(data.data)) {
                 return [];
            }

            return data.data.map((item: any) => ({
                job_id: item.job_id,
                employer_name: item.employer_name,
                employer_logo: item.employer_logo,
                job_title: item.job_title,
                job_city: item.job_city,
                job_country: item.job_country,
                job_is_remote: item.job_is_remote,
                job_posted_at_timestamp: item.job_posted_at_timestamp * 1000, // API returns seconds
                job_description: item.job_description,
                job_apply_link: item.job_apply_link,
                job_min_salary: item.job_min_salary,
                job_max_salary: item.job_max_salary,
                job_salary_currency: item.job_salary_currency,
                match_score: Math.floor(Math.random() * 20) + 70 // Simulate a base match score for now
            }));

        } catch (error) {
            console.error("Error fetching jobs from JSearch:", error);
            // Fallback to mock data on error so the UI doesn't break
            return MOCK_JOBS;
        }
    },

    async getJobDetails(jobId: string): Promise<Job | null> {
        // Because the JSearch search endpoint returns the full description, 
        // we can often reuse the data if we have it cached.
        // However, JSearch also has a /job-details endpoint.
        
        // For simplicity in this demo, we'll try to find it in the MOCK_JOBS first.
        // If not found, we would ideally fetch from the API's specific endpoint.
        
        const mockJob = MOCK_JOBS.find(j => j.job_id === jobId);
        if (mockJob) return mockJob;

        console.log(`Fetching details for job ${jobId}...`);

        const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;
        const apiHost = 'jsearch.p.rapidapi.com';
        
        if (!apiKey) return null;

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apiHost
            }
        };

        try {
            const response = await fetch(`https://${apiHost}/job-details?job_id=${encodeURIComponent(jobId)}`, options);
             if (!response.ok) throw new Error("Failed to fetch job details");
             
             const data = await response.json();
             const item = data.data?.[0]; // JSearch returns array for details too usually
             
             if (!item) return null;

             return {
                job_id: item.job_id,
                employer_name: item.employer_name,
                employer_logo: item.employer_logo,
                job_title: item.job_title,
                job_city: item.job_city,
                job_country: item.job_country,
                job_is_remote: item.job_is_remote,
                job_posted_at_timestamp: item.job_posted_at_timestamp * 1000,
                job_description: item.job_description,
                job_apply_link: item.job_apply_link,
                job_min_salary: item.job_min_salary,
                job_max_salary: item.job_max_salary,
                job_salary_currency: item.job_salary_currency,
                match_score: 85 // Default score if fetched directly
             };
        } catch (error) {
            console.error("Error fetching job details:", error);
            return null;
        }
    }
};
