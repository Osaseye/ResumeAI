import { useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { toast } from 'sonner';

const PLAN_FEATURES = [
  "Unlimited AI Resume Optimizations",
  "Advanced Cover Letter Generator",
  "Mock Interview Simulator (Unlimited)",
  "Job Match Analytics",
  "ATS Score Checker",
  "Priority Support"
];

const BILLING_HISTORY: Array<{id: string, date: string, amount: string, status: string, plan: string}> = [
    // { id: 'inv_001', date: 'Feb 01, 2026', amount: '₦ 5,000.00', status: 'Paid', plan: 'Pro Monthly' },
];

export const BillingPage = () => {
  const [currentPlan] = useState('free');
  console.log("Current Plan:", currentPlan);

  const handleUpgrade = () => {
    toast.success('Redirecting to payment gateway...');
    // Stripe/Paddle integration would typically go here
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
        <p className="text-gray-500 mb-8">Manage your plan and payment details.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Current Plan Card */}
            <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <span className="material-symbols-outlined text-9xl">diamond</span>
                </div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10">Current Plan</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-2">Free Plan</h2>
                    <p className="text-indigo-200 mb-8 text-lg">₦ 0.00 / month</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                        {PLAN_FEATURES.slice(0, 2).map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                                <span className="material-symbols-outlined text-green-400 text-base">check_circle</span>
                                {feature}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <button 
                            onClick={handleUpgrade}
                            className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition shadow-lg"
                        >
                            Upgrade to Pro
                        </button> 
                    </div>
                </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-gray-900 mb-6">Payment Method</h3>
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-xl mb-4 bg-gray-50 text-center">
                        <span className="material-symbols-outlined text-gray-400 text-3xl mb-2">credit_card</span>
                        <p className="text-sm text-gray-500">No payment method added</p>
                    </div>
                </div>
                <button className="w-full py-3 text-indigo-600 font-bold text-sm bg-indigo-50 hover:bg-indigo-100 rounded-xl transition">
                    Add Payment Method
                </button>
            </div>
        </div>

        {/* Invoice History */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-lg">Billing History</h3>
                <button className="text-sm text-indigo-600 font-medium hover:underline">Download All</button>
            </div>
            <div className="divide-y divide-gray-100">
                {BILLING_HISTORY.map((invoice) => (
                    <div key={invoice.id} className="grid grid-cols-2 md:grid-cols-5 px-8 py-5 items-center hover:bg-gray-50 transition">
                         <div className="col-span-1 md:col-span-1">
                             <p className="font-medium text-gray-900 text-sm">{invoice.date}</p>
                         </div>
                         <div className="col-span-1 md:col-span-1">
                             <p className="text-gray-500 text-sm">{invoice.plan}</p>
                         </div>
                         <div className="hidden md:block col-span-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {invoice.status}
                            </span>
                         </div>
                         <div className="hidden md:block col-span-1 text-right md:text-left">
                             <p className="font-medium text-gray-900">{invoice.amount}</p>
                         </div>
                         <div className="col-span-2 md:col-span-1 flex justify-end">
                            <button className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-xs font-bold border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-white hover:shadow-sm transition">
                                <span className="material-symbols-outlined text-sm">download</span> PDF
                            </button>
                         </div>
                    </div>
                ))}
            </div>
        </section>
      </div>
    </DashboardLayout>
  );
};
