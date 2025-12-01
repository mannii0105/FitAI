import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, Upload, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface ScannerProps {
  onCapture: (image: string) => void;
  isProcessing: boolean;
}

export const Scanner: React.FC<ScannerProps> = ({ onCapture, isProcessing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
      console.error(err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [mode, startCamera, stopCamera]);

  const captureFrame = () => {
    if (videoRef.current && stream) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        // Clean base64 string
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64 = dataUrl.split(',')[1];
        onCapture(base64);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        onCapture(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Toggle Modes */}
        <div className="flex justify-center mb-6 space-x-4">
            <button 
                onClick={() => setMode('camera')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${mode === 'camera' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
            >
                <Camera size={18} />
                <span>Live Camera</span>
            </button>
            <button 
                onClick={() => setMode('upload')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${mode === 'upload' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
            >
                <Upload size={18} />
                <span>Upload Photo</span>
            </button>
        </div>

        {/* Viewport */}
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden border-2 border-slate-700 shadow-inner group">
            {isProcessing && (
                <div className="absolute inset-0 z-20 bg-slate-900/80 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-violet-300 font-medium animate-pulse">Analyzing Proportions...</p>
                </div>
            )}

            {mode === 'camera' ? (
                error ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 p-4 text-center">
                        <XCircle size={48} className="mb-2" />
                        <p>{error}</p>
                        <button onClick={startCamera} className="mt-4 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600">Retry</button>
                    </div>
                ) : (
                    <>
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
                        />
                        {/* Overlay Guidelines */}
                        <div className="absolute inset-0 pointer-events-none opacity-30">
                            <div className="w-full h-full border-4 border-dashed border-white/50 rounded-xl"></div>
                            <div className="absolute top-1/4 left-0 w-full h-0.5 bg-white/30"></div>
                            <div className="absolute bottom-1/4 left-0 w-full h-0.5 bg-white/30"></div>
                            <div className="absolute left-1/2 top-0 w-0.5 h-full bg-white/30"></div>
                        </div>
                        
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
                            <button 
                                onClick={captureFrame}
                                disabled={isProcessing}
                                className="group/btn relative w-16 h-16 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 transition-transform"
                            >
                                <div className="w-12 h-12 bg-red-500 rounded-full group-hover/btn:bg-red-400 transition-colors"></div>
                            </button>
                        </div>
                    </>
                )
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400 border-dashed border-2 border-slate-600">
                    <Upload size={64} className="mb-4 opacity-50" />
                    <p className="mb-4 text-lg">Click or Drag to Upload</p>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
            )}
        </div>
        <div className="mt-4 text-center text-sm text-slate-500">
            <p>Ensure your full body is visible and you are wearing fitted clothing for best results.</p>
        </div>
    </div>
  );
};
