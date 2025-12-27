// src/components/Register.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Building, MapPin, Sparkles, Shield, Zap, CheckCircle } from 'lucide-react';
import { industries, userTypes, leadSources, campaigns, budgetRanges, timeToBuy } from '../data/mockData';
import VideoModal from './VideoModal';
import Notification from './Notification';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    industry: '',
    country: '',
    state: '',
    city: '',
    userType: '',
    leadSource: '',
    campaign: '',
    marketingCampaignId: '',
    estimatedBudget: '',
    expectedTimeToBuy: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [notification, setNotification] = useState({
    isVisible: false,
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: ''
  });

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setNotification({ isVisible: true, type, title, message });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const customInputClass =
    "w-full px-5 py-4 text-white bg-white/10 border border-white/20 rounded-xl backdrop-blur-xl transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.6)] placeholder-gray-400 outline-none hover:bg-white/20";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser = { id: Date.now().toString(), ...formData };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // 🔥 Mark that registration was successful
    localStorage.setItem("justRegistered", "yes");

    setIsLoading(false);
    showNotification('success', 'Registration Successful!', 'Redirecting to login page...');

    setTimeout(() => {
      navigate('/login');  
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    if (currentStep === 1) return formData.fullName && formData.email && formData.phoneNumber;
    if (currentStep === 2) return formData.industry && formData.country && formData.state && formData.city;
    return formData.userType && formData.leadSource && formData.estimatedBudget && formData.expectedTimeToBuy;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 relative overflow-hidden">

      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-10 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center neon-glow float-animation">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-yellow-900" />
                </div>
              </div>
            </div>

            <h1 className="text-5xl font-bold text-white mb-4 gradient-text">
              Transform Your Marketing with AI
            </h1>
            <p className="text-xl text-gray-300 mb-2">Join the AI Marketing Revolution</p>
            <p className="text-gray-400">Create your account and unlock powerful AI tools</p>
          </div>

          {/* Progress bar + Steps UI */}
          <div className="mb-8">
            <div className="flex justify-center">
              <div className="flex items-center space-x-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                        currentStep >= step
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg animate-bounceSlow'
                          : 'bg-white/20 text-gray-400'
                      }`}
                    >
                      {currentStep > step ? <CheckCircle className="w-6 h-6" /> : step}
                    </div>
                    {step < 3 && (
                      <div className="w-16 h-1 mx-2 rounded-full bg-white/20"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-4 text-white text-lg font-medium">
              {currentStep === 1 && 'Personal Information'}
              {currentStep === 2 && 'Location Details'}
              {currentStep === 3 && 'Customer Journey'}
            </div>
          </div>

          <div className="glass rounded-3xl p-8 shadow-2xl border border-white/20 backdrop-blur-xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            <form onSubmit={handleSubmit}>

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-pulse" />
                    <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-gray-200 font-medium">Full Name *</label>
                      <input
                        name="fullName"
                        type="text"
                        className={customInputClass}
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="text-gray-200 font-medium">Email *</label>
                      <input
                        name="email"
                        type="email"
                        className={customInputClass}
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label className="text-gray-200 font-medium">Phone Number *</label>
                      <input
                        name="phoneNumber"
                        type="tel"
                        className={customInputClass}
                        required
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <MapPin className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
                    <h2 className="text-2xl font-bold text-white mb-2">Location & Industry</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-gray-200 font-medium">Industry *</label>
                      <select name="industry" className={customInputClass} required value={formData.industry} onChange={handleInputChange}>
                        <option value="">Select industry</option>
                        {industries.map(i => <option key={i}>{i}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-200 font-medium">Country *</label>
                      <input name="country" required className={customInputClass} value={formData.country} onChange={handleInputChange} />
                    </div>

                    <div>
                      <label className="text-gray-200 font-medium">State *</label>
                      <input name="state" required className={customInputClass} value={formData.state} onChange={handleInputChange} />
                    </div>

                    <div>
                      <label className="text-gray-200 font-medium">City *</label>
                      <input name="city" required className={customInputClass} value={formData.city} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Sparkles className="w-16 h-16 text-pink-400 mx-auto mb-4 animate-spin-slow" />
                    <h2 className="text-2xl font-bold text-white mb-2">Customer Journey</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-gray-200 font-medium">User Type *</label>
                      <select name="userType" className={customInputClass} required value={formData.userType} onChange={handleInputChange}>
                        <option value="">Select user type</option>
                        {userTypes.map(u => <option key={u}>{u}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-200 font-medium">Lead Source *</label>
                      <select name="leadSource" className={customInputClass} required value={formData.leadSource} onChange={handleInputChange}>
                        <option value="">Select source</option>
                        {leadSources.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-200 font-medium">Campaign</label>
                      <select name="campaign" className={customInputClass} value={formData.campaign} onChange={handleInputChange}>
                        <option value="">Select</option>
                        {campaigns.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-200 font-medium">Campaign ID</label>
                      <input name="marketingCampaignId" className={customInputClass} value={formData.marketingCampaignId} onChange={handleInputChange} />
                    </div>

                    <div>
                      <label className="text-gray-200 font-medium">Estimated Budget *</label>
                      <select name="estimatedBudget" className={customInputClass} required value={formData.estimatedBudget} onChange={handleInputChange}>
                        <option value="">Select</option>
                        {budgetRanges.map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-200 font-medium">Expected Time to Buy *</label>
                      <select name="expectedTimeToBuy" className={customInputClass} required value={formData.expectedTimeToBuy} onChange={handleInputChange}>
                        <option value="">Select</option>
                        {timeToBuy.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-10">
                {currentStep > 1 && (
                  <button type="button" onClick={prevStep} className="px-6 py-3 bg-white/10 text-white rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                    ⬅ Previous
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="ml-auto px-10 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl hover:scale-105 active:scale-95 rounded-xl transition-all duration-300"
                  >
                    Next ➜
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!isStepValid() || isLoading}
                    className="ml-auto px-10 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    {isLoading ? '⏳ Creating Account...' : '🚀 Create AI Account'}
                  </button>
                )}
              </div>
            </form>

            <div className="mt-8 text-center text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 underline font-semibold hover:text-blue-300">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      <VideoModal isOpen={false} onClose={() => {}} />
      <Notification {...notification} onClose={hideNotification} />
    </div>
  );
};

export default Register;
