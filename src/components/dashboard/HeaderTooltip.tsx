import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface HeaderTooltipProps {
  content: string;
  children: React.ReactNode;
}

export const HeaderTooltip: React.FC<HeaderTooltipProps> = ({
  content,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      top: rect.top,
      left: rect.left,
    });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      <div
        className="relative inline-flex items-center gap-1.5" // Changed to inline-flex
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {isVisible &&
        typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: -4, scale: 1 }} // Changed y from 0 to -4
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="fixed w-48 p-3 bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-xl shadow-xl border border-gray-700/50 pointer-events-none"
              style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                transform: "translate(-10px, calc(-100% - 12px))", // Position above with gap
                zIndex: 99999,
              }}
            >
              <div className="font-medium leading-relaxed">{content}</div>
              {/* Arrow pointing down */}
              <div
                className="absolute w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900/95"
                style={{
                  bottom: "-4px",
                  left: "20px",
                }}
              />
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};
