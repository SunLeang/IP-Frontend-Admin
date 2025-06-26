"use client";

import React, { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { useAuth } from "@/app/hooks/AuthContext";
import { getUserById, ProfileProps, updateUser } from "@/app/(api)/profile_api";

export default function ProfileSettings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileProps | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    age: "",
    gender: "",
    org: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        const profileData = await getUserById(user.id);
        setProfile(profileData);
        setFormData({
          fullName: profileData.fullName || "",
          username: profileData.username || "",
          age: profileData.age?.toString() || "",
          gender: profileData.gender || "",
          org: profileData.org || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await updateUser(user.id, {
        ...formData,
        age: Number(formData.age),
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      {/* Profile Photo Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Profile Photo</h3>
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full border border-gray-300">
              <Camera size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 mb-8">
          {["fullName", "username", "age", "gender", "org"].map((field) => (
            <div className="flex items-center" key={field}>
              <label className="w-32 text-gray-700 capitalize">{field}:</label>
              <input
                type={field === "age" ? "number" : "text"}
                name={field}
                value={(formData as any)[field]}
                onChange={handleChange}
                className="flex-1 p-2 border border-gray-300 rounded"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-[#0A1628] text-white px-6 py-2 rounded font-medium hover:bg-blue-900"
        >
          Save My Profile
        </button>
      </form>
    </div>
  );
}
