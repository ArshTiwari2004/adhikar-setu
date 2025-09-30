import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  BarChart3,
  Image,
  TrendingUp,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Leaf,
  Home,
  Wheat,
  Droplets,
} from "lucide-react";

import {
  // newStateVillageData,
  getDistricts,
  getConditionData,
  calculateLandUseChange,
} from "./data/newStateVillageData";

function AssetMapping() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [mode, setMode] = useState(null); // 'analytics' | 'mapping' | null

  const isDistrictEnabled = selectedState.length > 0;

  const districts = getDistricts(selectedState);

  // Get current images
  const getCurrentImages = () => {
    if (!selectedState || !selectedDistrict) return [];
    return ["overlay1.png", "overlay2.png", "overlay3.png"];
  };

  const currentImages = getCurrentImages();

  const indiaOsmEmbedSrc = useMemo(() => {
    const bbox = [68.1766, 6.5546, 97.4026, 35.6745];
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox.join(
      "%2C"
    )}&layer=mapnik`;
  }, []);

  const handleShowAnalytics = () => setMode("analytics");
  const handleCheckMapping = () => setMode("mapping");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6 space-y-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
        <Card className="min-h-[420px]">
          <CardHeader>
            <CardTitle>India Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-hidden rounded-lg border">
              <iframe
                title="India Map"
                src={indiaOsmEmbedSrc}
                className="h-[420px] w-full"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Enter state
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                  }}
                  className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                >
                  <option value="" disabled>
                    Select a state
                  </option>
                  <option value="Odisha">Odisha</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Telangana">Telangana</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Select district
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setMode(null);
                  }}
                  disabled={!isDistrictEnabled}
                  className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                >
                  <option value="" disabled>
                    {isDistrictEnabled
                      ? `Select a district in ${selectedState}`
                      : "Select a state first"}
                  </option>
                  {districts.map((districtName) => (
                    <option key={districtName} value={districtName}>
                      {districtName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Button group with the new button */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  onClick={handleShowAnalytics}
                  disabled={!selectedState || !selectedDistrict}
                >
                  Show Data Analytics
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCheckMapping}
                  disabled={!selectedState || !selectedDistrict}
                >
                  Check Mapping
                </Button>
              </div>
              <div className="w-full flex justify-center mt-4">
                {/* New Button */}
                <Button
                  className="bg-black text-white hover:bg-gray-800"
                  variant="secondary"
                  onClick={() =>
                    (window.location.href =
                      "http://adhikar-setu-assetmapping.streamlit.app")
                  }
                >
                  Test the model
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {mode === "analytics" &&
        selectedState &&
        selectedDistrict &&
        (() => {
          const oldData = getConditionData(
            selectedState,
            selectedDistrict,
            "old"
          );
          const newData = getConditionData(
            selectedState,
            selectedDistrict,
            "new"
          );
          const changeData = calculateLandUseChange(
            selectedState,
            selectedDistrict
          );

          const categories = [
            {
              key: "agriculture",
              name: "Agriculture",
              icon: Wheat,
              color: "from-amber-500 to-amber-600",
            },
            {
              key: "forest",
              name: "Forest",
              icon: Leaf,
              color: "from-green-500 to-green-600",
            },
            {
              key: "residential",
              name: "Residential",
              icon: Home,
              color: "from-blue-500 to-blue-600",
            },
            {
              key: "waterBodies",
              name: "Water Bodies",
              icon: Droplets,
              color: "from-cyan-500 to-cyan-600",
            },
          ];

          return (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                  Land Use Analytics for {selectedDistrict}, {selectedState}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <div
                          key={cat.key}
                          className={`bg-gradient-to-r ${cat.color} rounded-xl p-4 text-white`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white/80 text-sm font-semibold">
                                {cat.name}
                              </p>
                              <p className="text-2xl font-bold">
                                {newData[cat.key]}%
                              </p>
                            </div>
                            <Icon className="h-6 w-6 text-white/70" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        Historical vs Current
                      </h3>
                      <div className="space-y-3">
                        {categories.map((cat) => (
                          <div
                            key={cat.key}
                            className="flex justify-between items-center"
                          >
                            <span className="text-gray-600">{cat.name}</span>
                            <span className="text-sm">
                              {oldData[cat.key]}% → {newData[cat.key]}%
                              <span
                                className={`ml-2 font-bold ${
                                  changeData[cat.key] >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                ({changeData[cat.key] > 0 ? "+" : ""}
                                {changeData[cat.key]}%)
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        Key Insights
                      </h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700">
                          <strong>Dominant:</strong>{" "}
                          {
                            categories.find(
                              (c) =>
                                newData[c.key] ===
                                Math.max(
                                  ...categories.map((cat) => newData[cat.key])
                                )
                            )?.name
                          }{" "}
                          ({Math.max(...categories.map((c) => newData[c.key]))}
                          %)
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Biggest Change:</strong>{" "}
                          {(() => {
                            const maxChange = Math.max(
                              ...Object.values(changeData).map(Math.abs)
                            );
                            const cat = categories.find(
                              (c) => Math.abs(changeData[c.key]) === maxChange
                            );
                            return `${cat?.name} (${
                              changeData[cat?.key] > 0 ? "+" : ""
                            }${changeData[cat?.key]}%)`;
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })()}

      {mode === "mapping" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Image className="h-5 w-5 mr-2 text-purple-600" />
              Mapping Preview for {selectedDistrict}, {selectedState}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {currentImages.map((image, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 rounded-xl
                    flex flex-col items-center justify-center"
                  >
                    <div className="aspect-w-16 aspect-h-9 w-250">
                      <img src={image} />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {image.replace(/_/g, " ").replace(".jpg", "")}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedDistrict}, {selectedState}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Images Available
                </h3>
                <p className="text-gray-600">
                  No mapping images are currently available for{" "}
                  {selectedDistrict}, {selectedState}.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
export default AssetMapping;
