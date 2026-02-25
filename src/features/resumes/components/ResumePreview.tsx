import type { ResumeFormData } from '../types';

interface ResumePreviewProps {
    data: ResumeFormData;
    template: 'professional' | 'modern' | 'creative' | 'simple' | 'tech';
}

export const ResumePreview = ({ data, template }: ResumePreviewProps) => {
    
    // 1. Professional (Classic, Serif, clean lines)
    if (template === 'professional') {
        return (
            <div className="bg-white p-8 shadow-sm print-no-shadow font-serif text-gray-900 border border-gray-100 max-w-[210mm] mx-auto min-h-[297mm]">
                <header className="border-b-2 border-gray-800 pb-4 mb-6">
                    <h1 className="text-4xl font-bold uppercase tracking-wide mb-2">{data.contact.fullName}</h1>
                    <div className="text-sm flex flex-wrap gap-4 text-gray-600">
                        {data.contact.email && <span>{data.contact.email}</span>}
                        {data.contact.phone && <span>| {data.contact.phone}</span>}
                        {data.contact.location && <span>| {data.contact.location}</span>}
                        {data.contact.linkedin && <span>| {data.contact.linkedin}</span>}
                    </div>
                </header>

                {data.summary && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Professional Summary</h2>
                        <p className="text-sm leading-relaxed text-justify">{data.summary}</p>
                    </section>
                )}

                {data.experience.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Experience</h2>
                        <div className="space-y-4">
                            {data.experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-md">{exp.role}</h3>
                                        <span className="text-sm italic">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                                    </div>
                                    <div className="text-sm font-semibold mb-2">{exp.company} | {exp.location}</div>
                                    <ul className="list-disc list-outside ml-5 text-sm space-y-1">
                                        {exp.description.split('\n').map((line, i) => (
                                            line.trim() && <li key={i}>{line.trim()}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.education.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Education</h2>
                        <div className="space-y-3">
                            {data.education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="flex justify-between font-bold text-md">
                                        <span>{edu.school}</span>
                                        <span className="text-sm font-normal">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</span>
                                    </div>
                                    <div className="text-sm">{edu.degree} in {edu.field}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.skills.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Skills</h2>
                        <div className="text-sm flex flex-wrap gap-x-6 gap-y-2">
                            {data.skills.map((skill) => (
                                <span key={skill.id} className="font-medium">• {skill.name}</span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        );
    }

    // 2. Modern (Clean sans-serif, accent color, side column or header block)
    if (template === 'modern') {
        return (
            <div className="bg-white shadow-sm print-no-shadow font-sans text-gray-800 max-w-[210mm] mx-auto min-h-[297mm] flex flex-col">
                <header className="bg-slate-800 text-white p-8">
                    <h1 className="text-4xl font-light mb-2">{data.contact.fullName}</h1>
                    <p className="text-slate-300 text-lg mb-4">{data.headline || data.experience[0]?.role}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                        {data.contact.email && <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">mail</span>{data.contact.email}</div>}
                        {data.contact.phone && <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">call</span>{data.contact.phone}</div>}
                        {data.contact.location && <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">location_on</span>{data.contact.location}</div>}
                    </div>
                </header>

                <div className="p-8 grid grid-cols-3 gap-8 flex-grow">
                    <div className="col-span-2 space-y-6">
                         {data.summary && (
                            <section>
                                <h2 className="text-slate-800 font-bold uppercase tracking-wider text-sm mb-3 border-b-2 border-blue-500 w-12 pb-1">Profile</h2>
                                <p className="text-sm leading-relaxed text-gray-600">{data.summary}</p>
                            </section>
                        )}

                        {data.experience.length > 0 && (
                            <section>
                                <h2 className="text-slate-800 font-bold uppercase tracking-wider text-sm mb-4 border-b-2 border-blue-500 w-12 pb-1">Experience</h2>
                                <div className="space-y-6">
                                    {data.experience.map((exp) => (
                                        <div key={exp.id} className="relative pl-4 border-l-2 border-gray-100">
                                            <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-500"></div>
                                            <h3 className="font-bold text-gray-900">{exp.role}</h3>
                                            <div className="text-blue-600 text-sm font-medium mb-2">{exp.company}</div>
                                            <ul className="list-disc list-outside ml-4 text-sm text-gray-600 space-y-1">
                                                {exp.description.split('\n').map((line, i) => (
                                                    line.trim() && <li key={i}>{line.trim()}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="col-span-1 space-y-6 border-l border-gray-100 pl-6">
                         {data.contact.linkedin && (
                            <div className="text-sm text-gray-600 mb-4">
                                <span className="font-bold text-slate-800 block mb-1">LinkedIn</span>
                                {data.contact.linkedin}
                            </div>
                        )}
                        
                         {data.skills.length > 0 && (
                            <section>
                                <h2 className="text-slate-800 font-bold uppercase tracking-wider text-sm mb-4 border-b-2 border-blue-500 w-12 pb-1">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {data.skills.map((skill) => (
                                        <span key={skill.id} className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded">{skill.name}</span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.education.length > 0 && (
                            <section>
                                <h2 className="text-slate-800 font-bold uppercase tracking-wider text-sm mb-4 border-b-2 border-blue-500 w-12 pb-1">Education</h2>
                                <div className="space-y-4">
                                    {data.education.map((edu) => (
                                        <div key={edu.id}>
                                            <div className="font-bold text-sm text-gray-900">{edu.school}</div>
                                            <div className="text-xs text-gray-600">{edu.degree}</div>
                                            <div className="text-xs text-gray-500 mt-1">{edu.startDate} - {edu.endDate}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // 3. Simple (Minimalist, centered header)
    if (template === 'simple') {
        return (
            <div className="bg-white p-10 shadow-sm print-no-shadow font-sans text-gray-900 max-w-[210mm] mx-auto min-h-[297mm]">
                <header className="text-center mb-10">
                    <h1 className="text-3xl font-light tracking-widest uppercase mb-3">{data.contact.fullName}</h1>
                    <div className="text-xs tracking-wide text-gray-500 uppercase space-x-3">
                        {data.contact.location && <span>{data.contact.location}</span>}
                        {data.contact.email && <span>• {data.contact.email}</span>}
                        {data.contact.phone && <span>• {data.contact.phone}</span>}
                    </div>
                </header>

                <div className="space-y-8 max-w-3xl mx-auto">
                    {data.summary && (
                        <p className="text-center text-sm leading-7 text-gray-600 italic">
                            {data.summary}
                        </p>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-center text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Experience</h2>
                            <div className="space-y-8">
                                {data.experience.map((exp) => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-bold text-lg">{exp.company}</h3>
                                            <span className="text-xs font-mono text-gray-500">{exp.startDate} — {exp.endDate}</span>
                                        </div>
                                        <div className="text-sm font-medium text-gray-600 mb-3">{exp.role}</div>
                                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                 </div>
            </div>
        );
    }
    
    // 4. Creative (Bold headers, split layout)
    if (template === 'creative') {
        return (
             <div className="bg-white shadow-sm print-no-shadow font-sans text-gray-800 max-w-[210mm] mx-auto min-h-[297mm] flex">
                <div className="w-1/3 bg-gray-900 text-white p-8 min-h-full">
                    <h1 className="text-3xl font-bold mb-8 leading-tight">{data.contact.fullName.split(' ').map((n, i) => <span key={i} className="block">{n}</span>)}</h1>
                    
                    <div className="space-y-8 opacity-90">
                        <section>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Contact</h3>
                            <div className="text-sm space-y-2 font-light">
                                <div className="break-all">{data.contact.email}</div>
                                <div>{data.contact.phone}</div>
                                <div>{data.contact.location}</div>
                            </div>
                        </section>
                        
                        {data.education.length > 0 && (
                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Education</h3>
                                <div className="space-y-4">
                                    {data.education.map((edu) => (
                                        <div key={edu.id}>
                                            <div className="font-bold text-sm">{edu.school}</div>
                                            <div className="text-xs text-gray-400">{edu.degree}</div>
                                            <div className="text-xs text-gray-500">{edu.endDate}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        
                        {data.skills.length > 0 && (
                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Skills</h3>
                                <div className="flex flex-wrap gap-2 text-sm font-light">
                                    {data.skills.map((skill) => (
                                        <div key={skill.id} className="mb-1">{skill.name}</div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
                
                <div className="w-2/3 p-8">
                     {data.summary && (
                        <section className="mb-10">
                            <h2 className="text-4xl text-gray-200 font-bold mb-2 -ml-1">01</h2>
                            <h3 className="text-xl font-bold uppercase mb-4">Profile</h3>
                            <p className="text-sm leading-relaxed text-gray-600">{data.summary}</p>
                        </section>
                    )}
                    
                     {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-4xl text-gray-200 font-bold mb-2 -ml-1">02</h2>
                            <h3 className="text-xl font-bold uppercase mb-6">Experience</h3>
                            <div className="space-y-8">
                                {data.experience.map((exp) => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-lg">{exp.role}</h4>
                                            <span className="text-xs font-bold text-gray-400">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <div className="text-sm font-medium text-gray-500 mb-3">{exp.company}</div>
                                        <ul className="list-disc list-outside ml-4 text-sm text-gray-600 space-y-1">
                                            {exp.description.split('\n').map((line, i) => (
                                                line.trim() && <li key={i}>{line.trim()}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
             </div>
        );
    }
    
    // 5. Tech (Code-like font, dark mode optional or just clean mono)
    return (
        <div className="bg-white p-8 shadow-sm print-no-shadow font-mono text-gray-800 max-w-[210mm] mx-auto min-h-[297mm]">
            <header className="border-b-4 border-black pb-6 mb-8">
                <h1 className="text-3xl font-bold mb-2">&lt;{data.contact.fullName} /&gt;</h1>
                <div className="text-sm text-gray-600 flex gap-4">
                     {data.contact.email && <span>email: "{data.contact.email}"</span>}
                     {data.contact.location && <span>loc: "{data.contact.location}"</span>}
                </div>
            </header>
            
            <div className="flex gap-8">
                <div className="w-2/3 space-y-8">
                     <section>
                        <h2 className="text-lg font-bold bg-gray-100 inline-block px-2 py-1 mb-4"># Experience</h2>
                        <div className="space-y-6">
                            {data.experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="font-bold text-md">{exp.role} @ {exp.company}</div>
                                    <div className="text-xs text-gray-500 mb-2">// {exp.startDate} to {exp.endDate}</div>
                                    <p className="text-sm whitespace-pre-line border-l-2 border-gray-200 pl-3">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
                
                <div className="w-1/3 space-y-8">
                     <section>
                        <h2 className="text-lg font-bold bg-gray-100 inline-block px-2 py-1 mb-4"># Skills</h2>
                        <ul className="text-sm space-y-1">
                             {data.skills.map((skill) => (
                                <li key={skill.id}>const {skill.name.toLowerCase().replace(/ /g, '_')} = true;</li>
                            ))}
                        </ul>
                    </section>
                    
                     <section>
                        <h2 className="text-lg font-bold bg-gray-100 inline-block px-2 py-1 mb-4"># Education</h2>
                         <div className="space-y-4">
                            {data.education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="font-bold text-sm">{edu.school}</div>
                                    <div className="text-xs">{edu.degree}</div>
                                    <div className="text-xs text-gray-500">{edu.endDate}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
