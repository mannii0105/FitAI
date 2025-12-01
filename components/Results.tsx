import React from 'react';
import { BodyMeasurement, DressSuggestion } from '../types';
import { ArrowLeft, Check, Sparkles, Share2, ShoppingBag, Shirt } from 'lucide-react';

interface ResultsProps {
  measurement: BodyMeasurement;
  suggestions: DressSuggestion[];
  onReset: () => void;
  onTryOn: (dress: DressSuggestion) => void;
  onViewProfile: () => void;
}

export const Results: React.FC<ResultsProps> = ({ measurement, suggestions, onReset, onTryOn, onViewProfile }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onReset}
            className="flex items-center text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Scan
          </button>
          
          <button 
            onClick={onViewProfile}
            className="text-violet-400 hover:text-violet-300 font-semibold text-sm border border-violet-500/30 px-4 py-2 rounded-lg hover:bg-violet-500/10 transition-colors"
          >
            Edit Profile / Measurements
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Analysis Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-violet-500/20 rounded-lg">
                <Sparkles className="text-violet-400" size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">Your Body Profile</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400">Body Shape</p>
                <p className="text-2xl font-bold text-white">{measurement.bodyShape}</p>
              </div>
              
              <div>
                <p className="text-sm text-slate-400">Estimated Size</p>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                  {measurement.estimatedSize}
                </p>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-4 space-y-2 border border-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Shoulders</span>
                  <span className="text-white font-mono">{measurement.measurements.shoulders}"</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bust</span>
                  <span className="text-white font-mono">{measurement.measurements.bust}"</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Waist</span>
                  <span className="text-white font-mono">{measurement.measurements.waist}"</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hips</span>
                  <span className="text-white font-mono">{measurement.measurements.hips}"</span>
                </div>
              </div>
              
              <div className="text-xs text-slate-500 italic mt-4">
                *Measurements are AI estimates. Edit in Profile for better accuracy.
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions Grid */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            Curated For You <span className="ml-2 text-sm font-normal text-slate-400 bg-slate-800 px-2 py-1 rounded-full">AI Match {Math.round(measurement.confidence)}%</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestions.map((suggestion, idx) => (
              <div 
                key={idx}
                className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-violet-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-violet-900/20 flex flex-col"
              >
                {/* Visual Placeholder for Dress */}
                <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent">
                         <span className="inline-block px-3 py-1 bg-violet-600 text-xs font-bold rounded-full text-white mb-2">
                            {suggestion.style}
                         </span>
                    </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-2">{suggestion.name}</h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{suggestion.description}</p>
                  
                  <div className="mb-4 flex-1">
                    <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-2">Why it works</p>
                    <p className="text-sm text-slate-300">{suggestion.reason}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 mt-auto">
                    <div className="flex space-x-2">
                       {suggestion.colorPalette.map((color, i) => (
                           <div key={i} className="w-4 h-4 rounded-full border border-slate-500" style={{backgroundColor: color.toLowerCase()}} title={color}></div>
                       ))}
                    </div>
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => onTryOn(suggestion)}
                            className="flex items-center space-x-2 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-violet-600 transition-colors text-sm"
                        >
                            <Shirt size={16} />
                            <span>Try On</span>
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};