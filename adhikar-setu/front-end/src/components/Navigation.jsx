import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  FileText,
  CheckSquare,
  Award,
  BarChart3,
  Globe,
  LogOut,
  Sun,
  Moon,
  Languages,
  Menu,
  X,
  ChevronDown,
  Map,
  Settings,
  HelpCircle,
  Bell,
  UserRound,
  Earth,
} from "lucide-react";
import { logoutUser } from "../firebase/authService";
import { useNavigate } from "react-router-dom";
import CustomTooltip from "@/global/CustomTooltip";

const Navigation = ({
  user,
  currentScreen,
  onScreenChange,
  onLogout,
  isDarkMode,
  setIsDarkMode,
  language,
  setLanguage,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Handle scroll effect for enhanced navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      onLogout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // what i did below is to modify the menu click handler to redirect gram_sabha users to claimant-dashboard and let other roles behave as before, they will be changed later as per requirements
  const handleMenuClick = (item) => {
    if (item.id === "dashboard" && user.role === "gram_sabha") {
      navigate("/claimant-dashboard");
      onScreenChange("claimant-dashboard"); // <-- set state to match redirected screen
    } else {
      onScreenChange(item.id);
    }

    setIsMenuOpen(false);
  };

  const getMenuItems = () => {
    const allItems = [
      {
        id: "dashboard",
        name: language === "en" ? "Dashboard" : "डैशबोर्ड",
        icon: Home,
        roles: ["gram_sabha", "frc", "sdlc", "dlc", "mota"],
      },
      // {
      //   id: "claim-submission",
      //   name: language === "en" ? "Submit Claim" : "दावा जमा करें",
      //   icon: FileText,
      //   roles: ["gram_sabha"],
      // },
      {
        id: "verification",
        name: language === "en" ? "Verification" : "सत्यापन",
        icon: CheckSquare,
        roles: ["frc", "sdlc"],
      },
      {
        id: "dlc-approval",
        name: language === "en" ? "Approval" : "अनुमोदन",
        icon: Award,
        roles: ["dlc"],
      },
      {
        id: "dss",
        name: language === "en" ? "Decision Support" : "निर्णय सहायता",
        icon: BarChart3,
        roles: ["sdlc", "frc"],
      },
      {
        id: "asset-mapping",
        name: language === "en" ? "Asset Mapping" : "संपत्ति मानचित्रण",
        icon: Map,
        roles: ["frc", "sdlc", "dlc", "mota"],
      },
      {
        id: "public-atlas",
        name: language === "en" ? "Public Atlas" : "सार्वजनिक एटलस",
        icon: Globe,
        roles: ["gram_sabha", "frc", "sdlc", "dlc", "mota"],
      },
      // {
      //   id: "profile",
      //   name: language === "en" ? "Profile" : "प्रोफाइल",
      //   icon: UserRound,
      //   roles: ["gram_sabha", "frc", "sdlc", "dlc", "mota"],
      // },
      {
        id: "dss-results",
        name: language === "en" ? "DSS Results" : "DSS परिणाम",
        icon: BarChart3,
        roles: ["dlc", "mota"],
      },
    ];

    return allItems.filter((item) => item.roles.includes(user.role));
  };

  const menuItems = getMenuItems();

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300  ${
          scrolled
            ? isDarkMode
              ? "bg-gray-900/95 backdrop-blur-lg shadow-lg"
              : "bg-white/95 backdrop-blur-lg shadow-md"
            : isDarkMode
            ? "bg-gray-900 border-b border-gray-800"
            : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center group">
              <div className="flex-shrink-0 flex items-center">
                <div className="relative">
                  <div className="absolute inset-0 "></div>
                  <div className="relative p-2 rounded-xl">
                    <img
                      src="/logo1.png"
                      alt="Adhikar-Setu Logo"
                      className="h-7 w-7 relative z-10"
                    />
                  </div>
                </div>
                <div className="ml-3">
                  <h1
                    className={`text-xl font-bold  ${
                      isDarkMode ? "from-green-400 to-emerald-400" : ""
                    }`}
                  >
                    Adhikar Setu
                  </h1>
                  <p className="text-xs font-semibold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                    {language === "en"
                      ? "Forest Rights Portal"
                      : "वन अधिकार पोर्टल"}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      // changed to use handleMenuClick as defined above
                      onClick={() => handleMenuClick(item)}
                      className={`relative flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer group ${
                        isActive
                          ? isDarkMode
                            ? "text-white"
                            : "text-white"
                          : isDarkMode
                          ? "text-gray-300 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg"></div>
                      )}
                      {!isActive && (
                        <div
                          className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                            isDarkMode
                              ? "bg-gray-800 opacity-0 group-hover:opacity-100"
                              : "bg-gray-100 opacity-0 group-hover:opacity-100"
                          }`}
                        ></div>
                      )}
                      <Icon className="h-4 w-4 mr-2 relative z-10" />
                      <span className="relative z-10">{item.name}</span>
                      {isActive && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-1.5 h-1.5 bg-white rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-2">
              {/* Notifications */}
              <button
                className={`relative p-2.5 rounded-xl transition-all duration-300 group ${
                  isDarkMode
                    ? "hover:bg-gray-800 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <Bell className="h-5 w-5 group-hover:animate-pulse" />
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-gradient-to-r from-red-500 to-red-600 items-center justify-center text-white text-xs font-bold shadow-lg">
                    3
                  </span>
                </span>
              </button>

              {/* Language */}
              <CustomTooltip
                text={
                  language === "en" ? "Switch to Hindi" : "अंग्रेजी में बदलें"
                }
              >
                <button
                  onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                  className={`relative p-2.5 rounded-xl transition-all duration-300 cursor-pointer group overflow-hidden ${
                    isDarkMode
                      ? "hover:bg-gray-800 text-gray-300"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Earth className="h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform" />
                </button>
              </CustomTooltip>

              {/* Dark Mode */}
              {/* <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg ${
                  isDarkMode
                    ? "hover:bg-gray-800 text-amber-300"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
                title={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button> */}

              {/* Profile Dropdown (Desktop) */}
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className={`flex items-center space-x-3 pl-2 pr-3 py-2 rounded-xl transition-all duration-300 cursor-pointer group ${
                    isDarkMode
                      ? "hover:bg-gray-800"
                      : "hover:bg-gray-100 hover:shadow-md"
                  } ${
                    isProfileDropdownOpen
                      ? isDarkMode
                        ? "bg-gray-800"
                        : "bg-gray-100 shadow-md"
                      : ""
                  }`}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-sm opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    <div className="relative h-9 w-9 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white/20">
                      {user?.profile?.name?.charAt(0).toUpperCase() ||
                        user?.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </div>
                  </div>
                  <div className="text-left hidden lg:block">
                    <p
                      className={`text-sm font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {user?.profile?.name || user.email?.split("@")[0]}
                    </p>
                    <p className="text-xs text-gray-500 capitalize font-medium">
                      {user.role?.replace(/_/g, " ")}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-all duration-300 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    } ${isProfileDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isProfileDropdownOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl py-2 z-50 backdrop-blur-lg border transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-800/95 border-gray-700"
                        : "bg-white/95 border-gray-200"
                    }`}
                  >
                    <button
                      onClick={() => onScreenChange("profile")}
                      className={`flex items-center w-full px-4 py-2.5 text-sm font-medium transition-all duration-200 group cursor-pointer ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded-lg mr-3 ${
                          isDarkMode
                            ? "bg-gray-700 group-hover:bg-green-600/20"
                            : "bg-gray-100 group-hover:bg-green-50"
                        }`}
                      >
                        <UserRound className="h-4 w-4" />
                      </div>
                      {language === "en" ? "Profile" : "प्रोफाइल"}
                    </button>
                    <button
                      onClick={() => onScreenChange("settings")}
                      className={`flex items-center w-full px-4 py-2.5 text-sm font-medium transition-all duration-200 group cursor-pointer ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded-lg mr-3 ${
                          isDarkMode
                            ? "bg-gray-700 group-hover:bg-blue-600/20"
                            : "bg-gray-100 group-hover:bg-blue-50"
                        }`}
                      >
                        <Settings className="h-4 w-4" />
                      </div>
                      {language === "en" ? "Settings" : "सेटिंग्स"}
                    </button>
                    <button
                      onClick={() => onScreenChange("settings")}
                      className={`flex items-center w-full px-4 py-2.5 text-sm font-medium transition-all duration-200 group cursor-pointer ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded-lg mr-3 ${
                          isDarkMode
                            ? "bg-gray-700 group-hover:bg-purple-600/20"
                            : "bg-gray-100 group-hover:bg-purple-50"
                        }`}
                      >
                        <HelpCircle className="h-4 w-4" />
                      </div>
                      {language === "en" ? "Help & Support" : "सहायता"}
                    </button>
                    <div
                      className={`border-t my-2 ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    ></div>
                    <button
                      onClick={handleLogout}
                      className={`flex items-center w-full px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer group ${
                        isDarkMode
                          ? "text-red-400 hover:bg-red-500/10"
                          : "text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded-lg mr-3 ${
                          isDarkMode
                            ? "bg-red-500/10 group-hover:bg-red-500/20"
                            : "bg-red-50 group-hover:bg-red-100"
                        }`}
                      >
                        <LogOut className="h-4 w-4" />
                      </div>
                      {language === "en" ? "Logout" : "लॉग आउट"}
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${
                    isDarkMode
                      ? "hover:bg-gray-800 text-white"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div
                className={`px-2 pt-2 pb-3 space-y-2 sm:px-3 border-t ${
                  isDarkMode ? "border-gray-800" : "border-gray-200"
                }`}
              >
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onScreenChange(item.id);
                        setIsMenuOpen(false);
                      }}
                      className={`relative flex items-center w-full px-3 py-3.5 rounded-xl text-base font-medium transition-all duration-300 overflow-hidden ${
                        isActive
                          ? "text-white shadow-lg"
                          : isDarkMode
                          ? "text-gray-300 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600"></div>
                      )}
                      {!isActive && (
                        <div
                          className={`absolute inset-0 transition-opacity duration-300 ${
                            isDarkMode
                              ? "bg-gray-800 opacity-0 hover:opacity-100"
                              : "bg-gray-100 opacity-0 hover:opacity-100"
                          }`}
                        ></div>
                      )}
                      <Icon className="h-5 w-5 mr-3 relative z-10" />
                      <span className="relative z-10">{item.name}</span>
                    </button>
                  );
                })}

                {/* Mobile User Actions */}
                <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-800">
                  <div
                    className={`flex items-center px-3 py-3 mb-3 rounded-xl ${
                      isDarkMode ? "bg-gray-800/50" : "bg-gray-50"
                    }`}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-sm opacity-40"></div>
                      <div className="relative h-11 w-11 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/20 mr-3">
                        {user.name?.charAt(0).toUpperCase() ||
                          user.email?.charAt(0).toUpperCase() ||
                          "U"}
                      </div>
                    </div>
                    <div>
                      <p
                        className={`text-base font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {user.name || user.email?.split("@")[0]}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize font-medium">
                        {user.role?.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button
                      onClick={() => {
                        onScreenChange("profile");
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center justify-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isDarkMode
                          ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <UserRound className="h-4 w-4 mr-2" />
                      {language === "en" ? "Profile" : "प्रोफाइल"}
                    </button>
                    <button
                      onClick={() => {
                        onScreenChange("settings");
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center justify-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isDarkMode
                          ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {language === "en" ? "Settings" : "सेटिंग्स"}
                    </button>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`mt-3 flex items-center justify-center w-full px-3 py-3.5 rounded-xl text-base font-medium transition-all duration-300 ${
                      isDarkMode
                        ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    {language === "en" ? "Logout" : "लॉग आउट"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Backdrop for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navigation;
