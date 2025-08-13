import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { MoreHorizontal, Eye, Share2, Copy } from 'lucide-react';

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within Dropdown.Root');
  }
  return context;
};

interface DropdownRootProps {
  children: ReactNode;
}

export const Dropdown = {
  Root: ({ children }: DropdownRootProps) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
        <div className="relative">
          {children}
        </div>
      </DropdownContext.Provider>
    );
  },

  DotsButton: () => {
    const { setIsOpen } = useDropdown();
    
    return (
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
      >
        <MoreHorizontal className="w-4 h-4 text-gray-600" />
      </button>
    );
  },

  Popover: ({ children, className = '' }: { children: ReactNode; className?: string }) => {
    const { isOpen } = useDropdown();
    
    if (!isOpen) return null;
    
    return (
      <div className={`absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 ${className}`}>
        {children}
      </div>
    );
  },

  Menu: ({ children }: { children: ReactNode }) => {
    return (
      <div className="py-1">
        {children}
      </div>
    );
  },

  Item: ({ 
    children, 
    icon: Icon, 
    onClick 
  }: { 
    children: ReactNode; 
    icon?: React.ComponentType<{ className?: string }>; 
    onClick?: () => void;
  }) => {
    const { setIsOpen } = useDropdown();
    
    const handleClick = () => {
      onClick?.();
      setIsOpen(false);
    };
    
    return (
      <button
        onClick={handleClick}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
      >
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </button>
    );
  }
};
