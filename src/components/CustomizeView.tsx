
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Zap 
} from "lucide-react";
import { FallbackImage } from "@/components/ui/fallback-image";

interface CustomizeViewProps {
  colors: Record<string, string>;
  onRotate: (angle?: number) => void;
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
    // We're simulating this with angle-specific images
    switch(activeAngle) {
      case 0:
        return "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e7157fa4-15ca-4aa5-bf73-816681fd4891/JR+SUPERFLY+10+CLUB+FG%2FMG.png";
      case 45:
        return "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/99e1065d-d676-430a-9217-4ec61bf16b2f/custom-nike-blazer-mid-77-shoes-by-you.png";
      case 90:
        return "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b1bcbca4-e853-4df7-b329-5be3c61ee057/NIKE+DUNK+LOW+RETRO.png";
      case 180:
        return "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/5870c2a4-db94-4590-abb5-00f2119e6692/ZOOMX+VAPORFLY+NEXT%25+4+PRM.png";
      case 270:
        return "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/fb7eda3c-5ac8-4d05-a18f-1c2c5e82e36e/blazer-mid-77-vintage-mens-shoes-nw30B2.png";
      default:
        return "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/dd40b594-4ef5-437d-8ea7-dd83a18e2a9c/custom-nike-dunk-high-by-you-shoes.png";
    }
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
    <div className="relative w-full h-[500px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
      {/* 3D View Controls */}
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <button
          onClick={() => setShowHotspots(!showHotspots)}
          className={cn(
            "p-2 rounded-full transition-colors shadow-md",
            showHotspots ? "bg-kickverse-purple text-white" : "bg-white text-kickverse-purple"
          )}
          title="Show/Hide Part Selectors"
        >
          <Zap size={16} />
        </button>
        <button
          onClick={() => onRotate()}
          className="p-2 bg-white text-kickverse-purple rounded-full shadow-md hover:bg-gray-100 transition-colors"
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
        <motion.div
          className="w-auto h-4/5 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          key={activeAngle}
        >
          <FallbackImage
            src={getShoeImageForAngle()}
            alt="Customizable Sneaker"
            className="w-auto h-full object-contain"
            fallbackId={`shoe-angle-${activeAngle}`}
          />
        </motion.div>
        
        {/* Color Indicator Pills */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
          {Object.entries(colors).map(([partId, color]) => (
            <div
              key={partId}
              className="w-6 h-6 rounded-full border-2 border-white shadow-sm transition-transform hover:scale-110"
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
      
      {/* Angle indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-md text-xs shadow-sm">
        {activeAngle}° view
      </div>
    </div>
  );
};

export default CustomizeView;
