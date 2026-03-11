import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from './AuthContext';
import { jobsService } from '@/features/jobs/services/jobService';

// Validation Schema
const onboardingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  role: z.string().min(2, 'Current or target role is required'),
  experience: z.enum(['entry', 'mid', 'senior', 'executive']),
  goals: z.array(z.string()).min(1, 'Select at least one goal'),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

const EXPERIENCE_LEVELS = [
  { id: 'entry', label: 'Entry Level (0-2 years)', icon: 'school' },
  { id: 'mid', label: 'Mid Level (3-5 years)', icon: 'trending_up' },
  { id: 'senior', label: 'Senior Level (5-10 years)', icon: 'diamond' },
  { id: 'executive', label: 'Executive (10+ years)', icon: 'workspace_premium' },
];

const GOALS = [
  'Land a new job ASAP',
  'Switch careers completely',
  'Improve my resume ATS score',
  'Practice for interviews',
  'Negotiate a higher salary',
];

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get passed state from registration if available
  const { firstName, lastName } = location.state || {}; // Safe access if location.state is null

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: firstName && lastName ? `${firstName} ${lastName}` : '',
      goals: [],
    },
  });

  const selectedGoals = watch('goals');
  const selectedLevel = watch('experience');

  const toggleGoal = (goal: string) => {
    const current = selectedGoals || [];
    if (current.includes(goal)) {
      setValue('goals', current.filter((g) => g !== goal));
    } else {
      setValue('goals', [...current, goal]);
    }
  };

  const onSubmit = async (data: OnboardingData) => {
    if (!user) {
      toast.error('Session expired. Please log in again.');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: data.fullName,
        role: data.role,
        experienceLevel: data.experience,
        goals: data.goals,
        createdAt: new Date().toISOString(),
        onboardingComplete: true
      });
      
      // Trigger the single daily job scrape using the user's target role
      jobsService.fetchAndStoreJobs(data.role).catch(console.error);

      toast.success("Profile setup complete!", {
        description: "Welcome to your new dashboard.",
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Check Firestore security rules.');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    // Basic validation per step could be added here
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
      setStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="text-center mb-8">
            <img src="/icon.png" alt="Resume AI" className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">Welcome to Resume AI</h2>
            <p className="mt-2 text-gray-600">Let's personalize your experience in a few steps.</p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Step 1: Basic Info */}
            <div className={step === 1 ? 'block animate-fade-in-up' : 'hidden'}>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">What should we call you?</label>
                    <input 
                        {...register('fullName')}
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                        placeholder="e.g. David Okon"
                    />
                    {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current or Target Role</label>
                    <input 
                        {...register('role')}
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                        placeholder="e.g. Senior Product Designer"
                    />
                    {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
                </div>

                <button 
                    type="button"
                    onClick={nextStep}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 transition-all"
                >
                    Continue
                </button>
            </div>

            {/* Step 2: Experience Level */}
            <div className={step === 2 ? 'block animate-fade-in-up' : 'hidden'}>
                <h3 className="text-lg font-medium text-gray-900 mb-4">What's your experience level?</h3>
                <div className="grid grid-cols-1 gap-3 mb-6">
                    {EXPERIENCE_LEVELS.map((level) => (
                        <div 
                            key={level.id}
                            onClick={() => setValue('experience', level.id as any)}
                            className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                                selectedLevel === level.id 
                                    ? 'border-black bg-gray-50 ring-1 ring-black' 
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                                selectedLevel === level.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
                            }`}>
                                <span className="material-symbols-outlined">{level.icon}</span>
                            </div>
                            <span className="font-medium text-gray-900">{level.label}</span>
                        </div>
                    ))}
                    {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>}
                </div>

                <div className="flex gap-3">
                    <button 
                        type="button"
                        onClick={prevStep}
                        className="flex-1 py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
                    >
                        Back
                    </button>
                    <button 
                        type="button"
                        onClick={nextStep}
                        className="flex-1 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 transition-all"
                    >
                        Continue
                    </button>
                </div>
            </div>

            {/* Step 3: Goals */}
            <div className={step === 3 ? 'block animate-fade-in-up' : 'hidden'}>
                <h3 className="text-lg font-medium text-gray-900 mb-4">What do you want to achieve?</h3>
                <div className="space-y-3 mb-8">
                    {GOALS.map((goal) => (
                        <div 
                            key={goal}
                            onClick={() => toggleGoal(goal)}
                            className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                                (selectedGoals || []).includes(goal)
                                    ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                                (selectedGoals || []).includes(goal) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'
                            }`}>
                                {(selectedGoals || []).includes(goal) && (
                                    <span className="material-symbols-outlined text-white text-xs font-bold">check</span>
                                )}
                            </div>
                            <span className={`font-medium ${(selectedGoals || []).includes(goal) ? 'text-indigo-900' : 'text-gray-700'}`}>
                                {goal}
                            </span>
                        </div>
                    ))}
                    {errors.goals && <p className="mt-1 text-sm text-red-600">{errors.goals.message}</p>}
                </div>

                <div className="flex gap-3">
                    <button 
                        type="button"
                        onClick={prevStep}
                        className="flex-1 py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
                    >
                        Back
                    </button>
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Setting up...' : 'Complete Setup'}
                    </button>
                </div>
            </div>


            {/* Progress Indicator */}
            <div className="flex justify-center gap-2 mt-8">
                {[1, 2, 3].map((s) => (
                    <div 
                        key={s} 
                        className={`h-1 rounded-full transition-all duration-300 ${
                            s === step ? 'w-8 bg-black' : s < step ? 'w-2 bg-green-500' : 'w-2 bg-gray-200'
                        }`}
                    />
                ))}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};
