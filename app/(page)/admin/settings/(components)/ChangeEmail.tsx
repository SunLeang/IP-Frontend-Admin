"use client"
import React, { useState } from 'react';

export default function ChangeEmail() {
  const [formData, setFormData] = useState({
    newEmail: '',
    confirmEmail: ''
  });
  
  // Mock current email - in a real app this would come from a user context or API
  const currentEmail = "vuthysreyroth014@gmail.com";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate emails match
    if (formData.newEmail !== formData.confirmEmail) {
      alert("Emails don't match. Please try again.");
      return;
    }
    // Handle form submission logic here
    console.log('Email change submitted:', formData);
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Current Email:</label>
            <span className="text-gray-900">{currentEmail}</span>
          </div>
          
          <div className="flex items-center">
            <label className="w-32 text-gray-700">New Email:</label>
            <input
              type="email"
              name="newEmail"
              value={formData.newEmail}
              onChange={handleChange}
              placeholder="Enter new email"
              className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Confirm Email:</label>
            <input
              type="email"
              name="confirmEmail"
              value={formData.confirmEmail}
              onChange={handleChange}
              placeholder="Enter again"
              className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="mt-10">
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
}