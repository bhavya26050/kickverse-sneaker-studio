
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomizationPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  shoeParts: Array<{ id: string; name: string; defaultColor: string }>;
  customization: Record<string, string>;
  handleColorChange: (partId: string, color: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  customizationColors: Array<{ name: string; value: string; textColor: string }>;
  sizes: string[];
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  activeTab,
  setActiveTab,
  shoeParts,
  customization,
  handleColorChange,
  selectedSize,
  setSelectedSize,
  customizationColors,
  sizes,
}) => {
  return (
    <div className="w-full lg:w-1/2">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={cn(
              "flex-1 py-4 px-6 text-center font-medium",
              activeTab === "design"
                ? "border-b-2 border-kickverse-purple text-kickverse-purple"
                : "text-gray-500 hover:text-kickverse-purple"
            )}
            onClick={() => setActiveTab("design")}
          >
            Design
          </button>
          <button
            className={cn(
              "flex-1 py-4 px-6 text-center font-medium",
              activeTab === "sizing"
                ? "border-b-2 border-kickverse-purple text-kickverse-purple"
                : "text-gray-500 hover:text-kickverse-purple"
            )}
            onClick={() => setActiveTab("sizing")}
          >
            Sizing
          </button>
        </div>

        {/* Design Tab */}
        {activeTab === "design" && (
          <div className="p-6">
            <h2 className="text-lg font-medium mb-6">Choose Colors</h2>
            
            {shoeParts.map(part => (
              <div key={part.id} className="mb-6">
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  {part.name}
                </Label>
                <div className="grid grid-cols-5 gap-3">
                  {customizationColors.map(color => (
                    <button
                      key={`${part.id}-${color.value}`}
                      className={cn(
                        "color-swatch h-10 rounded-full flex items-center justify-center border-2",
                        customization[part.id] === color.value 
                          ? "border-kickverse-purple" 
                          : "border-transparent",
                        color.textColor
                      )}
                      style={{ backgroundColor: color.value }}
                      onClick={() => handleColorChange(part.id, color.value)}
                      aria-label={`${part.name} ${color.name}`}
                    >
                      {customization[part.id] === color.value && "✓"}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sizing Tab */}
        {activeTab === "sizing" && (
          <div className="p-6">
            <h2 className="text-lg font-medium mb-6">Select Your Size</h2>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              {sizes.map(size => (
                <Button
                  key={size}
                  variant="outline"
                  className={cn(
                    "border-gray-300",
                    selectedSize === size && "border-kickverse-purple bg-kickverse-soft-grey"
                  )}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
            
            <div className="bg-kickverse-soft-grey p-4 rounded-lg">
              <h3 className="font-medium mb-2">Size Guide</h3>
              <p className="text-sm text-gray-600 mb-2">
                Not sure of your size? Use our size guide to find the perfect fit.
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">US Size</th>
                    <th className="text-left py-2">EU Size</th>
                    <th className="text-left py-2">Foot Length (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">US 7</td>
                    <td className="py-2">EU 40</td>
                    <td className="py-2">25 cm</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">US 8</td>
                    <td className="py-2">EU 41</td>
                    <td className="py-2">26 cm</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">US 9</td>
                    <td className="py-2">EU 42</td>
                    <td className="py-2">27 cm</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">US 10</td>
                    <td className="py-2">EU 43</td>
                    <td className="py-2">28 cm</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">US 11</td>
                    <td className="py-2">EU 44</td>
                    <td className="py-2">29 cm</td>
                  </tr>
                  <tr>
                    <td className="py-2">US 12</td>
                    <td className="py-2">EU 45</td>
                    <td className="py-2">30 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomizationPanel;
