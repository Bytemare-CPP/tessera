import React, { useState, useRef, useContext } from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios';
import { IoClose, IoCloudUpload, IoCheckmarkCircle } from 'react-icons/io5';
import supabaseClient from '../services/supabaseClient';

interface VibeMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MatchResult {
  matchFound: boolean;
  connection?: {
    id: number | string;
    matchedUser: {
      id: string;
      full_name?: string;
      avatar_url?: string;
    };
    similarityScore: number;
  };
}

const VibeMatcherModal: React.FC<VibeMatcherModalProps> = ({ isOpen, onClose }) => {
  const userContext = useContext(UserContext);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setSelectedFile(file);
    setError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !userContext?.user?.id) {
      setError('Please select a selfie to upload');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Get auth token following your standard pattern
      const { data } = await supabaseClient.auth.getSession();
      const token = data.session?.access_token;
      
      if (!token) {
        setError('Not authenticated');
        setIsProcessing(false);
        return;
      }

      // Create authenticated axios instance
      const authenticatedAxios = axios.create({
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Prepare form data
      const formData = new FormData();
      formData.append('selfie', selectedFile);
      formData.append('userId', userContext.user.id);

      // Add geolocation if available
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              maximumAge: 60000
            });
          });
          
          formData.append('latitude', position.coords.latitude.toString());
          formData.append('longitude', position.coords.longitude.toString());
        } catch (geoError) {
          console.log('Geolocation not available:', geoError);
        }
      }

      // For multipart/form-data requests, we need to add the Content-Type header
      const response = await authenticatedAxios.post(
        'http://localhost:4000/api/selfies/upload', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setMatchResult(response.data);
    } catch (err) {
      console.error('Error uploading selfie:', err);
      setError('Failed to process your selfie. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setMatchResult(null);
    setError(null);
    setIsProcessing(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#8EB486] text-white px-4 py-3 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Vibe Matcher</h2>
          <button onClick={handleClose} className="text-white" aria-label="Close">
            <IoClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {matchResult ? (
            // Result screen
            <div className="text-center">
              {matchResult.matchFound ? (
                // Match found
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-pulse">
                  <IoCheckmarkCircle size={50} className="text-green-500 mx-auto mb-2" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">Match Found! 🎉</h3>
                  <div className="flex items-center justify-center mb-3">
                    <img 
                      src={matchResult.connection?.matchedUser.avatar_url || '/default-avatar.png'} 
                      alt="Match" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#8EB486]"
                    />
                    <div className="ml-3 text-left">
                      <p className="font-semibold">
                        {matchResult.connection?.matchedUser.full_name || 'Someone Special'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Match Score: {Math.round((matchResult.connection?.similarityScore || 0) * 100)}%
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    You're now connected! Check your connections list.
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 bg-[#8EB486] text-white rounded-lg"
                  >
                    Great!
                  </button>
                </div>
              ) : (
                // No match found
                <div>
                  <h3 className="text-xl font-semibold mb-2">No Matches Found</h3>
                  <p className="text-gray-600 mb-4">
                    Your selfie has been saved! If someone matches with you in the next 5 minutes, 
                    you'll be connected automatically.
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 bg-[#8EB486] text-white rounded-lg"
                  >
                    Got It
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Upload screen
            <div>
              <p className="mb-4 text-center">
                Take a selfie with someone and upload it to create a connection!
              </p>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              
              {previewUrl ? (
                // Preview of selected image
                <div className="mb-4">
                  <div className="relative w-full h-60 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-between mt-3">
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
                      disabled={isProcessing}
                    >
                      Choose Different Photo
                    </button>
                    <button
                      onClick={handleUpload}
                      className="px-4 py-2 bg-[#8EB486] text-white rounded-lg"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Upload Selfie'}
                    </button>
                  </div>
                </div>
              ) : (
                // File upload interface
                <div className="mb-4">
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#8EB486] transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <IoCloudUpload size={48} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">
                      Click to select a photo from your gallery
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      aria-label="Select a photo from gallery"
                      className="hidden"
                    />
                  </div>
                </div>
              )}
              
              {isProcessing && (
                <div className="flex items-center justify-center mt-4">
                  <div className="animate-spin w-6 h-6 border-2 border-[#8EB486] border-t-transparent rounded-full mr-2"></div>
                  <p>Processing your selfie...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VibeMatcherModal;