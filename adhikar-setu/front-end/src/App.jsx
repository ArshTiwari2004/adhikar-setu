import React, { useState, lazy, Suspense, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import HomePage from "./pages/LandingPage";
import Navigation from "./components/Navigation";
import LoginContainer from "./Login/LoginContainer";
import {
  onAuthStateChange,
  getCurrentUserProfile,
} from "./firebase/authService";
import DSS from "./dss/components/DSS";
import SchemeDetail from "./dss/components/SchemeDetail";
import DSSResults from "./dss/components/DSS_Result";
import ProfilePage from "./Login/ProfilePage";
import SettingsPage from "./Login/SettingsPage";
import ClaimantDashboard from "./doc-digitize/components/ClaimantDashboard";
import Map from "./components/Map";
import NotFoundPage from "./global/NotFoundPage";
import AssetMapping from "./assetsmapping/assetsmap";
import Public from "./public/Public";
import { AlertCircle } from "lucide-react";

// Lazy load route components for better performance
const Dashboard = lazy(() => import("./components/Dashboard"));
const ClaimSubmission = lazy(() => import("./components/ClaimSubmission"));
const VerificationWorkspace = lazy(() =>
  import("./components/VerificationWorkspace")
);
const DLCApproval = lazy(() => import("./components/DLCApproval"));
const DSSLayer = lazy(() => import("./components/DSSLayer"));
const PublicAtlas = lazy(() => import("./components/PublicAtlas"));

// ---------- Protected Route Component ----------
const ProtectedRoute = ({
  children,
  allowedRoles,
  user,
  language,
  onLogout,
}) => {
  const location = useLocation();
  console.log(
    "ProtectedRoute → path:",
    location.pathname,
    "allowedRoles:",
    allowedRoles,
    "user:",
    user
  );

  // If no user at all → block access
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {language === "en" ? "Login Required" : "लॉगिन आवश्यक"}
          </h2>
          <p className="text-gray-600 mb-4">
            {language === "en"
              ? "Please sign in to continue and access this page."
              : "कृपया इस पृष्ठ तक पहुँचने के लिए साइन इन करें।"}
          </p>
        </div>
      </div>
    );
  }

  // Case: Role not allowed
  if (!allowedRoles.includes(user?.role)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          {/* Icon + Sorry message */}
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-red-500 mr-2" />
            <h2 className="text-2xl font-bold text-red-600">
              {language === "en" ? "Sorry!" : "क्षमा करें!"}
            </h2>
          </div>

          <p className="text-gray-600 mb-4">
            {language === "en"
              ? "This page is currently under development. We’re still working on it and will launch it soon."
              : "यह पृष्ठ वर्तमान में विकासाधीन है। हम अभी भी इस पर काम कर रहे हैं और इसे जल्द ही लॉन्च करेंगे।"}
          </p>

          <p className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md border border-yellow-300 inline-block">
            {language === "en"
              ? "Click on Logout from the dropdown menu in the profile icon above."
              : "ऊपर प्रोफ़ाइल आइकन में ड्रॉपडाउन मेनू से लॉगआउट पर क्लिक करें"}
          </p>
        </div>
      </div>
    );
  }

  // Case: Under development ( pass a prop `isUnderDev`)
  if (children?.props?.underDevelopment) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-yellow-600 mb-4">
            {language === "en"
              ? "Feature Under Development"
              : "फ़ीचर विकासाधीन है"}
          </h2>
          <p className="text-gray-600 mb-4">
            {language === "en"
              ? "This feature is not yet available. Please check back later."
              : "यह फ़ीचर अभी उपलब्ध नहीं है। कृपया बाद में देखें।"}
          </p>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            {language === "en" ? "Logout" : "लॉगआउट"}
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// ---------- Error Boundary Component ----------
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              {this.props.language === "en"
                ? "Something went wrong"
                : "कुछ गलत हो गया"}
            </h2>
            <p className="text-gray-600 mb-4">
              {this.props.language === "en"
                ? "An error occurred while loading this page."
                : "इस पृष्ठ को लोड करते समय एक त्रुटि हुई।"}
            </p>
            <button
              onClick={() =>
                this.setState({ hasError: false, error: undefined })
              }
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {this.props.language === "en" ? "Try Again" : "पुनः प्रयास करें"}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // New state to track logout process
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user && !isLoggingOut) {
        // User is signed in and not in the process of logging out
        const userProfile = await getCurrentUserProfile(user.uid);
        if (userProfile.success) {
          setCurrentUser(userProfile.user);
        } else {
          console.error("Error getting user profile:", userProfile.error);
          setCurrentUser(null);
        }
      } else {
        // User is signed out or logging out
        setCurrentUser(null);
        // Clear localStorage when user is signed out
        localStorage.removeItem("user");
        if (isLoggingOut) {
          setIsLoggingOut(false); // Reset logout state
        }
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [isLoggingOut]);

  // all the login tweaks for specific roles and redirections will happen here
  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem("user", JSON.stringify(user));

    if (["public", "ngo", "researcher"].includes(user.role)) {
      navigate("/public");
      return;
    }

    if (user.role === "gram_sabha") {
      navigate("/claimant-dashboard"); // send gram sabha users here
    } else {
      navigate("/dashboard"); // all other roles go here
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true); // Set logout flag
    setCurrentUser(null); // Immediately clear user state
    localStorage.removeItem("user"); // Clear localStorage
    navigate("/"); // Navigate to landing page
    // The actual Firebase logout will be handled by the Navigation component
  };

  // Remove the localStorage effect since we handle it in the auth state change
  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     setCurrentUser(JSON.parse(storedUser));
  //   }
  // }, []);

  const currentScreen =
    location.pathname === "/login" ? "/dashboard" : location.pathname.slice(1);

  const handleScreenChange = (screen) => {
    navigate(`/${screen}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      {/* Show navigation only when user is logged in AND not logging out */}
      {currentUser && !isLoggingOut && (
        <Navigation
          user={currentUser}
          currentScreen={currentScreen}
          onScreenChange={handleScreenChange}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          language={language}
          setLanguage={setLanguage}
        />
      )}

      {/* Routes */}
      <main className={currentUser && !isLoggingOut ? "pt-16" : ""}>
        <ErrorBoundary language={language}>
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                    {language === "en" ? "Loading..." : "लोड हो रहा है..."}
                  </p>
                </div>
              </div>
            }
          >
            <Routes>
              {/* Landing Page Route */}
              <Route path="/" element={<HomePage />} />
              <Route path="/dss" element={<DSS />} />
              <Route path="/dss-results" element={<DSSResults />} />
              <Route path="/map" element={<Map />} />
              <Route path="/asset-mapping" element={<AssetMapping />} />
              <Route
                path="*"
                element={
                  <NotFoundPage user={currentUser} language={language} />
                }
              />

              {/* Login Route when a user tries to open /login while already logged in, redirect to dashboard */}
              {/* example : for gram sabha users, redirect to claimant dashboard */}
              <Route
                path="/login"
                element={
                  currentUser ? (
                    currentUser.role === "gram_sabha" ? (
                      <Navigate to="/claimant-dashboard" replace />
                    ) : ["public", "ngo", "researcher"].includes(
                        currentUser.role
                      ) ? (
                      <Navigate to="/public" replace />
                    ) : (
                      // for roles public, ngo, researcher redirected to /public
                      <Navigate to="/dashboard" replace />
                    )
                  ) : (
                    <LoginContainer onLogin={handleLogin} />
                  )
                }
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute
                    allowedRoles={["gram_sabha", "frc", "sdlc", "dlc", "mota"]}
                    user={currentUser}
                    language={language}
                  >
                    <Dashboard user={currentUser} language={language} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/claim-submission"
                element={
                  <ProtectedRoute
                    allowedRoles={["gram_sabha"]}
                    user={currentUser}
                    language={language}
                  >
                    <ClaimSubmission user={currentUser} language={language} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/verification"
                element={
                  <ProtectedRoute
                    allowedRoles={["frc", "sdlc"]}
                    user={currentUser}
                    language={language}
                  >
                    <VerificationWorkspace
                      user={currentUser}
                      language={language}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dlc-approval"
                element={
                  <ProtectedRoute
                    allowedRoles={["dlc"]}
                    user={currentUser}
                    language={language}
                  >
                    <DLCApproval user={currentUser} language={language} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dss"
                element={
                  <ProtectedRoute
                    allowedRoles={["sdlc", "mota", "frc"]}
                    user={currentUser}
                    language={language}
                  >
                    <DSSLayer user={currentUser} language={language} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dss-results"
                element={
                  <ProtectedRoute
                    allowedRoles={["dlc"]}
                    user={currentUser}
                    language={language}
                  >
                    <DSSResults user={currentUser} language={language} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/scheme/:schemeId"
                element={<SchemeDetail language={language} />}
              />

              <Route
                path="/public-atlas"
                element={
                  <ProtectedRoute
                    allowedRoles={["gram_sabha", "frc", "sdlc", "dlc", "mota"]}
                    user={currentUser}
                    language={language}
                  >
                    <PublicAtlas language={language} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute
                    allowedRoles={["gram_sabha", "frc", "sdlc", "dlc", "mota"]}
                    user={currentUser}
                    language={language}
                  >
                    <ProfilePage
                      user={currentUser}
                      language={language}
                      onScreenChange={handleScreenChange}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute
                    allowedRoles={["gram_sabha", "frc", "sdlc", "dlc", "mota"]}
                    user={currentUser}
                    language={language}
                  >
                    <SettingsPage
                      user={currentUser}
                      language={language}
                      onScreenChange={handleScreenChange}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/claimant-dashboard"
                element={
                  <ProtectedRoute
                    allowedRoles={["gram_sabha"]}
                    user={currentUser}
                    language={language}
                  >
                    <ClaimantDashboard user={currentUser} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/public"
                element={
                  <ProtectedRoute
                    allowedRoles={["public", "ngo", "researcher"]}
                    user={currentUser}
                    language={language}
                  >
                    <Public user={currentUser} language={language} />
                  </ProtectedRoute>
                }
              />

              {/* routes to test, this will be removed later from here and put in for specific roles */}
              {/* <Route path="/doc-digitize" element={<FinalDoc />} /> */}
              {/* <Route path="/location-detail" element={<LocationDetail />} /> */}
              {/* <Route path="/public" element={<Public />} /> */}

              {/* Catch-all → Redirect to appropriate page */}
              <Route
                path="*"
                element={
                  currentUser ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;
