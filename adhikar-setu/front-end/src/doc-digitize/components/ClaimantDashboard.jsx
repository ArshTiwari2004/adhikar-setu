import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase/firebase.js";
import NewClaim from "./NewClaim.jsx";
import ClaimDetail from "./ClaimDetail.jsx";
import ClaimStatus from "./ClaimStatus.jsx";
import { CLAIM_STATUS } from "../constants/fraFields.js";
import { useNavigate } from "react-router-dom";

const ClaimantDashboard = ({ user }) => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "fra_claims"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const claimsData = [];
      querySnapshot.forEach((doc) => {
        claimsData.push({ id: doc.id, ...doc.data() });
      });
      setClaims(claimsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredClaims = claims.filter(
    (claim) =>
      claim.fields?.claimantName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      claim.fields?.village?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.formType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStats = () => {
    return {
      total: claims.length,
      submitted: claims.filter((c) => c.status === CLAIM_STATUS.SUBMITTED)
        .length,
      verified: claims.filter((c) => c.status === CLAIM_STATUS.VERIFIED).length,
      approved: claims.filter((c) => c.status === CLAIM_STATUS.APPROVED).length,
      rejected: claims.filter((c) => c.status === CLAIM_STATUS.REJECTED).length,
    };
  };

  const handleNewClaim = () => setCurrentView("new-claim");
  const handleViewClaim = (claim) => {
    setSelectedClaim(claim);
    setCurrentView("claim-detail");
  };
  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedClaim(null);
  };
  const handleClaimCreated = (newClaim) => {
    if (newClaim) {
      setClaims((prev) => [newClaim, ...prev]);
    }
    setCurrentView("dashboard");
  };

  if (currentView === "new-claim") {
    return <NewClaim user={user} onClaimCreated={handleClaimCreated} />;
  }

  if (currentView === "claim-detail" && selectedClaim) {
    return <ClaimDetail claim={selectedClaim} onBack={handleBackToDashboard} />;
  }

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-white ">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              {/* <h1 className="text-3xl font-bold text-gray-900">
                FRA Claims Dashboard
              </h1> */}
              <p className="text-gray-800 mt-2 font-semibold text-xl">
                Welcome, {user?.profile?.name || user.email}!
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search claims, holders, villages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-80 cursor-pointer"
                />
              </div>
              <button
                onClick={handleNewClaim}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer"
              >
                Start New Claim
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Dashboard + Stats */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Total Claims */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {stats.total}
                    </h3>
                    <p className="text-gray-600">Total Claims</p>
                  </div>
                </div>
              </div>

              {/* Submitted */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {stats.submitted}
                    </h3>
                    <p className="text-gray-600">Submitted</p>
                  </div>
                </div>
              </div>

              {/* Verified */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {stats.verified}
                    </h3>
                    <p className="text-gray-600">Verified</p>
                  </div>
                </div>
              </div>

              {/* Approved */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {stats.approved}
                    </h3>
                    <p className="text-gray-600">Approved</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Claims Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    My Claims
                  </h2>
                  <span className="text-sm text-gray-500">
                    {filteredClaims.length} claims found
                  </span>
                </div>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading claims...</p>
                  </div>
                ) : filteredClaims.length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className="w-16 h-16 text-gray-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Claims Found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm
                        ? "No claims match your search criteria."
                        : "You haven't submitted any FRA claims yet."}
                    </p>
                    {!searchTerm && (
                      <button
                        onClick={handleNewClaim}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer"
                      >
                        Submit Your First Claim
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredClaims.map((claim) => (
                      <div
                        key={claim.id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {claim.formType?.replace("_", " ")} -{" "}
                              {claim.fields?.claimantName || "Unknown"}
                            </h3>
                            <p className="text-gray-600">
                              {claim.fields?.village}, {claim.fields?.district}
                            </p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {claim.createdAt
                              ? new Date(
                                  claim.createdAt.toDate
                                    ? claim.createdAt.toDate() // Firestore Timestamp
                                    : claim.createdAt // Already a Date/string/number
                                ).toLocaleDateString("en-IN")
                              : "N/A"}
                          </span>
                        </div>

                        <div className="mb-4">
                          <ClaimStatus
                            status={claim.status}
                            updatedAt={claim.updatedAt}
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => handleViewClaim(claim)}
                            className="text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer"
                          >
                            View Details →
                          </button>

                          {claim.status === CLAIM_STATUS.APPROVED && (
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                              Download Title
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Help & FAQ */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Help & FAQ
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Documented FRA rules and guidelines
              </p>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://tribal.nic.in/FRA/data/FRARulesBook.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 text-sm"
                  >
                    How to fill Form A
                  </a>
                </li>
                <li>
                  <a
                    href="https://tribal.nic.in/FRA/data/FRARulesBook.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 text-sm"
                  >
                    Required documents (Rule 13)
                  </a>
                </li>
                <li>
                  <a
                    href="https://tribal.nic.in/FRA/data/FRARulesBook.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 text-sm"
                  >
                    Understanding the process
                  </a>
                </li>
                <li>
                  <a
                    href="https://tribal.nic.in/FRA/data/FRARulesBook.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 text-sm"
                  >
                    Appeal procedure
                  </a>
                </li>
              </ul>
            </div>

            {/* Messages / Notices */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Messages / Notices
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Hearing notices and updates
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-blue-100 rounded">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      Gram Sabha meeting scheduled for verification
                    </p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Consent & Profile */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Consent & Profile
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Personal information and consent forms
              </p>
              <button
                onClick={() => navigate("/profile")}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimantDashboard;
