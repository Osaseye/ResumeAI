import type { CoverLetterFormData } from '@/features/cover-letter/types';

interface CoverLetterPreviewProps {
    data: CoverLetterFormData;
    template: 'professional' | 'modern' | 'creative' | 'simple' | 'tech';
}

export const CoverLetterPreview = ({ data, template }: CoverLetterPreviewProps) => {
    
    // Formatting helper
    const formatDate = () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // 1. Professional (Serif, formal layout)
    if (template === 'professional') {
        return (
            <div className="bg-white p-12 shadow-sm font-serif text-gray-900 border border-gray-100 max-w-[210mm] mx-auto min-h-[297mm]">
                <header className="border-b-2 border-gray-800 pb-6 mb-8">
                    <h1 className="text-3xl font-bold uppercase tracking-wide mb-2">Your Name</h1> {/* Fallback if name not in form data yet */}
                    <div className="text-sm text-gray-600">
                        San Francisco, CA • email@example.com • (555) 123-4567
                    </div>
                </header>

                <div className="mb-8 text-sm">
                    <p>{formatDate()}</p>
                    <div className="mt-6">
                        <p className="font-bold">{data.recipientName || 'Hiring Manager'}</p>
                        <p>{data.recipientRole}</p>
                        <p>{data.company}</p>
                    </div>
                </div>

                <div className="space-y-4 text-justify leading-relaxed text-sm">
                    <p>{data.content.intro}</p>
                    <p className="whitespace-pre-line">{data.content.body}</p>
                    <p>{data.content.conclusion}</p>
                    <div className="mt-8">
                        <p>Sincerely,</p>
                        <p className="mt-4 font-bold">Your Name</p>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Modern (Sans-serif, clean header)
    if (template === 'modern') {
        return (
            <div className="bg-white p-10 shadow-sm font-sans text-gray-800 max-w-[210mm] mx-auto min-h-[297mm]">
                <header className="flex justify-between items-end border-b border-gray-200 pb-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-light text-gray-900 mb-1">Your Name</h1>
                        <p className="text-blue-600 font-medium tracking-wide">Professional Title</p>
                    </div>
                    <div className="text-right text-xs text-gray-500 space-y-1">
                        <p>email@example.com</p>
                        <p>(555) 123-4567</p>
                    </div>
                </header>

                <div className="flex gap-12">
                    <div className="w-1/4 pt-2">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Recipient</div>
                        <div className="text-sm font-medium">{data.recipientName || 'Hiring Manager'}</div>
                        <div className="text-xs text-gray-500 mb-1">{data.recipientRole}</div>
                        <div className="text-xs text-gray-500">{data.company}</div>
                        
                         <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-8 mb-4">Date</div>
                         <div className="text-sm">{formatDate()}</div>
                    </div>
                    
                    <div className="w-3/4 space-y-4 text-sm leading-relaxed text-gray-600">
                         <p className="font-medium text-gray-900">Dear {data.recipientName || 'Hiring Manager'},</p>
                         <p>{data.content.intro}</p>
                         <p className="whitespace-pre-line">{data.content.body}</p>
                         <p>{data.content.conclusion}</p>
                         
                         <div className="mt-8 pt-8 border-t border-gray-100">
                            <p>Sincerely,</p>
                            <p className="font-bold text-gray-900 mt-2">Your Name</p>
                         </div>
                    </div>
                </div>
            </div>
        );
    }

    // 3. Creative (Bold sidebar)
    if (template === 'creative') {
        return (
             <div className="bg-white shadow-sm font-sans text-gray-800 max-w-[210mm] mx-auto min-h-[297mm] flex">
                <div className="w-1/3 bg-purple-900 text-white p-8">
                    <h1 className="text-3xl font-bold mb-12 leading-tight">Your<br/>Name</h1>
                    
                    <div className="space-y-8 opacity-90 text-sm font-light">
                        <div>
                            <div className="text-xs font-bold uppercase tracking-widest text-purple-300 mb-2">Subject</div>
                            <div>Role: {data.jobTitle}</div>
                            <div>Co: {data.company}</div>
                        </div>
                        
                        <div>
                            <div className="text-xs font-bold uppercase tracking-widest text-purple-300 mb-2">Contact</div>
                            <div>email@example.com</div>
                            <div>(555) 123-4567</div>
                        </div>
                    </div>
                </div>
                
                <div className="w-2/3 p-12 bg-gray-50">
                    <div className="text-right text-sm text-gray-500 mb-12">{formatDate()}</div>
                    
                    <div className="space-y-5 text-sm leading-relaxed text-gray-700">
                        <p className="font-bold text-gray-900">Dear {data.recipientName || 'Hiring Manager'},</p>
                        <p>{data.content.intro}</p>
                        <p className="whitespace-pre-line">{data.content.body}</p>
                        <p>{data.content.conclusion}</p>
                        <div className="mt-8">
                            <p>Sincerely,</p>
                            <p className="text-purple-900 font-bold mt-2">Your Name</p>
                        </div>
                    </div>
                </div>
             </div>
        );
    }
    
    // 4. Simple (Minimalist)
    if (template === 'simple') {
        return (
            <div className="bg-white p-12 shadow-sm font-sans text-gray-700 max-w-[210mm] mx-auto min-h-[297mm]">
                 <div className="border-l-4 border-gray-900 pl-6 mb-12">
                     <h1 className="text-2xl font-bold text-gray-900">Your Name</h1>
                     <p className="text-sm mt-1">email@example.com</p>
                 </div>
                 
                 <div className="mb-8 text-sm">
                     <p className="mb-4">{formatDate()}</p>
                     <p className="font-bold">{data.recipientName || 'Hiring Manager'}</p>
                     <p>{data.company}</p>
                 </div>
                 
                 <div className="space-y-4 text-justify leading-relaxed text-sm">
                    <p>Dear {data.recipientName || 'Hiring Manager'},</p>
                    <p>{data.content.intro}</p>
                    <p className="whitespace-pre-line">{data.content.body}</p>
                    <p>{data.content.conclusion}</p>
                    <div className="mt-12">
                        <p>Sincerely,</p>
                        <p className="mt-2 text-gray-900">Your Name</p>
                    </div>
                </div>
            </div>
        );
    }

    // 5. Tech (Monospace)
    return (
        <div className="bg-white p-10 shadow-sm font-mono text-gray-800 max-w-[210mm] mx-auto min-h-[297mm]">
            <div className="mb-8 border-b-2 border-dashed border-gray-300 pb-4">
                <h1 className="text-xl font-bold">&lt;CoverLetter /&gt;</h1>
                <p className="text-xs text-gray-500 mt-1">compiled: {formatDate()}</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-xs md:text-sm leading-loose">
                <p className="text-blue-600 mb-4">@recipient: "{data.recipientName || 'Hiring Manager'}"</p>
                <p className="text-blue-600 mb-6">@company: "{data.company}"</p>
                
                <p className="mb-4">Dear {data.recipientName || 'Hiring Manager'},</p>
                <p className="mb-4">{data.content.intro}</p>
                <p className="mb-4 whitespace-pre-line">{data.content.body}</p>
                <p className="mb-4">{data.content.conclusion}</p>
                
                <p className="mt-8 text-green-600">return "Your Name";</p>
            </div>
        </div>
    );
};
