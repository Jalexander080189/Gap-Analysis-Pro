'use client';

import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';

interface ClientInformationProps {
  data: {
    primaryOwner: {
      name: string;
      email: string;
      phone: string;
    };
    secondaryOwner: {
      name: string;
      email: string;
      phone: string;
    };
    companyName: string;
    companyUrl: string;
    companyFacebookUrl: string;
    businessOverview: string;
    saved: boolean;
  };
  setData: React.Dispatch<React.SetStateAction<any>>;
}

// Business Overview Editor component
const BusinessOverviewEditor = ({ value, onChange }: { value: string, onChange: (html: string) => void }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return <div className="h-32 bg-gray-100 flex items-center justify-center">Loading editor...</div>;
  }

  return (
    <div className="border rounded">
      <div className="flex flex-wrap gap-1 p-2 bg-gray-100 rounded-t border-b border-gray-200">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-gray-300' : 'bg-white'}`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-gray-300' : 'bg-white'}`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 rounded ${editor.isActive('underline') ? 'bg-gray-300' : 'bg-white'}`}
        >
          Underline
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : 'bg-white'}`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : 'bg-white'}`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-300' : 'bg-white'}`}
        >
          Bullet List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded ${editor.isActive('orderedList') ? 'bg-gray-300' : 'bg-white'}`}
        >
          Ordered List
        </button>
      </div>
      <EditorContent editor={editor} className="p-4" />
    </div>
  );
};

// Main component with default export
const ClientInformation: React.FC<ClientInformationProps> = ({ data, setData }) => {
  const [showBusinessOverview, setShowBusinessOverview] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setData({
        ...data,
        [parent]: {
          ...data[parent as keyof typeof data],
          [child]: value
        }
      });
    } else {
      setData({
        ...data,
        [name]: value
      });
    }
  };

  const handleBusinessOverviewChange = (content: string) => {
    setData({
      ...data,
      businessOverview: content
    });
  };

  const handleSave = () => {
    setData({
      ...data,
      saved: true
    });
    
    // Generate unique URL based on company name
    const companySlug = data.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    window.history.pushState({}, '', `/reports/${companySlug}`);
  };

  const handleEdit = () => {
    setData({
      ...data,
      saved: false
    });
  };

  return (
    <div className="card">
      {data.saved ? (
        <div>
          <div className="profile-header mb-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mr-4">
                {data.companyName.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold">{data.companyName}</h2>
                <div className="flex space-x-2 text-sm text-gray-500">
                  {data.companyUrl && (
                    <a href={data.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                      Website
                    </a>
                  )}
                  {data.companyFacebookUrl && (
                    <a href={data.companyFacebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                      Facebook
                    </a>
                  )}
                </div>
              </div>
              <button
                onClick={handleEdit}
                className="ml-auto px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Edit
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Primary Owner</h3>
                <p>{data.primaryOwner.name}</p>
                <p className="text-sm text-gray-500">{data.primaryOwner.email}</p>
                <p className="text-sm text-gray-500">{data.primaryOwner.phone}</p>
              </div>
              
              {(data.secondaryOwner.name || data.secondaryOwner.email || data.secondaryOwner.phone) && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Secondary Owner</h3>
                  <p>{data.secondaryOwner.name}</p>
                  <p className="text-sm text-gray-500">{data.secondaryOwner.email}</p>
                  <p className="text-sm text-gray-500">{data.secondaryOwner.phone}</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <h3 className="font-medium text-gray-700">Business Overview</h3>
              <button
                onClick={() => setShowBusinessOverview(!showBusinessOverview)}
                className="ml-2 text-sm text-blue-600 hover:text-blue-800"
              >
                {showBusinessOverview ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showBusinessOverview && (
              <div className="bg-gray-50 p-4 rounded-lg" dangerouslySetInnerHTML={{ __html: data.businessOverview }} />
            )}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="section-title">Client Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="card-title">Primary Owner</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="primaryOwner.name"
                  value={data.primaryOwner.name}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="primaryOwner.email"
                  value={data.primaryOwner.email}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="primaryOwner.phone"
                  value={data.primaryOwner.phone}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>
            
            <div>
              <h3 className="card-title">Secondary Owner (Optional)</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="secondaryOwner.name"
                  value={data.secondaryOwner.name}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="secondaryOwner.email"
                  value={data.secondaryOwner.email}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="secondaryOwner.phone"
                  value={data.secondaryOwner.phone}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="card-title">Company Information</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={data.companyName}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company URL
              </label>
              <input
                type="url"
                name="companyUrl"
                value={data.companyUrl}
                onChange={handleInputChange}
                className="input-field"
                placeholder="https://example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Facebook URL
              </label>
              <input
                type="url"
                name="companyFacebookUrl"
                value={data.companyFacebookUrl}
                onChange={handleInputChange}
                className="input-field"
                placeholder="https://facebook.com/example"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="card-title">Business Overview</h3>
            
            {mounted && (
              <BusinessOverviewEditor 
                value={data.businessOverview}
                onChange={handleBusinessOverviewChange}
              />
             )}
          </div>
          
          <button
            onClick={handleSave}
            disabled={!data.companyName || !data.primaryOwner.name}
            className={`button-primary ${(!data.companyName || !data.primaryOwner.name) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Save Client Information
          </button>
        </div>
      )}
      
      <div className="mt-4 flex items-center space-x-2">
        <button className="social-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          Like
        </button>
        <button className="social-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Comment
        </button>
        <button className="social-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
      </div>
    </div>
   );
};

// Export as default
export default ClientInformation;
