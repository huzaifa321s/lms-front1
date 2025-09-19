import { useState } from "react";
import {Select,SelectValue,SelectTrigger,SelectContent } from '@/components/ui/select'

export default function CategoryFilter({ categories }) {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleChange = (value) => {
    setSelectedCategory(value);
    
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-gray-700">Filter by Category:</p>
        <Select value={selectedCategory} onValueChange={handleChange}>
          <SelectTrigger className="w-56 bg-white hover:bg-indigo-50 shadow-md rounded-lg transition-all duration-200">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent className="bg-white rounded-lg shadow-lg">
            {/* {categories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))} */}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}