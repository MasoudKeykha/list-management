"use client";

import { useEffect } from "react";

import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  preventCloseOnBackdrop?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  maxWidth = "md",
  preventCloseOnBackdrop = false,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Add escape key listener
      const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscapeKey);

      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";

      // Cleanup function
      return () => {
        document.removeEventListener("keydown", handleEscapeKey);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking the backdrop and it's allowed
    if (e.target === e.currentTarget && !preventCloseOnBackdrop) {
      onClose();
    }
  };

  const getMaxWidthClass = () => {
    const widthClasses = {
      xs: "max-w-xs",
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
    };
    return widthClasses[maxWidth];
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Background Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-70 z-40"
        onClick={handleBackdropClick}
      />

      {/* Modal Container */}
      <div
        className="fixed inset-0 flex items-center justify-center p-2 xs:p-3 sm:p-4 z-50 cursor-pointer"
        onClick={handleBackdropClick}
        title={!preventCloseOnBackdrop ? "Click outside to close" : undefined}
      >
        <div
          className={`bg-gray-200 rounded-2xl xs:rounded-3xl ${getMaxWidthClass()} w-full max-h-[95vh] xs:max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 cursor-default`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-3 xs:p-4 sm:p-6 border-b border-gray-300/50">
              {title && (
                <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 truncate pr-3 xs:pr-4">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 bg-gray-200 rounded-full p-1.5 xs:p-2 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-6px_-6px_12px_rgba(255,255,255,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),inset_-4px_-4px_8px_rgba(255,255,255,0.7)] transition-all duration-200 transform active:scale-95 flex-shrink-0 ml-auto cursor-pointer"
                  title="Close modal"
                >
                  <X size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="max-h-[calc(95vh-80px)] xs:max-h-[calc(90vh-100px)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

/*
USAGE GUIDE - Modal Component

This is a reusable modal component that accepts children and provides a customizable overlay interface.

Basic Usage:
```tsx
import { useState } from 'react';
import Modal from '@/components/Modal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="My Modal"
      >
        <div className="p-6">
          <p>Modal content goes here</p>
        </div>
      </Modal>
    </>
  );
}
```

Props:
- isOpen (boolean): Controls modal visibility
- onClose (function): Callback when modal should close
- children (ReactNode): Modal content
- title? (string): Optional modal title
- showCloseButton? (boolean): Show/hide close button (default: true)
- maxWidth? ("xs"|"sm"|"md"|"lg"|"xl"): Modal width (default: "md")
- preventCloseOnBackdrop? (boolean): Prevent closing when clicking outside (default: false)

Features:
- Escape key support
- Click outside to close (configurable)
- Body scroll prevention
- Responsive design
- Neomorphism styling
- Smooth animations

Examples:

1. Simple Modal:
```tsx
<Modal isOpen={isOpen} onClose={onClose}>
  <div className="p-6">Content here</div>
</Modal>
```

2. Modal with Title:
```tsx
<Modal isOpen={isOpen} onClose={onClose} title="Settings">
  <div className="p-6">Settings content</div>
</Modal>
```

3. Prevent Outside Click:
```tsx
<Modal 
  isOpen={isOpen} 
  onClose={onClose} 
  preventCloseOnBackdrop={true}
>
  <div className="p-6">Important content</div>
</Modal>
```

4. Large Modal:
```tsx
<Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
  <div className="p-6">Large content area</div>
</Modal>
```
*/