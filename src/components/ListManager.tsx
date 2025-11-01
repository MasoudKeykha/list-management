"use client";

import { useState, useEffect } from "react";

import { ListItem as ListItemType, FormData } from "@/types";

import ListItem from "./ListItem";
import ListItemForm from "./ListItemForm";

import { Plus } from "lucide-react";

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// localStorage key for persisting data
const STORAGE_KEY = "list-management-items";

// Helper functions for localStorage
const loadItemsFromStorage = (): ListItemType[] => {
  if (typeof window === "undefined") return [];
  
  try {
    const storedItems = localStorage.getItem(STORAGE_KEY);
    if (!storedItems) return [];
    
    const parsedItems = JSON.parse(storedItems);
    // Convert dateCreated strings back to Date objects
    return parsedItems.map((item: any) => ({
      ...item,
      dateCreated: new Date(item.dateCreated)
    }));
  } catch (error) {
    console.error("Error loading items from localStorage:", error);
    return [];
  }
};

const saveItemsToStorage = (items: ListItemType[]) => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving items to localStorage:", error);
  }
};

const ListManager = () => {
  const [items, setItems] = useState<ListItemType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ListItemType | null>(null);

  // Load items from localStorage on component mount
  useEffect(() => {
    const savedItems = loadItemsFromStorage();
    setItems(savedItems);
  }, []);

  // Save items to localStorage whenever items change
  useEffect(() => {
    saveItemsToStorage(items);
  }, [items]);

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: ListItemType) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleModalSubmit = (data: FormData) => {
    if (editingItem) {
      // Update existing item
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editingItem.id
            ? { ...item, title: data.title, subtitle: data.subtitle }
            : item
        )
      );
    } else {
      // Create new item
      const newItem: ListItemType = {
        id: generateId(),
        title: data.title,
        subtitle: data.subtitle,
        dateCreated: new Date(),
      };
      setItems((prevItems) => [newItem, ...prevItems]);
    }
  };

  const handleClearAllData = () => {
    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      setItems([]);
      // Also clear from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 py-2 xs:py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 xs:mb-6 sm:mb-8">
          <div className="flex flex-col space-y-3 xs:space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="text-center sm:text-left">
              <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 xs:mb-2">
                List Management
              </h1>
              <p className="text-xs xs:text-sm sm:text-base text-gray-600 px-1 xs:px-2 sm:px-0">
                Manage your items with ease. Create, edit, and organize your
                list.
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-3">
              <button
                onClick={handleCreate}
                className="inline-flex items-center justify-center px-3 xs:px-4 sm:px-6 py-2 xs:py-3 bg-gray-200 text-gray-700 text-xs xs:text-sm sm:text-base font-medium rounded-xl xs:rounded-2xl shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-6px_-6px_12px_rgba(255,255,255,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),inset_-4px_-4px_8px_rgba(255,255,255,0.7)] transition-all duration-200 transform active:scale-98 cursor-pointer"
              >
                <Plus
                  size={16}
                  className="xs:w-[18px] xs:h-[18px] mr-2 flex-shrink-0"
                />
                Create Item
              </button>
              {items.length > 0 && (
                <button
                  onClick={handleClearAllData}
                  className="inline-flex items-center justify-center px-3 xs:px-4 sm:px-6 py-2 xs:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs xs:text-sm sm:text-base font-medium rounded-xl xs:rounded-2xl shadow-[4px_4px_8px_rgba(0,0,0,0.2),-4px_-4px_8px_rgba(239,68,68,0.1)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.25),-6px_-6px_12px_rgba(239,68,68,0.15)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(239,68,68,0.1)] transition-all duration-200 transform active:scale-98 cursor-pointer"
                  title="Clear all data"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Items Count */}
        <div className="mb-3 xs:mb-4 sm:mb-6">
          <div className="bg-gray-200 rounded-xl xs:rounded-2xl px-3 xs:px-4 py-2 xs:py-3 shadow-[6px_6px_12px_rgba(0,0,0,0.15),-6px_-6px_12px_rgba(255,255,255,0.8)]">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm text-gray-600">
                {items.length === 0
                  ? "No items yet"
                  : `${items.length} ${items.length === 1 ? "item" : "items"} • Data automatically saved`}
              </p>
              {items.length > 0 && (
                <button
                  onClick={handleClearAllData}
                  className="sm:hidden ml-3 px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium rounded-lg shadow-[4px_4px_8px_rgba(0,0,0,0.2),-4px_-4px_8px_rgba(239,68,68,0.1)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.25),-6px_-6px_12px_rgba(239,68,68,0.15)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(239,68,68,0.1)] transition-all duration-200 transform active:scale-95 cursor-pointer flex-shrink-0"
                  title="Clear all data"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Items List */}
        {items.length === 0 ? (
          <div className="text-center py-6 xs:py-8 sm:py-12">
            <div className="max-w-xs sm:max-w-sm mx-auto px-3 xs:px-4">
              <button
                onClick={handleCreate}
                className="rounded-full bg-gray-200 w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-3 xs:mb-4 sm:mb-6 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-6px_-6px_12px_rgba(255,255,255,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),inset_-4px_-4px_8px_rgba(255,255,255,0.7)] transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
                title="Click to create your first item"
              >
                <Plus
                  size={20}
                  className="xs:w-6 xs:h-6 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                />
              </button>
              <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3">
                No items yet
              </h3>
              <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-4 xs:mb-6 sm:mb-8 leading-relaxed">
                Get started by creating your first item. Click the plus icon
                above or the button below.
              </p>
              <button
                onClick={handleCreate}
                className="inline-flex items-center justify-center px-3 xs:px-4 sm:px-6 py-2 xs:py-3 bg-gray-200 text-gray-700 text-xs xs:text-sm sm:text-base font-medium rounded-xl xs:rounded-2xl shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-6px_-6px_12px_rgba(255,255,255,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),inset_-4px_-4px_8px_rgba(255,255,255,0.7)] transition-all duration-200 transform active:scale-98 w-full sm:w-auto cursor-pointer"
              >
                <Plus
                  size={16}
                  className="xs:w-[18px] xs:h-[18px] mr-2 flex-shrink-0"
                />
                Create Your First Item
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-2 xs:gap-3 sm:gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <ListItem
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        <ListItemForm
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          initialData={
            editingItem
              ? {
                  title: editingItem.title,
                  subtitle: editingItem.subtitle,
                }
              : undefined
          }
          title={editingItem ? "Edit Item" : "Create New Item"}
        />
      </div>

      {/* Fixed Floating Action Button for Mobile */}
      <button
        onClick={handleCreate}
        className="fixed bottom-4 right-4 sm:hidden w-14 h-14 bg-gray-200 text-gray-700 rounded-full shadow-[6px_6px_12px_rgba(0,0,0,0.15),-6px_-6px_12px_rgba(255,255,255,0.8)] hover:shadow-[8px_8px_16px_rgba(0,0,0,0.2),-8px_-8px_16px_rgba(255,255,255,0.9)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),inset_-4px_-4px_8px_rgba(255,255,255,0.7)] flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer z-50"
        title="Create new item"
      >
        <Plus size={24} className="text-gray-600" />
      </button>
    </div>
  );
};

export default ListManager;

/*
USAGE GUIDE - ListManager Component

This is the main component that orchestrates the entire list management interface.
It handles CRUD operations, state management, and provides a complete user interface.

Basic Usage:
```tsx
import ListManager from '@/components/ListManager';

function App() {
  return (
    <div>
      <ListManager />
    </div>
  );
}
```

Features:
- Full CRUD operations (Create, Read, Update, Delete)
- Responsive design with mobile-first approach
- Neomorphism design system
- Modal-based form interactions
- Floating action button for mobile
- Item counter
- Empty state with call-to-action
- Confirmation dialogs for destructive actions

State Management:
The component manages its own state including:
- items: Array of ListItem objects
- isModalOpen: Modal visibility state
- editingItem: Currently selected item for editing

Responsive Behavior:
- Mobile (≤639px): 
  - Single column grid
  - Fixed floating action button
  - Stacked header layout
- Desktop (≥640px):
  - Multi-column grid (up to 3 columns)
  - Header button for create action
  - Side-by-side layouts

Grid Layout:
- Mobile: 1 column
- Large: 2 columns  
- Extra Large: 3 columns

Data Persistence:
- Automatic localStorage integration
- Data survives browser refresh
- Handles Date object serialization
- Clear all data functionality
- Error handling for storage operations

The component is fully self-contained and requires no props, making it easy to integrate into any application.

Architecture:
- Uses localStorage for data persistence
- Automatic save on every change
- Load data on component mount
- Modular design with reusable components
- Type-safe with TypeScript interfaces
- Error handling for storage edge cases
*/
