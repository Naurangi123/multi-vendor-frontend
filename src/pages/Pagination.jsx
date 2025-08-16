import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import img from '../assets/images/shopcarausel1.png';
import { fetchProducts } from '../services/apiServices';
import { toast, ToastContainer } from 'react-toastify';


const fallbackImg=img

export default function Pagination() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [products, setProducts] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);

  const ItemsPerPage = 25;

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts(currentPage);
        const products = data.results;
        const total = data.count || 0;
        const totalPages = Math.max(1, Math.ceil(total / ItemsPerPage));
        setProducts(products);
        setPageCount(totalPages);
      } catch (error) {
        toast.error(error)
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [currentPage]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const productDetail = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      {loading ? (
        <p className="text-center text-xl">Loading...</p>
      ) : (
        <>
        <h1 className='text-4xl md:text-5xl font-bold text-center text-gray-900 mb-10'>All Products</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => productDetail(product.id)}
                className="cursor-pointer bg-white rounded-lg overflow-hidden transition-all duration-300 relative"
              >
                <img
                  src={
                    product.images?.[0]?.image
                      ? `http://localhost:8005${product.images[0].image}`
                      : fallbackImg
                  }
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-48 object-cover"
                  onError={(e) => (e.target.src = fallbackImg)}
                />
                <span className="absolute top-2 left-2 bg-blue-100 text-black text-xs font-semibold px-2 py-1 rounded">
                  {product.brand || "No Brand"}
                </span>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 truncate">{product.description}</p>
                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.14 3.497a1 1 0 00.95.69h3.686c.969 0 1.371 1.24.588 1.81l-2.987 2.17a1 1 0 00-.364 1.118l1.14 3.497c.3.921-.755 1.688-1.538 1.118l-2.987-2.17a1 1 0 00-1.175 0l-2.987 2.17c-.783.57-1.838-.197-1.538-1.118l1.14-3.497a1 1 0 00-.364-1.118L2.685 8.924c-.783-.57-.38-1.81.588-1.81h3.686a1 1 0 00.95-.69l1.14-3.497z" />
                      </svg>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xl font-bold text-gray-900">${product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <ReactPaginate
            previousLabel="Previous"
            nextLabel="Next"
            pageCount={pageCount}
            onPageChange={handlePageChange}
            forcePage={currentPage}
            containerClassName="flex justify-center items-center mt-6 space-x-2"
            pageClassName="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
            previousClassName="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
            nextClassName="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
            activeClassName="bg-blue-500 text-white"
            disabledClassName="text-gray-400 cursor-not-allowed"
          />
        </>
      )}
    </div>
  );
}
