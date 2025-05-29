"use client"
import React, { useState } from 'react';
import { Camera } from 'lucide-react';

export default function ProfileSettings() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    website: '',
    company: '',
    phoneNumber: '',
    address: '',
    city: '',
    country: '',
    pincode: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="p-4">
      {/* Profile Photo Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Profile Photo</h3>
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full border border-gray-300">
              <Camera size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Information Section */}
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center">
              <label className="w-32 text-gray-700">First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <label className="w-32 text-gray-700">Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <label className="w-32 text-gray-700">Website:</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Enter website"
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <label className="w-32 text-gray-700">Company:</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name"
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Details Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Contact Details</h3>
          <p className="text-sm text-gray-600 mb-4">These details are private and only used to contact you for ticketing or prizes.</p>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center">
              <label className="w-32 text-gray-700">Phone Number:</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <label className="w-32 text-gray-700">Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <label className="w-32 text-gray-700">City/Town:</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <label className="w-32 text-gray-700">Country:</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter country"
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <label className="w-32 text-gray-700">Pincode:</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter pincode"
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="bg-[#0A1628] text-white px-6 py-2 rounded font-medium hover:bg-blue-900 transition-colors"
          >
            Save My Profile
          </button>
        </div>
      </form>
    </div>
  );
};