"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import ChangeEmail from "./(components)/ChangeEmail";
import Password from "./(components)/SetPassword";
import ProfileSettings from "./(components)/ProfileSettings";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "account";

  const getHeading = () => {
    switch (tab) {
      case "account":
        return "Account Information";
      case "email":
        return "Change Email";
      case "password":
        return "Set Password";
      default:
        return "Account Information";
    }
  };

  const renderTabContent = () => {
    switch (tab) {
      case "account":
        return <ProfileSettings />;
      case "email":
        return <ChangeEmail />;
      case "password":
        return <Password />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="px-8">
        <div className="bg-white rounded-lg">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900">{getHeading()}</h2>
          </div>
          <div className="p-6">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}
