import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import logo from '../assets/react.svg'
import {
  fetchProductById,
  getRelatedProducts,
  addToCart,
  getCurrentLocationDetails,
} from "../services/apiServices";


const BASE_URL = "http://localhost:8005";

const ImageGallery = ({ images, selectedImage, setSelectedImage }) => {
  return (
    <div>
      <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
        <img
          src={selectedImage}
          alt="Product main"
          className="w-2xl h-[540px] object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex space-x-3">
        {images.map((img) => (
          <button
            key={img.id}
            className={`w-16 h-16 rounded-lg border overflow-hidden focus:outline-none hover:ring-2 transition ${selectedImage === img.image
              ? "border-indigo-600 ring-2 ring-indigo-500"
              : "border-gray-300"
              }`}
            onClick={() => setSelectedImage(img.image)}
            aria-label={`Thumbnail ${img.id}`}
          >
            <img
              src={img.image}
              alt={`Thumbnail ${img.id}`}
              className="w-full h-full object-cover"
              loading="lazy"
              placeholder="blur"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // const { user }=useContext(UserContext)

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [location, setLocation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("No product ID provided");
      setLoading(false);
      return;
    }

    fetchProductById(id)
      .then((data) => {
        const images = data.images.length
          ? data.images.map((img) => ({
            id: img.id,
            image: img.image.startsWith("http")
              ? img.image
              : BASE_URL + img.image,
          }))
          : [{ id: 0, image: "/placeholder-image.png" }];

        setProduct({
          id: data.id,
          name: data.name,
          description: data.description,
          price: parseFloat(data.price),
          images,
          stock: data.stock,
          rating: data.rating,
          availability: data.stock > 0 ? "In stock" : "Out of stock",
          shipping: "Free shipping on orders over ₹50",
          returns: "30-day hassle-free returns",
        });
        setSelectedImage(images[0].image);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (id) {
      getRelatedProducts(id)
        .then(setRelatedProducts)
        .catch((error) =>
          console.error("Error fetching related products:", error)
        );
    }
  }, [id]);

  const fetchLocation = async () => {
    try {
      const data = await getCurrentLocationDetails();
      setLocation(data)
    } catch (error) {
      toast.error(error)
    }
  }

  useEffect(() => {
    fetchLocation()
  }, [])


  const handleCart = async () => {
    try {
      const data = { product_id: product.id, quantity: 1 };


      await addToCart(data);
      toast.success(`Added "${product.name}" to cart`);
      setTimeout(() => {
        navigate('/productCart')
      }, 2000)
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.detail);
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    }
  };

  const handleBuyNow = async () => {
    await handleCart();
    setTimeout(() => navigate("/checkout"), 1000);
  };


  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading product details...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        Error: {error}
      </div>
    );

  return (
    <main className="bg-gray-50 min-h-screen p-6 flex flex-col items-center">
      <ToastContainer />
      <article className="max-w-7xl w-full mx-auto bg-white rounded-lg overflow-hidden md:flex md:gap-6 mb-10">
        <section className="md:w-1/2 p-4">
          <ImageGallery
            className="w-full h-28 object-contain"
            images={product.images}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
        </section>

        <section className="md:w-1/2 p-4 flex flex-col justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              {product.description}
            </h1>

            <p className="text-2xl font-semibold text-indigo-600 mb-2">
              ₹{product.price}
            </p>

            <p className="text-gray-700 mb-4 leading-relaxed">
              {product.name}
            </p>

            <div className="flex items-center mt-1 space-x-1">
              <img src={logo} alt="Prime" className="h-4" />
              <span className="text-sm text-blue-600 font-medium">Fatse</span>
            </div>
            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, i) => {
                const fullStars = Math.floor(product.rating);
                const decimal = product.rating - fullStars;
                let starType = 'empty';
                if (i < fullStars) starType = 'full';
                else if (i === fullStars && decimal >= 0.25 && decimal < 0.75) starType = 'half';

                return (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${starType !== 'empty' ? 'text-yellow-500' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    {starType === 'half' ? (
                      <path d="M10 15l-5.878 3.09L5.804 12 1 7.91l6.09-.89L10 1l2.91 6.02L19 7.91 14.196 12l1.682 6.09zM10 13.75V3.6l-1.41 3.02-3.33.49 2.41 2.35-.57 3.31L10 13.75z" />
                    ) : (
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0L12.347 6.3l3.682.535c.969.141 1.356 1.33.654 2.013l-2.665 2.6.63 3.674c.165.96-.85 1.688-1.707 1.237L10 15.347l-3.29 1.73c-.857.451-1.872-.277-1.707-1.237l.63-3.674L2.97 8.848c-.703-.683-.315-1.872.654-2.013l3.682-.535L9.049 2.927z" />
                    )}
                  </svg>
                );
              })}
              <span className="ml-2 text-gray-600 text-sm">({product.rating})</span>
            </div>
            <p className="text-green-600 text-md font-medium mt-1">FREE Delivery</p>
            <p
              className={`text-sm font-medium mt-1 ${product.stock > 10
                ? 'text-green-600'
                : product.stock > 0
                  ? 'text-orange-500'
                  : 'text-red-600'
                }`}
            >
              {product.stock > 10
                ? 'In stock'
                : product.stock > 0
                  ? `Only ${product.stock} left in stock`
                  : 'Out of stock'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Ships from <span className="font-medium">{location.city} - {location.country}</span>, Sold by{' '}
              <span className="font-medium">{product.seller?.name}</span>
            </p>
            <div className="space-y-2 mt-4">
              <button
                disabled={product.stock === 0}
                className={`w-full ${product.stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
                  } text-white font-semibold py-3 rounded-md shadow-md transition-colors duration-200`}
                onClick={handleCart}
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>

              <button
                disabled={product.stock === 0}
                className={`w-full ${product.stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
                  } text-white font-semibold py-3 rounded-md shadow-md transition-colors duration-200`}
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
          </div>

          <aside className="mt-2 text-sm text-gray-600 space-y-2">
            <p>
              <strong>Shipping:</strong> {product.shipping}
            </p>
            <p>
              <strong>Returns:</strong> {product.returns}
            </p>
            <p>
              <strong>Availability:</strong> {product.availability}
            </p>
          </aside>
        </section>
      </article>
      <div className="max-w-7xl w-full mt-10">
        <div className="text-center text-3xl py-2">
          <div className="inline-flex gap-2 items-center mb-3">
            <p className="text-gray-500 font-[outfit]">RELATED <span className="text-gray-700 font-medium font-[outfit]">PRODUCT</span> </p>
            <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map((rp) => (
            <div
              key={rp.id}
              onClick={() => navigate(`/product/${rp.id}`)}
              className="bg-white p-4 transition duration-300 shadow-lg"
            >
              <div className="relative transform transition-transform duration-300 hover:scale-105">
                <img
                  src={`http://localhost:8005${rp.images[0]?.image}`}
                  alt={rp.name}
                  loading="lazy"
                  className="w-full h-48 object-cover"
                />
                <span className="absolute top-2 left-2 bg-blue-100 text-black text-xs font-semibold px-2 py-1 rounded">
                  {rp.brand || 'Brand'}
                </span>
              </div>

              <div className="mt-4 text-left">
                <h4 className="text-md font-semibold text-gray-800 truncate">{rp.name}</h4>
                <div className="flex items-center mt-1 text-yellow-500 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(rp.rating) ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.497a1 1 0 00.95.69h3.686c.969 0 1.371 1.24.588 1.81l-2.987 2.17a1 1 0 00-.364 1.118l1.14 3.497c.3.921-.755 1.688-1.538 1.118l-2.987-2.17a1 1 0 00-1.175 0l-2.987 2.17c-.783.57-1.838-.197-1.538-1.118l1.14-3.497a1 1 0 00-.364-1.118L2.685 8.924c-.783-.57-.38-1.81.588-1.81h3.686a1 1 0 00.95-.69l1.14-3.497z" />
                    </svg>
                  ))}
                  {rp.rating}
                </div>
                <p className="text-lg font-bold text-green-600 mt-1">₹{rp.price}</p>

                <div className="mt-4 flex justify-between gap-2">
                  <button
                    onClick={() => navigate(`/product/${rp.id}`)}
                    className="flex-1 bg-gray-100 text-gray-800 border border-gray-300 px-3 py-2 text-sm rounded hover:bg-gray-200 transition"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
