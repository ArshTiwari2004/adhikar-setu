import React from "react";
import { useNavigate } from "react-router-dom";

function NotFoundPage({ user, language }) {
  const navigate = useNavigate();

  const handleRedirect = () => {
    if (!user) {
      navigate("/"); // Not logged in → landing page
    } else if (user.role === "gram_sabha") {
      navigate("/claimant-dashboard"); // Gram Sabha users → Claimant Dashboard
    } else {
      navigate("/dashboard"); // Other roles → Dashboard
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] text-center px-4">
      <h2 className="text-3xl font-bold text-red-600 mb-6">
        {language === "en"
          ? "Sorry, Page Not Found"
          : "क्षमा करें, पृष्ठ नहीं मिला"}
      </h2>

      <p className="text-gray-600 mb-4">
        {language === "en"
          ? "We couldn’t find the page you were looking for. It may not exist or is still under development."
          : "हम वह पृष्ठ नहीं ढूँढ पाए जिसकी आप तलाश कर रहे थे। यह मौजूद नहीं है या अभी विकासाधीन है।"}
      </p>

      <p className="text-gray-600 mb-6">
        {language === "en"
          ? "If you need assistance, please reach out to us at "
          : "यदि आपको सहायता की आवश्यकता है, तो कृपया हमसे इस पते पर संपर्क करें "}
        <a
          href="mailto:arshtiwari12345@gmail.com"
          className="text-blue-600 hover:underline"
        >
          arshtiwari12345@gmail.com
        </a>
      </p>

      <button
        onClick={handleRedirect}
        className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer transition"
      >
        {language === "en" ? "Go Back Home" : "मुख्य पृष्ठ पर वापस जाएं"}
      </button>
    </div>
  );
}

export default NotFoundPage;
