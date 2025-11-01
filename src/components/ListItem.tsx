"use client";

import { ListItemProps } from "@/types";

import { Edit, Trash2 } from "lucide-react";

const ListItem = ({ item, onEdit, onDelete }: ListItemProps) => {
  const handleEdit = () => {
    onEdit(item);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      onDelete(item.id);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="bg-gray-200 rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-6 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.7)] hover:shadow-[12px_12px_20px_rgba(0,0,0,0.15),-12px_-12px_20px_rgba(255,255,255,0.8)] transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 xs:gap-3 sm:gap-4">
        <div className="flex-1 min-w-0 order-2 sm:order-1">
          <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-800 truncate mb-1 sm:mb-2">
            {item.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
            {formatDate(item.dateCreated)}
          </p>
          <p className="text-gray-700 text-xs xs:text-sm sm:text-base leading-relaxed break-words">
            {item.subtitle}
          </p>
        </div>
        <div className="flex space-x-1 xs:space-x-2 sm:space-x-3 justify-end sm:justify-start order-1 sm:order-2 flex-shrink-0">
          <button
            onClick={handleEdit}
            className="p-1.5 xs:p-2 sm:p-3 text-gray-600 bg-gray-200 rounded-lg xs:rounded-xl shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-6px_-6px_12px_rgba(255,255,255,0.8)] hover:text-blue-600 active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),inset_-4px_-4px_8px_rgba(255,255,255,0.7)] transition-all duration-200 transform active:scale-95 cursor-pointer"
            title="Edit item"
          >
            <Edit size={14} className="xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 xs:p-2 sm:p-3 text-gray-600 bg-gray-200 rounded-lg xs:rounded-xl shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-6px_-6px_12px_rgba(255,255,255,0.8)] hover:text-red-600 active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),inset_-4px_-4px_8px_rgba(255,255,255,0.7)] transition-all duration-200 transform active:scale-95 cursor-pointer"
            title="Delete item"
          >
            <Trash2 size={14} className="xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListItem;

/*
USAGE GUIDE - ListItem Component

This component displays individual list items with edit and delete functionality.

Basic Usage:
```tsx
import ListItem from '@/components/ListItem';
import { ListItem as ListItemType } from '@/types';

function MyComponent() {
  const item: ListItemType = {
    id: '1',
    title: 'Sample Item',
    subtitle: 'This is a sample item description',
    dateCreated: new Date()
  };

  const handleEdit = (item: ListItemType) => {
    console.log('Edit item:', item);
  };

  const handleDelete = (id: string) => {
    console.log('Delete item:', id);
  };

  return (
    <ListItem
      item={item}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
```

Props:
- item (ListItemType): The item data to display
- onEdit (function): Callback when edit button is clicked
- onDelete (function): Callback when delete button is clicked

ListItemType Interface:
```tsx
interface ListItemType {
  id: string;
  title: string;
  subtitle: string;
  dateCreated: Date;
}
```

Features:
- Responsive design (mobile-first)
- Neomorphism styling with hover effects
- Confirmation dialog for delete action
- Formatted date display
- Truncated title with ellipsis
- Action buttons with tooltips
- Smooth animations and transforms

Layout:
- Mobile: Stacked layout with actions on top
- Desktop: Side-by-side layout with actions on right
- Responsive breakpoints for optimal viewing

The component automatically formats dates using browser locale and includes hover effects for better user interaction feedback.
*/
