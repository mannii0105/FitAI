import React, { useState, useEffect } from 'react';
import { UserProfile, BodyMeasurement } from '../types';
import { User, Save, Ruler, ArrowLeft } from 'lucide-react';

interface ProfileProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onBack: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ userProfile, onUpdateProfile, onBack }) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);

  useEffect(() => {
    setFormData(userProfile);
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, section?: 'measurements') => {
    const { name, value } = e.target;
    
    if (section === 'measurements') {
      setFormData(prev => ({
        ...prev,
        measurements: {
          ...prev.measurements,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    // Optional: add a toast notification here
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 animate-fadeIn">
       <button 
        onClick={onBack}
        className="mb-6 flex items-center text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar */}
        <div className="md:col-span-1">
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-6 shadow-xl text-center">
            <div className="w-32 h-32 mx-auto rounded-full bg-slate-700 overflow-hidden mb-4 border-4 border-violet-500 shadow-lg shadow-violet-500/20 relative">
              {formData.avatarImage ? (
                <img src={`data:image/jpeg;base64,${formData.avatarImage}`} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500">
                  <User size={48} />
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{formData.name || 'Guest User'}</h2>
            <p className="text-sm text-slate-400">Premium Member</p>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-bold text-white flex items-center">
                 <Ruler className="mr-2 text-violet-400" />
                 Measurements & Details
               </h3>
               <button type="submit" className="flex items-center space-x-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg transition-colors font-semibold shadow-lg shadow-violet-900/20">
                 <Save size={18} />
                 <span>Save Profile</span>
               </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                  placeholder="Enter your name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm text-slate-400">Height (cm)</label>
                    <input 
                      type="text" 
                      name="height" 
                      value={formData.height} 
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-violet-500 focus:outline-none"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm text-slate-400">Weight (kg)</label>
                    <input 
                      type="text" 
                      name="weight" 
                      value={formData.weight} 
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-violet-500 focus:outline-none"
                    />
                 </div>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-6">
                <h4 className="text-slate-300 font-semibold mb-4">Body Measurements (inches)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {['shoulders', 'bust', 'waist', 'hips'].map((key) => (
                        <div key={key} className="space-y-2">
                            <label className="text-xs uppercase text-slate-500 font-bold">{key}</label>
                            <input 
                                type="text"
                                name={key}
                                value={formData.measurements[key as keyof typeof formData.measurements]}
                                onChange={(e) => handleChange(e, 'measurements')}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-all font-mono"
                            />
                        </div>
                    ))}
                </div>
                <p className="text-xs text-slate-500 mt-4 italic">
                    * Adjust these values for the most accurate 3D visualization and fitting.
                </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};