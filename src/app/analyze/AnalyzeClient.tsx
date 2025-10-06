'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Sparkles, ArrowLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AnalyzePage() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      setCameraReady(false);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      setShowCamera(true);
      
      // Wait for DOM to update before setting srcObject
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          videoRef.current.onloadedmetadata = () => {
            console.log('Video metadata loaded');
            videoRef.current?.play()
              .then(() => {
                console.log('Video playing');
                setCameraReady(true);
              })
              .catch(err => {
                console.error('Error playing video:', err);
                setError('Failed to start camera preview. Please try again.');
              });
          };
        }
      }, 100);
      
      setError(null);
    } catch (err) {
      setError('Could not access camera. Please check permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
    setCameraReady(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      if (canvas.width === 0 || canvas.height === 0) {
        setError('Camera not ready. Please wait a moment and try again.');
        return;
      }
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');

        if (!imageData || imageData === 'data:,') {
          setError('Failed to capture photo. Please try again.');
          return;
        }
        
        setSelectedImage(imageData);
        stopCamera();
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-skin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: selectedImage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      router.push(`/analyze/results?id=${data.analysisId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
      setAnalyzing(false);
    }
  };

  const resetImage = () => {
    setSelectedImage(null);
    setError(null);
    stopCamera();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 text-gray-700 hover:text-rose-500 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-rose-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                MaiBeauti
              </span>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Skin Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload a clear selfie and our AI will analyze your skin in seconds
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          {!selectedImage && !showCamera ? (
            <div className="space-y-6">
              {/* Upload Options */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-rose-300 rounded-2xl p-8 text-center cursor-pointer hover:border-rose-500 hover:bg-rose-50 transition"
                >
                  <Upload className="w-12 h-12 text-rose-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Upload Photo
                  </h3>
                  <p className="text-sm text-gray-500">
                    From your device
                  </p>
                </div>

                <div
                  onClick={startCamera}
                  className="border-2 border-dashed border-purple-300 rounded-2xl p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition"
                >
                  <Camera className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Take Selfie
                  </h3>
                  <p className="text-sm text-gray-500">
                    Use your camera
                  </p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              {/* Tips */}
              <div className="bg-gradient-to-br from-rose-50 to-purple-50 rounded-2xl p-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Tips for best results:
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2">•</span>
                    Use natural lighting (face a window)
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2">•</span>
                    Remove makeup if possible
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2">•</span>
                    Face the camera directly
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2">•</span>
                    Ensure your full face is visible
                  </li>
                </ul>
              </div>
            </div>
          ) : showCamera ? (
            <div className="space-y-4">
              {/* Camera View */}
              <div className="relative bg-black rounded-2xl overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full max-h-96 object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
                
                {/* Loading overlay while camera initializes */}
                {!cameraReady && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
                
                <button
                  onClick={stopCamera}
                  className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Camera Controls */}
              <div className="flex space-x-4">
                <button
                  onClick={stopCamera}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={capturePhoto}
                  disabled={!cameraReady}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Camera className="w-5 h-5" />
                  <span>Capture Photo</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Preview */}
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full max-h-96 object-contain rounded-2xl"
                />
                {analyzing && (
                  <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                      <p className="text-lg font-semibold">Analyzing your skin...</p>
                      <p className="text-sm opacity-75">This will take about 10 seconds</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={resetImage}
                  disabled={analyzing}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Choose Different Photo
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Analyze Skin</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Privacy Note */}
        <p className="text-center text-sm text-gray-500">
          Your photos are processed securely and are not shared with third parties.
          <br />
          We respect your privacy and data security.
        </p>
      </div>
    </div>
  );
}