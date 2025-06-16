"use client";
import React, { useEffect, useState } from "react";
import { getProfile, updateUser, ProfileProps } from "@/app/(api)/profile_api";

export default function ChangeEmail() {
  const [profile, setProfile] = useState<ProfileProps | null>(null);
  const [formData, setFormData] = useState({
    newEmail: "",
    confirmEmail: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const user = await getProfile();
        setProfile(user);
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile.");
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (formData.newEmail !== formData.confirmEmail) {
      setError("Emails do not match. Please try again.");
      return;
    }

    if (!profile) {
      setError("User profile not loaded.");
      return;
    }

    setSubmitting(true);
    try {
      await updateUser(profile.id, {
        fullName: profile.fullName,
        age: profile.age || 0,
        org: profile.org || "",
        gender: profile.gender,
        username: profile.username,
        email: profile.email,
      });
      setSuccessMsg("Email updated successfully.");
      // Refresh profile data
      const refreshed = await getProfile();
      setProfile(refreshed);
    } catch (err) {
      console.error(err);
      setError("Failed to update email.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Current Email:</label>
            <span className="text-gray-900">{profile?.email}</span>
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

        {error && <p className="text-red-600 mt-4">{error}</p>}
        {successMsg && <p className="text-green-600 mt-4">{successMsg}</p>}

        <div className="mt-10">
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#0A1628] text-white px-6 py-2 rounded font-medium hover:bg-blue-900 transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save My Email"}
          </button>
        </div>
      </form>
    </div>
  );
}
