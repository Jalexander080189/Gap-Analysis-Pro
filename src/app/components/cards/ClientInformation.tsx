import React, { useState, useRef, useEffect } from 'react';

// Define proper TypeScript interfaces
export interface ContactType {
  name: string;
  email: string;
  mobile: string;
  title: string;
}

export interface ClientDataType {
  companyName: string;
  companyWebsite: string;
  companyFacebookURL: string;
  instagramURL: string;
  facebookAdLibraryURL: string;
  phoenixURL: string;
  companyAddress: string;
  industryType: string;
  contacts: ContactType[];
  businessDescription: string;
  showBack: boolean;
  profileImage?: string;
  coverImage?: string;
  
  // Legacy fields for backward compatibility
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactTitle?: string;
  businessType?: string;
}

interface ClientInformationProps {
  data: ClientDataType;
  setData: React.Dispatch<React.SetStateAction<ClientDataType>>;
  mode: 'leadgen' | 'retail';
  setMode: React.Dispatch<React.SetStateAction<'leadgen' | 'retail'>>;
}

const ClientInformation: React.FC<ClientInformationProps> = ({ data, setData, mode, setMode }) => {
  const [showBusinessOverview, setShowBusinessOverview] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  // Custom cropper state
  const [showCropper, setShowCropper] = useState(false);
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [isCoverImage, setIsCoverImage] = useState(false);
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [cropSize, setCropSize] = useState({ width: 200, height: 200 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  // Initialize contacts array if it doesn't exist (for backward compatibility)
  useEffect(() => {
    if (!data.contacts) {
      // Convert legacy contact data to new format if it exists
      if (data.contactName || data.contactEmail || data.contactPhone || data.contactTitle) {
        setData(prevData => ({
          ...prevData,
          contacts: [{
            name: prevData.contactName || '',
            email: prevData.contactEmail || '',
            mobile: prevData.contactPhone || '',
            title: prevData.contactTitle || ''
          }],
          // Keep legacy fields for backward compatibility
          contactName: prevData.contactName,
          contactEmail: prevData.contactEmail,
          contactPhone: prevData.contactPhone,
          contactTitle: prevData.contactTitle
        }));
      } else {
        // Initialize with empty contacts array
        setData(prevData => ({
          ...prevData,
          contacts: []
        }));
      }
    }
    
    // Initialize new fields if they don't exist
    if (!data.instagramURL) {
      setData(prevData => ({
        ...prevData,
        instagramURL: ''
      }));
    }
    
    if (!data.facebookAdLibraryURL) {
      setData(prevData => ({
        ...prevData,
        facebookAdLibraryURL: ''
      }));
    }
    
    if (!data.phoenixURL) {
      setData(prevData => ({
        ...prevData,
        phoenixURL: ''
      }));
    }
    
    if (!data.companyAddress) {
      setData(prevData => ({
        ...prevData,
        companyAddress: ''
      }));
    }
    
    // Initialize industryType if it doesn't exist
    if (!data.industryType && data.businessType) {
      setData(prevData => ({
        ...prevData,
        industryType: prevData.businessType || ''
      }));
    }
    
    // Initialize companyWebsite if it doesn't exist
    if (!data.companyWebsite) {
      setData(prevData => ({
        ...prevData,
        companyWebsite: ''
      }));
    }
  }, [data, setData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const addContact = () => {
    setData(prevData => ({
      ...prevData,
      contacts: [...prevData.contacts, { name: '', email: '', mobile: '', title: '' }]
    }));
  };

  const updateContact = (index: number, field: keyof ContactType, value: string) => {
    setData(prevData => ({
      ...prevData,
      contacts: prevData.contacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const removeContact = (index: number) => {
    setData(prevData => ({
      ...prevData,
      contacts: prevData.contacts.filter((_, i) => i !== index)
    }));
  };

  // Image handling functions
  const handleImageUpload = (file: File, isForCover: boolean = false) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCropperImage(result);
      setIsCoverImage(isForCover);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isForCover: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, isForCover);
    }
  };

  const handleDrop = (e: React.DragEvent, isForCover: boolean = false) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file, isForCover);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  // Cropper functions
  const handleImageLoad = () => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      setImageSize({ width: naturalWidth, height: naturalHeight });
      
      // Set initial crop size and position
      const cropWidth = Math.min(200, naturalWidth);
      const cropHeight = Math.min(200, naturalHeight);
      setCropSize({ width: cropWidth, height: cropHeight });
      setCropPosition({ 
        x: (naturalWidth - cropWidth) / 2, 
        y: (naturalHeight - cropHeight) / 2 
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropPosition.x, y: e.clientY - cropPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const scaleX = imageSize.width / rect.width;
      const scaleY = imageSize.height / rect.height;
      
      const newX = Math.max(0, Math.min((e.clientX - dragStart.x) * scaleX, imageSize.width - cropSize.width));
      const newY = Math.max(0, Math.min((e.clientY - dragStart.y) * scaleY, imageSize.height - cropSize.height));
      
      setCropPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const applyCrop = () => {
    if (cropperImage && imageRef.current) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = cropSize.width;
        canvas.height = cropSize.height;
        
        ctx?.drawImage(
          img,
          cropPosition.x, cropPosition.y, cropSize.width, cropSize.height,
          0, 0, cropSize.width, cropSize.height
        );
        
        const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        if (isCoverImage) {
          setData(prevData => ({ ...prevData, coverImage: croppedImageUrl }));
        } else {
          setData(prevData => ({ ...prevData, profileImage: croppedImageUrl }));
        }
        
        setShowCropper(false);
        setCropperImage(null);
      };
      
      img.src = cropperImage;
    }
  };

  const cancelCrop = () => {
    setShowCropper(false);
    setCropperImage(null);
  };

  // Social interaction handlers
  const [liked, setLiked] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<string[]>([]);
  const [shared, setShared] = useState(false);

  const handleLikeClick = () => {
    setLiked(!liked);
  };

  const handleCommentClick = () => {
    setCommentOpen(!commentOpen);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      setComments([...comments, commentText]);
      setCommentText('');
    }
  };

  const handleShareClick = () => {
    setShared(!shared);
  };

  return (
    <>
      <div className="card">
        {/* Cover Photo */}
        <div 
          className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg cursor-pointer"
          onClick={() => coverInputRef.current?.click()}
          onDrop={(e) => handleDrop(e, true)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            backgroundImage: data.coverImage ? `url(${data.coverImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {!data.coverImage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-2xl mb-2">📷</div>
                <div className="text-sm">Click to add cover photo</div>
              </div>
            </div>
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e, true)}
            className="hidden"
          />
        </div>

        {/* Profile Section */}
        <div className="relative px-6 pb-4">
          {/* Profile Picture */}
          <div className="flex justify-between items-start -mt-16 mb-4">
            <div 
              className="relative w-24 h-24 bg-gray-300 rounded-full border-4 border-white cursor-pointer overflow-hidden"
              onClick={() => profileInputRef.current?.click()}
              onDrop={(e) => handleDrop(e, false)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {data.profileImage ? (
                <img 
                  src={data.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-2xl">👤</div>
                  </div>
                </div>
              )}
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, false)}
                className="hidden"
              />
            </div>
            
            {/* Mode Toggle and Edit Button */}
            <div className="flex items-center space-x-3">
              {/* Mode Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Mode:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setMode('leadgen')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      mode === 'leadgen' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Lead Gen
                  </button>
                  <button
                    onClick={() => setMode('retail')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      mode === 'retail' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Retail
                  </button>
                </div>
              </div>
              
              {/* Edit Button */}
              <button 
                onClick={() => setData({ ...data, showBack: !data.showBack })}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
            </div>
          </div>

          {/* Company Info */}
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              {data.companyName || 'Company Name'} 
              <span className="text-blue-500 ml-2">●</span>
            </h1>
            <p className="text-gray-600 text-sm mb-1">{data.industryType || 'Industry Type'}</p>
            <p className="text-gray-500 text-sm flex items-center">
              <span className="mr-1">📍</span>
              {data.companyAddress || 'United States'}
            </p>
            <p className="text-blue-600 text-sm">
              {data.contacts?.length || 0} contacts
            </p>
          </div>

          {/* Business Overview Toggle */}
          <div className="mb-4">
            <button
              onClick={() => setShowBusinessOverview(!showBusinessOverview)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-medium text-gray-900">Business Overview</h3>
              <span className="text-blue-600 text-sm">
                {showBusinessOverview ? 'Hide' : 'Show'}
              </span>
            </button>
            
            {showBusinessOverview && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <textarea
                  name="businessDescription"
                  value={data.businessDescription}
                  onChange={handleTextareaChange}
                  placeholder="Enter a brief description of the business, its services, target market, and key value propositions..."
                  className="w-full p-3 border border-gray-300 rounded-md resize-none"
                  rows={4}
                />
              </div>
            )}
          </div>

          {/* Social Interaction Buttons */}
          <div className="flex items-center space-x-4 pt-3 border-t border-gray-200">
            <button 
              className={`social-button ${liked ? 'bg-blue-100' : ''}`}
              onClick={handleLikeClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              {liked ? 'Liked' : 'Like'}
            </button>
            
            <button 
              className={`social-button ${commentOpen ? 'bg-blue-100' : ''}`}
              onClick={handleCommentClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Comment
            </button>
            
            <button 
              className={`social-button ${shared ? 'bg-blue-100' : ''}`}
              onClick={handleShareClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {shared ? 'Shared' : 'Share'}
            </button>
          </div>

          {/* Comment form */}
          {commentOpen && (
            <div className="mt-3 p-3 border border-gray-200 rounded-lg">
              <textarea 
                value={commentText}
                onChange={handleCommentChange}
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="Write a comment..."
                rows={2}
              />
              <button 
                onClick={handleCommentSubmit}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          )}

          {/* Comments list */}
          {comments.length > 0 && (
            <div className="mt-3 p-3 border border-gray-200 rounded-lg">
              <h4 className="font-medium mb-2">Comments:</h4>
              {comments.map((comment, index) => (
                <div key={index} className="mb-1 p-2 bg-gray-50 rounded">
                  {comment}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {data.showBack && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Edit Client Information</h2>
              <button
                onClick={() => setData({ ...data, showBack: false })}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>

            {/* Images Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Images</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => profileInputRef.current?.click()}
                    onDrop={(e) => handleDrop(e, false)}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    {data.profileImage ? (
                      <img src={data.profileImage} alt="Profile" className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
                    ) : (
                      <div className="text-4xl mb-2">➕</div>
                    )}
                    <p className="text-sm text-gray-600">Click or drag to upload</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Photo</label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => coverInputRef.current?.click()}
                    onDrop={(e) => handleDrop(e, true)}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    {data.coverImage ? (
                      <img src={data.coverImage} alt="Cover" className="w-full h-16 rounded mx-auto mb-2 object-cover" />
                    ) : (
                      <div className="text-4xl mb-2">➕</div>
                    )}
                    <p className="text-sm text-gray-600">Click or drag to upload</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Company Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={data.companyName}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry Type</label>
                  <input
                    type="text"
                    name="industryType"
                    value={data.industryType}
                    onChange={handleInputChange}
                    placeholder="e.g. Technology, Healthcare"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
                  <input
                    type="url"
                    name="companyWebsite"
                    value={data.companyWebsite}
                    onChange={handleInputChange}
                    placeholder="https://company.com"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                  <input
                    type="url"
                    name="companyFacebookURL"
                    value={data.companyFacebookURL}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/company"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                  <input
                    type="url"
                    name="instagramURL"
                    value={data.instagramURL || ''}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/company"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Ad Library URL</label>
                  <input
                    type="url"
                    name="facebookAdLibraryURL"
                    value={data.facebookAdLibraryURL || ''}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/ads/library"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phoenix URL</label>
                  <input
                    type="url"
                    name="phoenixURL"
                    value={data.phoenixURL || ''}
                    onChange={handleInputChange}
                    placeholder="https://phoenix.com/company"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
                  <input
                    type="text"
                    name="companyAddress"
                    value={data.companyAddress || ''}
                    onChange={handleInputChange}
                    placeholder="123 Main St, City, State, ZIP"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Contacts Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Contacts</h3>
                <button
                  onClick={addContact}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  + Add Contact
                </button>
              </div>
              
              {data.contacts && data.contacts.length > 0 ? (
                <div className="space-y-4">
                  {data.contacts.map((contact, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={contact.name}
                          onChange={(e) => updateContact(index, 'name', e.target.value)}
                          className="p-2 border border-gray-300 rounded"
                        />
                        <input
                          type="text"
                          placeholder="Job Title"
                          value={contact.title}
                          onChange={(e) => updateContact(index, 'title', e.target.value)}
                          className="p-2 border border-gray-300 rounded"
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={contact.email}
                          onChange={(e) => updateContact(index, 'email', e.target.value)}
                          className="p-2 border border-gray-300 rounded"
                        />
                        <input
                          type="tel"
                          placeholder="Mobile"
                          value={contact.mobile}
                          onChange={(e) => updateContact(index, 'mobile', e.target.value)}
                          className="p-2 border border-gray-300 rounded"
                        />
                      </div>
                      <button
                        onClick={() => removeContact(index)}
                        className="text-red-600 text-sm hover:text-red-800"
                      >
                        Remove Contact
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No contacts added yet</p>
                  <button
                    onClick={addContact}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    + Add First Contact
                  </button>
                </div>
              )}
            </div>

            {/* Business Overview */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Business Overview</h3>
              <textarea
                name="businessDescription"
                value={data.businessDescription}
                onChange={handleTextareaChange}
                placeholder="Enter a brief description of the business, its services, target market, and key value propositions..."
                className="w-full p-3 border border-gray-300 rounded-md resize-none"
                rows={6}
              />
            </div>

            {/* Save Changes Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setData({ ...data, showBack: false })}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      {showCropper && cropperImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-medium mb-4">Crop Image</h3>
            
            <div className="relative inline-block">
              <img
                ref={imageRef}
                src={cropperImage}
                alt="Crop preview"
                className="max-w-full max-h-96"
                onLoad={handleImageLoad}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
              
              {/* Crop overlay */}
              <div
                className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20 cursor-move"
                style={{
                  left: `${(cropPosition.x / imageSize.width) * 100}%`,
                  top: `${(cropPosition.y / imageSize.height) * 100}%`,
                  width: `${(cropSize.width / imageSize.width) * 100}%`,
                  height: `${(cropSize.height / imageSize.height) * 100}%`,
                }}
                onMouseDown={handleMouseDown}
              />
            </div>
            
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={cancelCrop}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={applyCrop}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientInformation;

