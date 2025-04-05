
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Zap 
} from "lucide-react";

interface CustomizeViewProps {
  colors: Record<string, string>;
  onRotate: () => void;
  activeAngle: number;
  angles: number[];
}

const CustomizeView: React.FC<CustomizeViewProps> = ({
  colors,
  onRotate,
  activeAngle,
  angles,
}) => {
  const [showHotspots, setShowHotspots] = useState(false);

  // Define shoe parts with their respective positions for hotspots
  const shoeParts = [
    { id: "base", name: "Base", position: { top: "45%", left: "50%" } },
    { id: "swoosh", name: "Swoosh", position: { top: "40%", left: "65%" } },
    { id: "laces", name: "Laces", position: { top: "30%", left: "50%" } },
    { id: "sole", name: "Sole", position: { top: "70%", left: "50%" } },
    { id: "toebox", name: "Toe Box", position: { top: "25%", left: "30%" } },
    { id: "heel", name: "Heel", position: { top: "45%", left: "80%" } },
  ];

  const getShoeImageForAngle = () => {
    // In a real app, you would have different images for different angles
    // We're simulating this with a basic URL structure
    return `https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/dd40b594-4ef5-437d-8ea7-dd83a18e2a9c/custom-nike-dunk-high-by-you-shoes.png`;
  };

  const previousAngle = () => {
    const currentIndex = angles.indexOf(activeAngle);
    const prevIndex = currentIndex === 0 ? angles.length - 1 : currentIndex - 1;
    onRotate(angles[prevIndex]);
  };

  const nextAngle = () => {
    const currentIndex = angles.indexOf(activeAngle);
    const nextIndex = currentIndex === angles.length - 1 ? 0 : currentIndex + 1;
    onRotate(angles[nextIndex]);
  };

  return (
    <div className="relative w-full h-[500px] bg-gray-100 rounded-xl overflow-hidden">
      {/* 3D View Controls */}
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <button
          onClick={() => setShowHotspots(!showHotspots)}
          className={cn(
            "p-2 rounded-full transition-colors",
            showHotspots ? "bg-kickverse-purple text-white" : "bg-white text-kickverse-purple"
          )}
          title="Show/Hide Part Selectors"
        >
          <Zap size={16} />
        </button>
        <button
          onClick={onRotate}
          className="p-2 bg-white text-kickverse-purple rounded-full hover:bg-gray-100 transition-colors"
          title="Rotate Shoe"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Rotation Controls */}
      <button 
        onClick={previousAngle}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
        aria-label="Previous angle"
      >
        <ChevronLeft className="h-5 w-5 text-kickverse-purple" />
      </button>
      
      <button 
        onClick={nextAngle}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
        aria-label="Next angle"
      >
        <ChevronRight className="h-5 w-5 text-kickverse-purple" />
      </button>

      {/* Shoe Image with Color Overlay */}
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.img
          src={getShoeImageForAngle()}
          alt="Customizable Sneaker"
          className="w-auto h-4/5 object-contain"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          key={activeAngle}
        />
        
        {/* Color Indicator Pills */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {Object.entries(colors).map(([partId, color]) => (
            <div
              key={partId}
              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: color }}
              title={`${partId}: ${color}`}
            />
          ))}
        </div>

        {/* Hotspots for part selection */}
        {showHotspots && shoeParts.map((part) => (
          <div
            key={part.id}
            className="absolute w-8 h-8 rounded-full bg-white bg-opacity-80 flex items-center justify-center cursor-pointer transform -translate-x-1/2 -translate-y-1/2 border-2 border-kickverse-purple shadow-lg transition-all hover:scale-110"
            style={{ 
              top: part.position.top, 
              left: part.position.left,
              backgroundColor: colors[part.id] || "#FFFFFF" 
            }}
            title={`${part.name}: ${colors[part.id] || "#FFFFFF"}`}
          >
            <span className="text-xs font-bold text-kickverse-purple">
              {part.name.charAt(0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomizeView;
