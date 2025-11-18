'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Sparkles, ArrowLeft, X, AlertCircle, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Error types for better error handling
type ErrorType = 'face-not-detected' | 'poor-quality' | 'api-error' | 'general' | null;

interface ErrorInfo {
  type: ErrorType;
  message: string;
  tips: string[];
}

export default function AnalyzePage() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Parse API error and return appropriate error info
  const parseError = (errorMessage: string, statusCode?: number): ErrorInfo => {
    const lowerMessage = errorMessage.toLowerCase();
    
    // Face not detected
    if (lowerMessage.includes('face') && (lowerMessage.includes('not') || lowerMessage.includes('no'))) {
      return {
        type: 'face-not-detected',
        message: "We couldn't detect a clear face in your photo",
        tips: [
          'Face the camera directly',
          'Use good lighting (face a window if possible)',
          'Remove sunglasses, masks, or hats',
          'Make sure your full face is visible',
          'Try a different photo'
        ]
      };
    }
    
    // Poor quality
    if (lowerMessage.includes('quality') || lowerMessage.includes('resolution') || lowerMessage.includes('blur')) {
      return {
        type: 'poor-quality',
        message: "Photo quality is too low for accurate analysis",
        tips: [
          'Use a higher resolution image',
          'Ensure good lighting',
          'Hold your camera steady',
          'Take a new photo with your camera',
          'Avoid heavily compressed images'
        ]
      };
    }
    
    // API/Service errors
    if (statusCode === 400 || statusCode === 500 || lowerMessage.includes('api') || lowerMessage.includes('service')) {
      return {
        type: 'api-error',
        message: "Analysis temporarily unavailable",
        tips: [
          'This happens occasionally with the face detection service',
          'Please try again in a moment',
          'If the problem persists, try a different photo',
          'Check your internet connection'
        ]
      };
    }
    
    // General error
    return {
      type: 'general',
      message: errorMessage || 'Failed to analyze image',
      tips: [
        'Please try again',
        'Make sure your photo is clear and well-lit',
        'If the problem persists, try a different photo'
      ]
    };
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size
      if (file.size > 5 * 1024 * 1024) {
        setError({
          type: 'general',
          message: 'Image size must be less than 5MB',
          tips: [
            'Compress your image before uploading',
            'Try taking a new photo with lower resolution',
            'Use an online image compressor'
          ]
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setError(null);
      };
      reader.onerror = () => {
        setError({
          type: 'general',
          message: 'Failed to read image file',
          tips: [
            'Try a different image',
            'Make sure the file is not corrupted',
            'Check your device storage'
          ]
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      setCameraReady(false);
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      setShowCamera(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play()
              .then(() => {
                setCameraReady(true);
              })
              .catch(err => {
                console.error('Error playing video:', err);
                setError({
                  type: 'general',
                  message: 'Failed to start camera preview',
                  tips: [
                    'Try again',
                    'Check camera permissions',
                    'Close other apps using the camera'
                  ]
                });
              });
          };
        }
      }, 100);
      
    } catch (err: any) {
      console.error('Camera error:', err);
      setError({
        type: 'general',
        message: 'Could not access camera',
        tips: [
          'Check camera permissions in your browser',
          'Make sure no other app is using the camera',
          'Try uploading a photo instead',
          'Restart your browser if needed'
        ]
      });
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
        setError({
          type: 'general',
          message: 'Camera not ready',
          tips: [
            'Wait a moment and try again',
            'Make sure the camera preview is showing',
            'Try closing and reopening the camera'
          ]
        });
        return;
      }
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');

        if (!imageData || imageData === 'data:,') {
          setError({
            type: 'general',
            message: 'Failed to capture photo',
            tips: [
              'Try again',
              'Make sure the camera preview is clear',
              'Try uploading a photo instead'
            ]
          });
          return;
        }
        
        setSelectedImage(imageData);
        stopCamera();
        setError(null);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    setError(null);

    try {
      console.log('📤 Sending image to API...');
      
      const response = await fetch('/api/analyze-skin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: selectedImage }),
      });

      const data = await response.json();
      console.log('📥 API response:', data);

      if (!response.ok) {
        // Parse error based on response
        const errorInfo = parseError(data.error || 'Analysis failed', response.status);
        throw errorInfo;
      }

      if (!data.analysisId) {
        throw parseError('No analysis ID received');
      }

      // Save uploaded image to localStorage
      console.log('💾 Saving image to localStorage for analysis:', data.analysisId);
      localStorage.setItem(`analysis_image_${data.analysisId}`, selectedImage);
      
      // Also save timestamp for cleanup
      const timestamp = new Date().toISOString();
      localStorage.setItem(`analysis_image_${data.analysisId}_timestamp`, timestamp);
      
      console.log('✅ Image saved successfully');

      // Redirect to results page
      router.push(`/analyze/results?id=${data.analysisId}`);
    } catch (err: any) {
      console.error('❌ Analysis error:', err);
      
      // If error is already parsed, use it
      if (err.type) {
        setError(err);
      } else {
        // Otherwise, parse it
        setError(parseError(err.message || 'Failed to analyze image'));
      }
      
      setAnalyzing(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    // If there's already an image selected, retry analysis
    if (selectedImage) {
      handleAnalyze();
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

  // Error display component
  const ErrorDisplay = ({ errorInfo }: { errorInfo: ErrorInfo }) => {
    const getErrorIcon = () => {
      switch (errorInfo.type) {
        case 'face-not-detected':
          return '😊';
        case 'poor-quality':
          return '📷';
        case 'api-error':
          return '⚠️';
        default:
          return '❌';
      }
    };

    const getErrorColor = () => {
      switch (errorInfo.type) {
        case 'api-error':
          return 'bg-orange-50 border-orange-200 text-orange-800';
        default:
          return 'bg-red-50 border-red-200 text-red-800';
      }
    };

    return (
      <div className={`${getErrorColor()} border rounded-xl p-5 mb-4`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 text-2xl">
            {getErrorIcon()}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">
              {errorInfo.message}
            </h3>
            <div className="space-y-1.5">
              <p className="font-medium text-sm">Please try:</p>
              <ul className="space-y-1">
                {errorInfo.tips.map((tip, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="mr-2">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Retry button */}
        <div className="mt-4 flex space-x-3">
          <button
            onClick={handleRetry}
            className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-current rounded-lg font-semibold hover:bg-opacity-10 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <button
            onClick={resetImage}
            className="px-4 py-2 bg-white border-2 border-current rounded-lg font-semibold hover:bg-opacity-10 transition"
          >
            Choose Different Photo
          </button>
        </div>
      </div>
    );
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

              {/* Error Display (if any) */}
              {error && <ErrorDisplay errorInfo={error} />}

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

              {/* Error Display */}
              {error && <ErrorDisplay errorInfo={error} />}

              {/* Action Buttons */}
              {!error && (
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
              )}
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