import React, { useState } from 'react';
import { Hero3D } from './components/Hero3D';
import { Scanner } from './components/Scanner';
import { Results } from './components/Results';
import { Profile } from './components/Profile';
import { VirtualTryOn } from './components/VirtualTryOn';
import { analyzeBodyFromImage, getDressSuggestions } from './services/geminiService';
import { BodyMeasurement, DressSuggestion, AppState, UserProfile } from './types';
import { PRICING_TIERS, APP_NAME } from './constants';
import { Check, Aperture, Menu, X, User } from 'lucide-react';

// Default initial profile
const INITIAL_PROFILE: UserProfile = {
  name: '',
  height: '170',
  weight: '60',
  avatarImage: null,
  measurements: {
    shoulders: '0',
    bust: '0',
    waist: '0',
    hips: '0'
  }
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [currentMeasurement, setCurrentMeasurement] = useState<BodyMeasurement | null>(null);
  const [suggestions, setSuggestions] = useState<DressSuggestion[]>([]);
  const [selectedDress, setSelectedDress] = useState<DressSuggestion | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCapture = async (base64Image: string) => {
    try {
      setIsProcessing(true);
      
      // 1. Analyze Body
      const bodyData = await analyzeBodyFromImage(base64Image);
      setCurrentMeasurement(bodyData);
      
      // Update User Profile with new data
      setUserProfile(prev => ({
        ...prev,
        avatarImage: base64Image,
        measurements: bodyData.measurements
      }));

      // 2. Get Suggestions
      const dresses = await getDressSuggestions(bodyData);
      setSuggestions(dresses);
      
      setAppState(AppState.RESULTS);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Something went wrong with the AI analysis. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
     setUserProfile(updatedProfile);
     // Also update current measurement view if in results
     if (currentMeasurement) {
        setCurrentMeasurement({
           ...currentMeasurement,
           measurements: updatedProfile.measurements
        });
     }
     setAppState(AppState.RESULTS);
  };

  const handleReset = () => {
    setAppState(AppState.LANDING);
    setCurrentMeasurement(null);
    setSuggestions([]);
  };

  const handleTryOn = (dress: DressSuggestion) => {
    setSelectedDress(dress);
    setAppState(AppState.TRY_ON);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-violet-500 selection:text-white">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-900 to-black -z-50" />
      
      {/* 3D Background - Always present but subtle */}
      <Hero3D />

      {/* Navbar */}
      <nav className="relative z-50 border-b border-white/5 bg-slate-900/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setAppState(AppState.LANDING)}>
              <div className="bg-gradient-to-tr from-violet-600 to-pink-600 p-2 rounded-lg">
                <Aperture className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                {APP_NAME}
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
              {/* Profile Shortcut */}
              {userProfile.avatarImage && (
                 <div 
                   onClick={() => setAppState(AppState.PROFILE)}
                   className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden cursor-pointer border border-violet-500"
                 >
                    <img src={`data:image/jpeg;base64,${userProfile.avatarImage}`} className="w-full h-full object-cover" />
                 </div>
              )}
              <button 
                onClick={() => setAppState(AppState.SCANNING)}
                className="px-6 py-2 bg-white text-slate-900 rounded-full font-semibold hover:bg-gray-100 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                {appState === AppState.LANDING ? 'Try Now' : 'New Scan'}
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-white/10 px-4 py-4 space-y-4">
             <a href="#features" className="block text-slate-300" onClick={() => setMobileMenuOpen(false)}>Features</a>
             <a href="#pricing" className="block text-slate-300" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
             <button 
                onClick={() => { setAppState(AppState.SCANNING); setMobileMenuOpen(false); }}
                className="w-full py-2 bg-violet-600 text-white rounded-lg"
              >
                Start Scanning
              </button>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 pt-16 pb-24">
        
        {/* State: LANDING */}
        {appState === AppState.LANDING && (
          <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-200px)]">
            <div className="max-w-4xl mx-auto space-y-8 animate-fadeInUp">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                The Perfect Fit, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400">
                   Reimagined by AI.
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-10">
                Instantly analyze your measurements with computer vision, build your profile, and visualize your perfect dress in 3D.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setAppState(AppState.SCANNING)}
                  className="px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-full text-lg font-bold transition-all hover:scale-105 hover:shadow-xl shadow-violet-500/20"
                >
                  Start Virtual Fitting
                </button>
                <button className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full text-lg font-semibold hover:bg-white/5 transition-all">
                  View Demo
                </button>
              </div>

              {/* Stats/Trust */}
              <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-white/5 mt-12">
                <div>
                   <p className="text-3xl font-bold text-white">98%</p>
                   <p className="text-sm text-slate-500 uppercase tracking-wide">Accuracy</p>
                </div>
                <div>
                   <p className="text-3xl font-bold text-white">3D</p>
                   <p className="text-sm text-slate-500 uppercase tracking-wide">Visualization</p>
                </div>
                <div>
                   <p className="text-3xl font-bold text-white">50k+</p>
                   <p className="text-sm text-slate-500 uppercase tracking-wide">Styles</p>
                </div>
                 <div>
                   <p className="text-3xl font-bold text-white">24/7</p>
                   <p className="text-sm text-slate-500 uppercase tracking-wide">AI Stylist</p>
                </div>
              </div>
            </div>

            {/* Pricing Section (Landing Page Only) */}
            <div id="pricing" className="mt-32 w-full max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-slate-400">Choose the plan that fits your needs.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {PRICING_TIERS.map((tier, idx) => (
                        <div key={idx} className={`relative p-8 rounded-2xl border ${tier.recommended ? 'bg-slate-800/80 border-violet-500 shadow-2xl shadow-violet-900/20' : 'bg-slate-900/40 border-slate-800'} backdrop-blur-sm flex flex-col`}>
                            {tier.recommended && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-violet-600 to-pink-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                                    MOST POPULAR
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                            <div className="text-4xl font-bold text-white mb-6">{tier.price}</div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {tier.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-start text-slate-300 text-sm">
                                        <Check size={16} className="text-violet-400 mr-2 mt-0.5 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full py-3 rounded-xl font-bold transition-all ${tier.recommended ? 'bg-white text-slate-900 hover:bg-gray-100' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
                                Choose {tier.name}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        )}

        {/* State: SCANNING */}
        {appState === AppState.SCANNING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
             <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Capture Your Look</h2>
                <p className="text-slate-400">Stand back, ensure good lighting, and capture a full-body shot.</p>
             </div>
             <Scanner onCapture={handleCapture} isProcessing={isProcessing} />
             {isProcessing && (
                 <div className="mt-8 text-slate-400 animate-pulse text-center max-w-md">
                     <p>AI is analyzing body landmarks & proportions...</p>
                     <p className="text-xs mt-2 opacity-60">Using Gemini 2.5 Flash Computer Vision</p>
                 </div>
             )}
          </div>
        )}

        {/* State: RESULTS */}
        {appState === AppState.RESULTS && currentMeasurement && (
          <Results 
            measurement={currentMeasurement} 
            suggestions={suggestions} 
            onReset={handleReset} 
            onTryOn={handleTryOn}
            onViewProfile={() => setAppState(AppState.PROFILE)}
          />
        )}

        {/* State: PROFILE */}
        {appState === AppState.PROFILE && (
            <Profile 
                userProfile={userProfile}
                onUpdateProfile={handleUpdateProfile}
                onBack={() => currentMeasurement ? setAppState(AppState.RESULTS) : setAppState(AppState.LANDING)}
            />
        )}

        {/* State: TRY_ON */}
        {appState === AppState.TRY_ON && selectedDress && (
            <VirtualTryOn 
                userProfile={userProfile}
                selectedDress={selectedDress}
                onBack={() => setAppState(AppState.RESULTS)}
            />
        )}

      </main>

      {/* Footer */}
      {appState !== AppState.TRY_ON && (
          <footer className="relative z-10 border-t border-white/5 bg-black/20 backdrop-blur-lg mt-20">
            <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                    <Aperture className="text-violet-500" size={24} />
                    <span className="text-xl font-bold text-white">{APP_NAME}</span>
                </div>
                <div className="flex space-x-6 text-slate-400">
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Contact</a>
                </div>
                <div className="mt-4 md:mt-0 text-slate-600 text-sm">
                    © 2024 FitAI Inc. All rights reserved.
                </div>
            </div>
          </footer>
      )}
    </div>
  );
};

export default App;