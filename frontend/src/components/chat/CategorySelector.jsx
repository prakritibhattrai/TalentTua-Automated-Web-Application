import React, { useState, useEffect } from "react";
import axios from "axios";

const CategorySelector = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  // Fetch top-level categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/occupations/jobTitles"
        ); // Replace with your actual endpoint
        console.log(response.data.jobTitles);
        setCategories(response.data.jobTitles);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories when a category is selected
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchSubCategories = async () => {
      //   try {
      //     const response = await axios.get(
      //       `http://localhost:3000/api/categories/${selectedCategory}/subcategories`
      //     ); // Replace with your actual endpoint
      //     console.log(response.data.jobTitles);
      //     setSubCategories(response.data.jobTitles);
      //     setSubSubCategories([]); // Reset sub-subcategories
      //   } catch (error) {
      //     console.error("Error fetching subcategories:", error);
      //   }
    };

    fetchSubCategories();
  }, [selectedCategory]);

  // Fetch sub-subcategories when a subcategory is selected
  //   useEffect(() => {
  //     if (!selectedSubCategory) return;

  //     const fetchSubSubCategories = async () => {
  //       try {
  //         const response = await axios.get(
  //           `http://localhost:3000/api/subcategories/${selectedSubCategory}/subsubcategories`
  //         ); // Replace with your actual endpoint
  //         setSubSubCategories(response.data);
  //       } catch (error) {
  //         console.error("Error fetching sub-subcategories:", error);
  //       }
  //     };

  //     fetchSubSubCategories();
  //   }, [selectedSubCategory]);

  return (
    <div style={{ width: "400px", margin: "0 auto" }}>
      {/* Category Dropdown */}
      <div>
        <label>Category:</label>
        <select
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories &&
            categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
        </select>
      </div>

      {/* Subcategory Dropdown */}
      {subCategories && subCategories.length > 0 && (
        <div>
          <label>Subcategory:</label>
          <select
            value={selectedSubCategory || ""}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
          >
            <option value="">Select Subcategory</option>
            {subCategories.map((subCategory) => (
              <option key={subCategory.id} value={subCategory.id}>
                {subCategory.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Sub-Subcategory Dropdown */}
      {subSubCategories && subSubCategories.length > 0 && (
        <div>
          <label>Sub-Subcategory:</label>
          <select>
            <option value="">Select Sub-Subcategory</option>
            {subSubCategories.map((subSubCategory) => (
              <option key={subSubCategory.id} value={subSubCategory.id}>
                {subSubCategory.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
