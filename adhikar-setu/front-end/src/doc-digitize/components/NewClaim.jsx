import { useState, useCallback } from "react";
import DocumentUploader from "./DocumentUploader";
import DocumentViewer from "./DocumentViewer";
import FieldExtractor from "./FieldExtractor";
import LocationDetail from "./LocationDetail";
import { db } from "../../firebase/firebase.js";
import { collection, addDoc } from "firebase/firestore";
import BackButton from "@/global/BackButton";

const NewClaim = ({ user, onClaimCreated }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [currentDocumentPage, setCurrentDocumentPage] = useState(0);
  const [ocrResults, setOcrResults] = useState([]);
  const [extractedFields, setExtractedFields] = useState({});
  const [formType, setFormType] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [locationData, setLocationData] = useState({
    coordinates: { lat: "", lng: "" },
    landArea: "",
  });

  const steps = [
    {
      title: "Upload Documents",
      description: "Upload your FRA form documents",
    },
    {
      title: "Review & Edit",
      description: "Review extracted information and make corrections",
    },
    {
      title: "Location Details",
      description:
        "Specify the location of your land and click on Submit below",
    },
    // { title: "Submit Claim", description: "Confirm and submit your claim" },
  ];

  const handleDocumentsProcessed = useCallback((results) => {
    setOcrResults(results);
    setCurrentStep(1);
  }, []);

  const handleFieldsExtracted = useCallback((fields, detectedFormType) => {
    setExtractedFields(fields);
    setFormType(detectedFormType);
  }, []);

  // New callback to handle document upload
  const handleDocumentsUploaded = useCallback((files) => {
    console.log("Documents uploaded:", files);
    setUploadedDocuments(Array.from(files));
  }, []);

  const handleFieldChange = useCallback((fieldKey, value) => {
    setExtractedFields((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  }, []);

  const handleLocationChange = useCallback((field, value) => {
    if (field === "coordinates") {
      setLocationData((prev) => ({
        ...prev,
        coordinates: value,
      }));
    } else {
      setLocationData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  }, []);

  const handleSaveFields = useCallback(async (fields) => {
    // Just move to the next step without saving to Firebase yet
    setExtractedFields(fields);
    setCurrentStep(2);
  }, []);

  const handleSubmitClaim = useCallback(async () => {
    setIsSaving(true);
    try {
      // Create the claim with all data including location
      const claimData = {
        userId: user.uid,
        userEmail: user.email,
        formType,
        fields: {
          ...extractedFields,
          landArea: locationData.landArea,
          coordinates: locationData.coordinates,
        },
        status: "SUBMITTED",
        createdAt: new Date(),
        updatedAt: new Date(),
        ocrResults,
        documents: uploadedDocuments.map((doc) => ({
          name: doc.name,
          size: doc.size,
          type: doc.type,
        })),
        location: locationData,
      };

      const docRef = await addDoc(collection(db, "fra_claims"), claimData);

      setCurrentStep(3);

      if (onClaimCreated) {
        onClaimCreated({ id: docRef.id, ...claimData });
      }
    } catch (error) {
      console.error("Error saving claim:", error);
      alert("Failed to save claim. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [
    user,
    formType,
    extractedFields,
    locationData,
    ocrResults,
    uploadedDocuments,
    onClaimCreated,
  ]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="max-w-4xl mx-auto">
            <DocumentUploader
              onDocumentsProcessed={handleDocumentsProcessed}
              onFieldsExtracted={handleFieldsExtracted}
              onDocumentsUploaded={handleDocumentsUploaded}
            />
          </div>
        );

      case 1:
        return (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
              {/* Document Panel - Left Side */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full min-h-96">
                <DocumentViewer
                  documents={uploadedDocuments}
                  currentPage={currentDocumentPage}
                  onPageChange={setCurrentDocumentPage}
                />
              </div>

              {/* Fields Panel - Right Side */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full overflow-auto">
                <FieldExtractor
                  extractedFields={extractedFields}
                  formType={formType}
                  onFieldChange={handleFieldChange}
                  onSave={handleSaveFields}
                  isSaving={isSaving}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="max-w-6xl mx-auto">
            <LocationDetail
              formData={locationData}
              handleInputChange={handleLocationChange}
              language="en"
            />
          </div>
        );

      case 3:
        return (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-green-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22,4 12,14.01 9,11.01" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Claim Submitted Successfully!
              </h2>
              <p className="text-gray-600 mb-8">
                Your FRA claim has been submitted and is now under review.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">
                      Form Type:
                    </span>
                    <span className="text-gray-600">
                      {formType?.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Status:</span>
                    <span className="text-gray-600">Submitted</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">
                      Documents:
                    </span>
                    <span className="text-gray-600">
                      {uploadedDocuments.length} files uploaded
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">
                      Land Area:
                    </span>
                    <span className="text-gray-600">
                      {locationData.landArea} hectares
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">
                      Next Steps:
                    </span>
                    <span className="text-gray-600">
                      Committee verification
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => onClaimCreated && onClaimCreated(null)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Submit Another Claim
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white ">
      {/* Header */}
      <div className="bg-white ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BackButton />
          <h1 className="text-3xl font-bold text-gray-900">New FRA Claim</h1>
          <p className="text-gray-600 mt-1">
            Submit your Forest Rights Act claim by uploading documents and
            filling required information
          </p>
          <p className="text-gray-500 mt-4 text-sm">
            For clarification and detailed rules, please refer to the official
            document published by MoTA:&nbsp;
            <a
              href="https://tribal.nic.in/FRA/data/FRARulesBook.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              FRA Rules Book
            </a>
          </p>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`flex items-center ${
                  index <= currentStep ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    index <= currentStep
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-8 ${
                    index < currentStep ? "bg-emerald-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8">{renderStepContent()}</div>

      {/* Navigation */}
      {currentStep > 0 && currentStep < 3 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back</span>
            </button>

            {currentStep === 2 && (
              <button
                onClick={handleSubmitClaim}
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSaving ? "Submitting..." : "Submit Claim"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewClaim;
