'use client';

import React, { useState, useEffect } from 'react';
import { ClientDataType, ContactType } from '../cards/GPTDataBlock';
import { FaUser, FaEnvelope, FaMobile, FaBriefcase, FaGlobe, FaFacebook, FaIndustry, FaPlus, FaTrash, FaChevronLeft, FaChevronRight, FaThumbsUp, FaComment, FaShare } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface ClientInformationProps {
  data: ClientDataType;
  setData: React.Dispatch<React.SetStateAction<ClientDataType>>;
}

const ClientInformation: React.FC<ClientInformationProps> = ({ data, setData }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [liked, setLiked] = useState(false);
  
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
    
    // Initialize industryType if it doesn't exist
    if (!data.industryType) {
      setData(prevData => ({
        ...prevData,
        industryType: prevData.businessType || ''
      }));
    }
    
    // Initialize companyWebsite if it doesn't exist
    // Note: We're checking for businessType instead of companyUrl since companyUrl is no longer in the interface
    if (!data.companyWebsite && data.businessType) {
      setData(prevData => ({
        ...prevData,
        companyWebsite: ''  // Initialize with empty string instead of accessing non-existent property
      }));
    }
  }, [data, setData]);
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setData(prevData => ({
      ...prevData,
      showBack: !prevData.showBack
    }));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleContactChange = (index: number, field: keyof ContactType, value: string) => {
    setData(prevData => {
      const updatedContacts = [...(prevData.contacts || [])];
      if (!updatedContacts[index]) {
        updatedContacts[index] = { name: '', email: '', mobile: '', title: '' };
      }
      updatedContacts[index] = { ...updatedContacts[index], [field]: value };
      
      // Also update legacy fields if this is the first contact (for backward compatibility)
      const legacyUpdates = index === 0 ? {
        contactName: field === 'name' ? value : prevData.contactName,
        contactEmail: field === 'email' ? value : prevData.contactEmail,
        contactPhone: field === 'mobile' ? value : prevData.contactPhone,
        contactTitle: field === 'title' ? value : prevData.contactTitle
      } : {};
      
      return {
        ...prevData,
        contacts: updatedContacts,
        ...legacyUpdates
      };
    });
  };
  
  const addContact = () => {
    if ((data.contacts || []).length < 5) {
      setData(prevData => ({
        ...prevData,
        contacts: [...(prevData.contacts || []), { name: '', email: '', mobile: '', title: '' }]
      }));
    }
  };
  
  const removeContact = (index: number) => {
    setData(prevData => {
      const updatedContacts = [...(prevData.contacts || [])];
      updatedContacts.splice(index, 1);
      
      // If removing the first contact, update legacy fields to empty or next contact
      const legacyUpdates = index === 0 ? {
        contactName: updatedContacts[0]?.name || '',
        contactEmail: updatedContacts[0]?.email || '',
        contactPhone: updatedContacts[0]?.mobile || '',
        contactTitle: updatedContacts[0]?.title || ''
      } : {};
      
      return {
        ...prevData,
        contacts: updatedContacts,
        ...legacyUpdates
      };
    });
  };
  
  return (
    <div className="profile-header relative">
      {/* LinkedIn-style banner */}
      <div className="profile-banner"></div>
      
      <div className="relative px-6 py-4">
        {/* Card flip button */}
        <button 
          type="button"
          className="toggle-view-button absolute top-4 right-4 z-10"
          onClick={handleFlip}
          aria-label="Toggle card view"
        >
          {isFlipped ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
        
        <div className="card-container">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={isFlipped ? 'back' : 'front'}
              initial={{ opacity: 0, rotateY: isFlipped ? -90 : 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: isFlipped ? 90 : -90 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              {!isFlipped ? (
                // Front of card - Display view
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">{data.companyName || 'Company Name'}</h2>
                  
                  {data.industryType && (
                    <div className="flex items-center text-gray-600">
                      <FaIndustry className="mr-2" />
                      <span>{data.industryType}</span>
                    </div>
                  )}
                  
                  {data.companyWebsite && (
                    <div className="flex items-center text-gray-600">
                      <FaGlobe className="mr-2" />
                      <a href={data.companyWebsite.startsWith('http') ? data.companyWebsite : `https://${data.companyWebsite}`} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-blue-600 hover:underline">
                        {data.companyWebsite}
                      </a>
                    </div>
                  )}
                  
                  {data.companyFacebookURL && (
                    <div className="flex items-center text-gray-600">
                      <FaFacebook className="mr-2" />
                      <a href={data.companyFacebookURL.startsWith('http') ? data.companyFacebookURL : `https://${data.companyFacebookURL}`} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-blue-600 hover:underline">
                        {data.companyFacebookURL}
                      </a>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Contacts</h3>
                    
                    {(data.contacts || []).length > 0 ? (
                      <div className="space-y-4">
                        {(data.contacts || []).map((contact, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-50 p-3 rounded-lg"
                          >
                            {contact.name && (
                              <div className="flex items-center text-gray-600">
                                <FaUser className="mr-2" />
                                <span>{contact.name}</span>
                              </div>
                            )}
                            
                            {contact.title && (
                              <div className="flex items-center text-gray-600">
                                <FaBriefcase className="mr-2" />
                                <span>{contact.title}</span>
                              </div>
                            )}
                            
                            {contact.email && (
                              <div className="flex items-center text-gray-600">
                                <FaEnvelope className="mr-2" />
                                <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                                  {contact.email}
                                </a>
                              </div>
                            )}
                            
                            {contact.mobile && (
                              <div className="flex items-center text-gray-600">
                                <FaMobile className="mr-2" />
                                <a href={`tel:${contact.mobile}`} className="text-blue-600 hover:underline">
                                  {contact.mobile}
                                </a>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No contacts added</p>
                    )}
                  </div>
                  
                  {data.businessDescription && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Business Overview</h3>
                      <p className="text-gray-700">{data.businessDescription}</p>
                    </div>
                  )}
                  
                  {/* Social interaction buttons */}
                  <div className="flex space-x-2 mt-6 pt-4 border-t border-gray-200">
                    <button 
                      type="button"
                      className={`social-button ${liked ? 'bg-blue-100 text-blue-700' : ''}`}
                      onClick={() => setLiked(!liked)}
                    >
                      <FaThumbsUp className="mr-1" />
                      <span>{liked ? 'Liked' : 'Like'}</span>
                    </button>
                    
                    <button type="button" className="social-button">
                      <FaComment className="mr-1" />
                      <span>Comment</span>
                    </button>
                    
                    <button type="button" className="social-button">
                      <FaShare className="mr-1" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              ) : (
                // Back of card - Edit view
                <div className="space-y-4">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={data.companyName || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter company name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="industryType" className="block text-sm font-medium text-gray-700 mb-1">
                      Industry Type
                    </label>
                    <input
                      type="text"
                      id="industryType"
                      name="industryType"
                      value={data.industryType || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter industry type"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Website
                    </label>
                    <input
                      type="text"
                      id="companyWebsite"
                      name="companyWebsite"
                      value={data.companyWebsite || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter company website"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="companyFacebookURL" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Facebook URL
                    </label>
                    <input
                      type="text"
                      id="companyFacebookURL"
                      name="companyFacebookURL"
                      value={data.companyFacebookURL || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter company Facebook URL"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Contacts ({(data.contacts || []).length}/5)
                      </label>
                      {(data.contacts || []).length < 5 && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={addContact}
                          className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center"
                        >
                          <FaPlus className="mr-1" /> Add Contact
                        </motion.button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <AnimatePresence>
                        {(data.contacts || []).map((contact, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-50 p-4 rounded-lg relative"
                          >
                            <button
                              type="button"
                              onClick={() => removeContact(index)}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                              aria-label="Remove contact"
                            >
                              <FaTrash />
                            </button>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label htmlFor={`contact-name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                  Name
                                </label>
                                <input
                                  type="text"
                                  id={`contact-name-${index}`}
                                  value={contact.name || ''}
                                  onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                                  className="input-field"
                                  placeholder="Enter name"
                                />
                              </div>
                              
                              <div>
                                <label htmlFor={`contact-title-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  id={`contact-title-${index}`}
                                  value={contact.title || ''}
                                  onChange={(e) => handleContactChange(index, 'title', e.target.value)}
                                  className="input-field"
                                  placeholder="Enter title"
                                />
                              </div>
                              
                              <div>
                                <label htmlFor={`contact-email-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                  Email
                                </label>
                                <input
                                  type="email"
                                  id={`contact-email-${index}`}
                                  value={contact.email || ''}
                                  onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                                  className="input-field"
                                  placeholder="Enter email"
                                />
                              </div>
                              
                              <div>
                                <label htmlFor={`contact-mobile-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                  Mobile
                                </label>
                                <input
                                  type="tel"
                                  id={`contact-mobile-${index}`}
                                  value={contact.mobile || ''}
                                  onChange={(e) => handleContactChange(index, 'mobile', e.target.value)}
                                  className="input-field"
                                  placeholder="Enter mobile number"
                                />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Overview
                    </label>
                    <textarea
                      id="businessDescription"
                      name="businessDescription"
                      value={data.businessDescription || ''}
                      onChange={handleInputChange}
                      rows={4}
                      className="input-field"
                      placeholder="Enter business overview"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ClientInformation;
