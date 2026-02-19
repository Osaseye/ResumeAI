import { useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { toast } from 'sonner';

export const AccountPage = () => {
  const [formData, setFormData] = useState({
    fullName: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully');
  };

  const handleUpdatePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Password updated successfully');
    setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
        <p className="text-gray-500 mb-8">Manage your profile information and security settings.</p>

        <div className="space-y-8">
          {/* Profile Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-2xl">
                {formData.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="text-indigo-600 font-medium text-sm hover:underline">Change Avatar</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>
              <div className="pt-2">
                <button 
                  onClick={handleSaveProfile}
                  className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-6">Security</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>
              </div>
              <div className="pt-2">
                <button 
                  onClick={handleUpdatePassword}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Update Password
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};
