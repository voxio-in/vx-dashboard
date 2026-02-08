import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderTooltipProps {
  content: string;
  children: React.ReactNode;
}

export const HeaderTooltip: React.FC<HeaderTooltipProps> = ({
  content,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative flex items-center gap-1.5"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 bottom-full mb-2 w-48 p-3 bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-xl shadow-xl z-50 border border-gray-700/50"
            style={{ marginLeft: "-10px" }}
          >
            <div className="font-medium leading-relaxed">{content}</div>
            <div className="absolute left-4 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900/95" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
