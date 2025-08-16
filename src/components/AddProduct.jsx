import React, { useState, useEffect, useContext } from "react";
import { getCategories, addProduct } from "../services/apiServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const CreateProduct = () => {
  const { user } = useContext(UserContext);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    brand:'',
    rating:0.0,
    category_id: '',
    stock: "",
    seller: user ? user.id : "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [catItems, setCatItems] = useState([]);

  const navigate = useNavigate();

  const fetchCategory = async () => {
    try {
      const data = await getCategories();
      setCatItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 3) {
      toast.error("You can only upload up to 3 images.");
      return;
    }

    const newImageFiles = [...imageFiles, ...files];
    const newImagePreviews = newImageFiles.map((file) => URL.createObjectURL(file));

    setImageFiles(newImageFiles);
    setImagePreviews(newImagePreviews);
  };

  const handleImageRemove = (index) => {
    const updatedFiles = [...imageFiles];
    updatedFiles.splice(index, 1);

    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);

    setImageFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData();

    // Append product details to FormData
    Object.keys(productData).forEach((key) => {
      if (key !== 'images') {
        formData.append(key, productData[key]);
      }
    });

    // Append each selected image to FormData
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const success = await addProduct(formData);
      toast.success("Product added successfully");
      if (success) {
        setTimeout(() => {
          navigate("/products/manage-product");
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Create Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="name">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="price">
            Brand
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={productData.brand}
            onChange={handleInputChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="description">
            Product Description
          </label>
          <textarea
            id="description"
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="price">
            Price (₹)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={productData.price}
            onChange={handleInputChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="stock">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={productData.stock}
            onChange={handleInputChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
            required
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="price">
            Rating
          </label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={productData.rating}
            onChange={handleInputChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="category">
            Category
          </label>
          <select
            id="category_id"
            name="category_id"
            value={productData.category_id}
            onChange={handleInputChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
            required
          >
            {catItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="images">
            Product Images (Max 3)
          </label>
          <input
            type="file"
            id="image-upload"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            multiple
          />
        </div>

        <div className="image-previews">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="image-preview">
              <img src={preview} alt={`preview-${index}`} />
              <button type="button" onClick={() => handleImageRemove(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className={`mt-4 py-2 px-6 rounded-lg text-white ${isSaving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {isSaving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;

 
