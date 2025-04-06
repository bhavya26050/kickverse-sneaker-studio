
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="design" className="text-base py-4">Design</TabsTrigger>
            <TabsTrigger value="sizing" className="text-base py-4">Sizing</TabsTrigger>
          </TabsList>

          {/* Design Tab */}
          <TabsContent value="design" className="p-6">
            <h2 className="text-lg font-medium mb-6">Choose Colors</h2>
            
            {shoeParts.map(part => (
              <div key={part.id} className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <Label className="block text-sm font-medium text-gray-700">
                    {part.name}
                  </Label>
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-300" 
                    style={{ backgroundColor: customization[part.id] || part.defaultColor }}
                  ></div>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {customizationColors.map(color => (
                    <button
                      key={`${part.id}-${color.value}`}
                      className={cn(
                        "color-swatch h-12 rounded-full flex items-center justify-center border-2 transition-all hover:scale-105",
                        customization[part.id] === color.value 
                          ? "border-kickverse-purple shadow-md" 
                          : "border-transparent",
                        color.textColor
                      )}
                      style={{ backgroundColor: color.value }}
                      onClick={() => handleColorChange(part.id, color.value)}
                      aria-label={`${part.name} ${color.name}`}
                    >
                      {customization[part.id] === color.value && (
                        <span className="flex items-center justify-center rounded-full bg-white w-5 h-5 text-xs text-kickverse-purple">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Sizing Tab */}
          <TabsContent value="sizing" className="p-6">
            <h2 className="text-lg font-medium mb-6">Select Your Size</h2>
            
            <div className="grid grid-cols-3 gap-3 mb-8">
              {sizes.map(size => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  className={cn(
                    "border-gray-300 hover:border-kickverse-purple transition-all",
                    selectedSize === size && "bg-kickverse-purple text-white hover:bg-kickverse-purple/90"
                  )}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
            
            <div className="bg-kickverse-soft-grey p-6 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-3">Size Guide</h3>
              <p className="text-sm text-gray-600 mb-4">
                Not sure of your size? Use our size guide to find the perfect fit for your feet.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm rounded-md overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium">US Size</th>
                      <th className="text-left py-3 px-4 font-medium">EU Size</th>
                      <th className="text-left py-3 px-4 font-medium">Foot Length (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4">US 7</td>
                      <td className="py-3 px-4">EU 40</td>
                      <td className="py-3 px-4">25 cm</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4">US 8</td>
                      <td className="py-3 px-4">EU 41</td>
                      <td className="py-3 px-4">26 cm</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4">US 9</td>
                      <td className="py-3 px-4">EU 42</td>
                      <td className="py-3 px-4">27 cm</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4">US 10</td>
                      <td className="py-3 px-4">EU 43</td>
                      <td className="py-3 px-4">28 cm</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4">US 11</td>
                      <td className="py-3 px-4">EU 44</td>
                      <td className="py-3 px-4">29 cm</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4">US 12</td>
                      <td className="py-3 px-4">EU 45</td>
                      <td className="py-3 px-4">30 cm</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomizationPanel;
