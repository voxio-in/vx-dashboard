import React from "react";

interface HeaderTooltipProps {
  content: string;
  children: React.ReactNode;
}

export const HeaderTooltip: React.FC<HeaderTooltipProps> = ({
  content,
  children,
}) => {
  return (
    <div className="group/tooltip relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-lg shadow-xl border border-gray-700/50 w-48 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-[100]">
        <div className="font-medium leading-relaxed">{content}</div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-gray-900/95" />
      </div>
    </div>
  );
};
