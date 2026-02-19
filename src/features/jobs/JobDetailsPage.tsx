import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useParams, Link } from 'react-router-dom';

export const JobDetailsPage = () => {
    const { id } = useParams();
    // Use id to avoid TS unused variable error until we implement fetching
    console.log("Viewing job:", id);

    // Mock data - in a real app this would come from an API based on ID
    const job = {
        title: 'Senior Product Designer',
        company: 'Paystack',
        location: 'Lagos, Nigeria (Hybrid)',
        type: 'Full-time',
        salary: '₦800k - ₦1.2M / month',
        posted: '2 days ago',
        description: `We are looking for a Senior Product Designer to join our team in Lagos. You will be responsible for defining the user experience for our payment products.

Key Responsibilities:
- Lead design projects from concept to launch
- Collaborate with engineers and product managers
- Conduct user research and usability testing
- Create high-fidelity prototypes

Requirements:
- 5+ years of experience in product design
- Proficiency in Figma and prototyping tools
- Strong portfolio demonstrating complex problem solving
- Experience with fintech is a plus`,
        requirements: ['Figma', 'Prototyping', 'User Research', 'Design Systems'],
        benefits: ['Health Insurance', 'Remote Work Options', 'Professional Development', 'Team Retreats']
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <Link to="/jobs" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                    <span className="material-symbols-outlined text-sm mr-2">arrow_back</span>
                    Back to Jobs
                </Link>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="flex gap-6">
                                <div className="w-20 h-20 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg shadow-blue-200">
                                    P
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <span className="material-symbols-outlined text-[20px]">apartment</span>
                                            {job.company}
                                        </span>
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <span className="material-symbols-outlined text-[20px]">location_on</span>
                                            {job.location}
                                        </span>
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <span className="material-symbols-outlined text-[20px]">schedule</span>
                                            {job.posted}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 min-w-[200px]">
                                <button className="w-full bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2">
                                    <span>Apply Now</span>
                                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                                </button>
                                <Link to="/mock-interview" className="w-full bg-blue-50 text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-100 transition flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[20px]">videocam</span>
                                    Practice Interview
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                        <div className="lg:col-span-2 p-8 space-y-8">
                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">About the Role</h3>
                                <div className="prose prose-gray max-w-none text-gray-600 whitespace-pre-line">
                                    {job.description}
                                </div>
                            </section>
                            
                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Key Responsibilities</h3>
                                <ul className="space-y-3">
                                    {['Lead design projects from concept to launch', 'Collaborate with engineers and product managers', 'Conduct user research and usability testing'].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-600">
                                            <span className="material-symbols-outlined text-green-500 text-xl mt-0.5">check</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>
                        
                        <div className="lg:col-span-1 p-8 bg-gray-50/50 space-y-8">
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Job Overview</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Salary Range</p>
                                        <p className="font-bold text-gray-900">{job.salary}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Job Type</p>
                                        <div className="flex flex-wrap gap-2">
                                             <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700">Full-time</span>
                                             <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700">Hybrid</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Skills Required</h3>
                                <div className="flex flex-wrap gap-2">
                                    {job.requirements.map(req => (
                                        <span key={req} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold">
                                            {req}
                                        </span>
                                    ))}
                                </div>
                            </div>

                             <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Match Analysis</h3>
                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">Profile Match</span>
                                        <span className="text-green-600 font-bold">94%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Your experience with Figma and Fintech aligns perfectly with this role.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
