import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AutoSearch = createContext();

export const useAutoSearch = () => useContext(AutoSearch);

export const AutoSearchFilter = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [category, setCategory] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [searchProduct, setSearchProduct] = useState([]);
  const itemsPerPage = 15;

  const filterSearch = {
    query: searchQuery,
    category,
    min_value: minValue,
    max_value: maxValue,
    currentPage,
  };

  const apiUrl = `http://localhost:8005/api/filter-product/?${Object.entries(filterSearch)
    .filter(([key, value]) => value)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&")}&page=${currentPage}&limit=${itemsPerPage}`;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(apiUrl);
        setSearchProduct(response.data);
         console.log("hdsfdf", response.data.length)
        setPageCount(Math.ceil(response.data.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [apiUrl, currentPage]);
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  return (
    <AutoSearch.Provider
      value={{
        searchQuery,
        setSearchQuery,
        category,
        setCategory,
        minValue,
        setMinValue,
        maxValue,
        setMaxValue,
        searchProduct,
        setSearchProduct,
        currentPage,
        setCurrentPage,
        pageCount,
        setPageCount,
        handlePageChange
      }}
    >
      {children}
    </AutoSearch.Provider>
  );
};
