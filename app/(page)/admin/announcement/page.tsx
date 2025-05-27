'use client';
import React, { useState } from 'react';
import { Grid3x3, Calendar, Heart, Settings, LogOut, Plus, Edit, Trash2, MessageSquare, Gauge, Power, Users } from 'lucide-react';

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      date: "NOV 22",
      title: "This is our newly design map direction of the events",
      description: "We would like to inform all of our attendee that we have a made a map direction to guide everyone and have a wonderful time on the event",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=200&fit=crop"
    }
  ]);

  const [currentView, setCurrentView] = useState('list'); // 'list' or 'create'
  const [newAnnouncement, setNewAnnouncement] = useState({
    date: '',
    title: '',
    description: '',
    image: '',
    event: ''
  });

  const handleCreateAnnouncement = () => {
    if (newAnnouncement.title && newAnnouncement.description) {
      const announcement = {
        id: Date.now(),
        ...newAnnouncement,
        date: newAnnouncement.date || new Date().toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }).toUpperCase()
      };
      setAnnouncements([...announcements, announcement]);
      setNewAnnouncement({ date: '', title: '', description: '', image: '', event: '' });
      setCurrentView('list');
    }
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter(ann => ann.id !== id));
  };

  const handleNavigateToCreate = () => {
    setCurrentView('create');
  };

  const handleNavigateBack = () => {
    setCurrentView('list');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-2">
          {/* Logo or brand space */}
        </div>
        
        <nav className="px-3">
          <div className="space-y-1">
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors group">
              <div className="w-5 h-5 mr-3 flex items-center justify-center">
                <Gauge className="w-4 h-4" />
              </div>
              <span>Dashboard</span>
            </a>
            
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors group">
              <div className="w-5 h-5 mr-3 flex items-center justify-center">
                <Grid3x3 className="w-4 h-4" />
              </div>
              <span>Events</span>
            </a>
            
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors group">
              <div className="w-5 h-5 mr-3 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              <span>Volunteer</span>
            </a>
            
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md">
              <div className="w-5 h-5 mr-3 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span>Announcement</span>
            </a>
          </div>
          
          <div className="mt-8 space-y-1">
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors group">
              <div className="w-5 h-5 mr-3 flex items-center justify-center">
                <Settings className="w-4 h-4" />
              </div>
              <span>Settings</span>
              <div className="ml-auto">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
            
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors group">
              <div className="w-5 h-5 mr-3 flex items-center justify-center">
                <Power className="w-4 h-4" />
              </div>
              <span>Log out</span>
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-white">
        {currentView === 'list' ? (
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Announcement</h1>
              <button 
              onClick={handleNavigateToCreate}
              className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors flex items-center gap-3 text-sm font-medium"
              >
              Create Announcement
              </button>

            </div>

            {/* Announcements List */}
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md max-w-sm">
                  <div className="p-3 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Announcement:</span>
                        <span className="text-sm font-semibold text-blue-600">{announcement.date}</span>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {announcement.image && (
                    <div className="w-full">
                      <img 
                        src={announcement.image} 
                        alt="Announcement" 
                        className="w-full h-40 object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-4">
                    <h3 className="text-base font-medium text-gray-900 mb-2 leading-tight">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {announcement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {announcements.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements yet</h3>
                <p className="text-gray-600 mb-4">Create your first announcement to get started.</p>
                <button 
                  onClick={handleNavigateToCreate}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Announcement
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Create Announcement Page */
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 p-6 border-b border-gray-200">
              <button 
                onClick={handleNavigateBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Publish Announcement</h1>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-2xl space-y-6">
                {/* Event Selection */}
                <div>
                  <select 
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                    value={newAnnouncement.event}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, event: e.target.value})}
                  >
                    <option value="">Select an Event</option>
                    <option value="new-year">New Year Celebration</option>
                    <option value="community">Community Gathering</option>
                    <option value="volunteer">Volunteer Drive</option>
                  </select>
                </div>

                {/* Title */}
                <div>
                  <input
                    type="text"
                    placeholder="Title"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  />
                </div>

                {/* File Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-gray-900 font-medium mb-1">Choose a file or drag & drop it here</p>
                    <p className="text-gray-500 text-sm mb-4">JPEG, PNG, PDG, and MP4 formats, up to 50MB</p>
                    <button 
                      type="button"
                      className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        // For demo purposes, set a sample image
                        setNewAnnouncement({...newAnnouncement, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=180&fit=crop"});
                      }}
                    >
                      Browse File
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Why Volunteer?</h3>
                  <textarea
                    placeholder="Describe what's special about your event & other important details."
                    rows="8"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    value={newAnnouncement.description}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, description: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleNavigateBack}
                className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAnnouncement}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Publish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementPage;