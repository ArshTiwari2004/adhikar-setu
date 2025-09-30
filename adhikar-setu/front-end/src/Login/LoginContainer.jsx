import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import RoleSelection from "./RoleSelection";
import LanguageSelection from "./LanguageSelection";
import LocationSelection from "./LocationSelection";
import AuthenticationForm from "./AuthenticationForm";
import BackButton from "@/global/BackButton";

const LoginContainer = ({ onLogin }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    role: null,
    language: "en",
    state: null,
    district: null,
    village: null,
  });

  const totalSteps = getTotalSteps(formData.role);

  function getTotalSteps(role) {
    if (!role) return 4;
    if (["slmc", "mota"].includes(role)) return 3; // Require login, no location
    if (["ngo", "researcher", "public"].includes(role)) return 2; // No login required
    return 4; // Default (role + lang + location + auth)
  }

  const handleNext = () => {
    if (
      ["ngo", "researcher", "public"].includes(formData.role) &&
      currentStep === 2
    ) {
      onLogin(formData);
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.role !== null;
      case 2:
        return formData.language !== null;
      case 3:
        if (["slmc", "mota", "ngo", "researcher"].includes(formData.role))
          return true;
        if (["gram_sabha", "frc", "revenue_officer"].includes(formData.role)) {
          return formData.state && formData.district && formData.village;
        }
        return formData.state && formData.district;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <RoleSelection
            selectedRole={formData.role}
            onRoleSelect={(role) => updateFormData("role", role)}
            language={formData.language}
          />
        );
      case 2:
        return (
          <LanguageSelection
            selectedLanguage={formData.language}
            onLanguageSelect={(lang) => updateFormData("language", lang)}
            role={formData.role}
          />
        );
      case 3:
        // SLMC / MoTA go to auth
        if (["slmc", "mota"].includes(formData.role)) {
          return <AuthenticationForm formData={formData} onLogin={onLogin} />;
        }
        // NGO / Researcher skip login, finish immediately
        if (["ngo", "researcher", "public"].includes(formData.role)) {
          onLogin(formData); // Auto-login/finish
          return (
            <div className="text-center text-gray-700">
              <p>
                {formData.language === "hi"
                  ? "आप सार्वजनिक दृश्य में हैं • कोई लॉगिन आवश्यक नहीं"
                  : "You are in public view • No login required"}
              </p>
            </div>
          );
        }
        // Others need location
        return (
          <LocationSelection
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return <AuthenticationForm formData={formData} onLogin={onLogin} />;
      default:
        return null;
    }
  };

  const isAuthStep = () => {
    return (
      currentStep === 4 ||
      (currentStep === 3 && ["slmc", "mota"].includes(formData.role))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 ">
      <div className="max-w-4xl w-full overflow-hidden border-b border-gray-200 rounded-2xl ">
        {/* Header */}
        <div>
          <BackButton />
        </div>
        <div className="bg-green-600 p-6 text-white text-center border-r border-l border-gray-200 rounded-t-2xl">
          <h1 className="text-2xl font-bold">Adhikar Setu</h1>
          <p className="text-green-100 mt-1 text-sm">
            {formData.language === "hi"
              ? "वन अधिकार अधिनियम डिजिटल सहायता प्रणाली"
              : "Bridging forest communities with their rights through technology"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-8">{renderStep()}</div>

        {/* Navigation */}
        {!isAuthStep() && (
          <div className="px-8 pb-6">
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {formData.language === "hi" ? "पिछला" : "Back"}
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 cursor-pointer"
              >
                <span>{formData.language === "hi" ? "आगे" : "Next"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-3 text-center text-xs text-gray-600">
          <p>
            {formData.language === "hi"
              ? "भारत सरकार • जनजातीय कार्य मंत्रालय"
              : "Government of India • Ministry of Tribal Affairs"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginContainer;
