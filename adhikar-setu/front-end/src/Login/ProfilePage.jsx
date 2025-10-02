import React, { useState, useEffect } from "react";
import {
  UserRound,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import BackButton from "@/global/BackButton.jsx";

const ProfilePage = ({ user, language, onScreenChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    setEditedUser({ ...user });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Update user in Firestore
      await updateDoc(doc(db, "users", user.uid), {
        ...editedUser,
        updatedAt: new Date(),
      });

      setMessage({
        type: "success",
        text:
          language === "en"
            ? "Profile updated successfully!"
            : "प्रोफाइल सफलतापूर्वक अपडेट हो गई!",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text:
          language === "en"
            ? "Error updating profile. Please try again."
            : "प्रोफाइल अपडेट करने में त्रुटि। कृपया पुनः प्रयास करें।",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
    setMessage({ type: "", text: "" });
  };

  const getRoleDisplayName = () => {
    const roleNames = {
      gram_sabha:
        language === "hi" ? "ग्राम सभा / दावेदार" : "Gram Sabha / Claimant",
      frc: language === "hi" ? "वन अधिकार समिति" : "Forest Rights Committee",
      revenue_officer: language === "hi" ? "राजस्व अधिकारी" : "Revenue Officer",
      sdlc: language === "hi" ? "उप-मंडल समिति" : "Sub-Divisional Committee",
      dlc: language === "hi" ? "जिला स्तरीय समिति" : "District Level Committee",
      slmc:
        language === "hi"
          ? "राज्य स्तरीय निगरानी समिति"
          : "State Level Monitoring Committee",
      mota:
        language === "hi"
          ? "जनजातीय कार्य मंत्रालय"
          : "Ministry of Tribal Affairs",
      ngo: language === "hi" ? "एनजीओ / अनुसंधानकर्ता" : "NGO / Researcher",
      public: language === "hi" ? "सार्वजनिक उपयोगकर्ता" : "Public User",
    };
    return roleNames[user.role] || user.role;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return language === "en" ? "Not available" : "उपलब्ध नहीं";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString(language === "en" ? "en-IN" : "hi-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <BackButton />
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <div className=" p-6 text-gray-800 border-b border-gray-200 pb-2 ">
          <div className="flex items-center justify-between  ">
            <div className="flex items-center ">
              {/* <div className="h-20 w-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <UserRound className="h-10 w-10" />
              </div> */}
              <div className="ml-6 mb-4">
                <h1 className="text-2xl font-bold">
                  {language === "en" ? "User Profile" : "उपयोगकर्ता प्रोफाइल"}
                </h1>
                <p className="text-gray-700">
                  {language === "en"
                    ? "Manage your account information"
                    : "अपने खाते की जानकारी प्रबंधित करें"}
                </p>
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-white text-green-700 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {language === "en" ? "Edit Profile" : "प्रोफाइल संपादित करें"}
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-white text-green rounded-lg font-semibold hover:bg-green-50 disabled:opacity-50 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading
                    ? language === "en"
                      ? "Saving..."
                      : "सहेज रहे हैं..."
                    : language === "en"
                    ? "Save"
                    : "सहेजें"}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 bg-white bg-opacity-20 text-green rounded-lg font-semibold hover:bg-white hover:bg-opacity-30 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  {language === "en" ? "Cancel" : "रद्द करें"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`p-4 mx-6 mt-6 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Profile Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {language === "en"
                  ? "Personal Information"
                  : "व्यक्तिगत जानकारी"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {language === "en" ? "Full Name" : "पूरा नाम"}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editedUser.profile?.name || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {user.profile?.name || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {language === "en" ? "Email Address" : "ईमेल पता"}
                  </label>
                  <p className="text-gray-900">{user.email}</p>
                </div>

                {user.profile?.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {language === "en" ? "Phone Number" : "फोन नंबर"}
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editedUser.profile?.phone || ""}
                        onChange={(e) =>
                          setEditedUser((prev) => ({
                            ...prev,
                            profile: { ...prev.profile, phone: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user.profile.phone}</p>
                    )}
                  </div>
                )}

                {user.profile?.organization && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {language === "en" ? "Organization" : "संगठन"}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="organization"
                        value={editedUser.profile?.organization || ""}
                        onChange={(e) =>
                          setEditedUser((prev) => ({
                            ...prev,
                            profile: {
                              ...prev.profile,
                              organization: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {user.profile.organization}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {language === "en" ? "Account Information" : "खाता जानकारी"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    {language === "en" ? "Role" : "भूमिका"}
                  </label>
                  <p className="text-gray-900 capitalize">
                    {getRoleDisplayName()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {language === "en" ? "Location" : "स्थान"}
                  </label>
                  <p className="text-gray-900">
                    {user.village && `${user.village}, `}
                    {user.district && `${user.district}, `}
                    {user.state || ""}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {language === "en" ? "Member Since" : "सदस्यता तिथि"}
                  </label>
                  <p className="text-gray-900">{formatDate(user.createdAt)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {language === "en" ? "Account Status" : "खाता स्थिति"}
                  </label>
                  <div className="flex items-center">
                    <span
                      className={`h-2 w-2 rounded-full mr-2 ${
                        user.isApproved ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    ></span>
                    <span className="text-gray-900">
                      {user.isApproved
                        ? language === "en"
                          ? "Approved"
                          : "अनुमोदित"
                        : language === "en"
                        ? "Pending Approval"
                        : "अनुमोदन लंबित"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {language === "en" ? "Language Preference" : "भाषा वरीयता"}
                  </label>
                  {isEditing ? (
                    <select
                      name="language"
                      value={editedUser.language || "en"}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="en">English</option>
                      <option value="hi">हिंदी</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">
                      {user.language === "en" ? "English" : "हिंदी"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => onScreenChange("settings")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {language === "en" ? "Go to Settings" : "सेटिंग्स पर जाएं"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
