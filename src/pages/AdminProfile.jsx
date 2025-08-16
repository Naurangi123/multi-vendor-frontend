 import React, { useState, useEffect } from 'react';
import { getSellers, updateSeller} from '../services/apiServices';
import { ToastContainer,toast } from 'react-toastify';

const AdminProfilePage = () => {
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const getAllSeller = async () => {
    try {
      setLoading(true);
      const data = await getSellers();
      setSellers(data);
      toast.success("Sellers fetched successfully");
    } catch (error) {
      toast.error("Error fetching sellers",error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllSeller();
  }, []);

  const toggleSellerStatus = async (seller) => {
    try {
      setLoading(true);
      const updated = {
        ...seller.user,
        is_indian: !seller.user?.is_indian
      };
      await updateSeller(seller.id, updated);
      await getAllSeller();
    } catch (err) {
      toast.error("Failed to update nationality.",err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (seller) => {
    try {
      setLoading(true);
      const updated = {
        ...seller.user,
        is_verified: !seller.user?.is_verified
      };
      await updateSeller(seller.id, updated);
      await getAllSeller();
    } catch (err) {
      toast.error("Failed to update verification.",err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setFormData({
      email: selectedSeller.user?.email || '',
      phone_number: selectedSeller.user?.phone_number || '',
      first_name: selectedSeller.user?.first_name || '',
      last_name: selectedSeller.user?.last_name || '',
      is_indian: selectedSeller.user?.is_indian || false
    });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateSeller(selectedSeller.id, formData);
      await getAllSeller();
      setEditing(false);
    } catch (err) {
      toast.error("Failed to update seller.",err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <ToastContainer />
      {loading && <p className="text-gray-600 mb-4">Loading...</p>}

      <div className="bg-white rounded shadow p-4 mb-10">
        <h2 className="text-xl font-semibold mb-4">All Sellers</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left text-sm">
              <th className="px-4 py-2">Verification</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Products</th>
              <th className="px-4 py-2">Earnings</th>
              <th className="px-4 py-2">Nationality</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller.id} className="border-t text-sm">
                <td className="px-4 py-2">{seller.user?.is_verified ? "Verified" : "Not Verified"}</td>
                <td className="px-4 py-2">
                  {seller.user?.first_name || 'N/A'} {seller.user?.last_name || 'N/A'}
                </td>
                <td className="px-4 py-2">{seller.user?.email || "Not Provided"}</td>
                <td className="px-4 py-2">{seller.user?.phone_number || "Not Provided"}</td>
                <td className="px-4 py-2">{seller.products?.length || 0}</td>
                <td className="px-4 py-2">{seller.earnings || "Not Provided"}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${seller.user?.is_indian ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {seller.user?.is_indian ? 'Indian' : 'Foreigner'}
                  </span>
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700"
                    onClick={() => {
                      setSelectedSeller(seller);
                      setEditing(false);
                    }}
                  >
                    View
                  </button>
                  <button
                    className="bg-purple-600 text-white text-xs px-3 py-1 rounded hover:bg-purple-700"
                    onClick={() => toggleSellerStatus(seller)}
                  >
                    Toggle Nationality
                  </button>
                  <button
                    className="bg-yellow-600 text-white text-xs px-3 py-1 rounded hover:bg-yellow-700"
                    onClick={() => toggleVerification(seller)}
                  >
                    {seller.user?.is_verified ? 'Unverify' : 'Verify'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSeller && (
        <div className="bg-white rounded shadow p-6 max-w-3xl mx-auto">
          <div className="flex justify-between mb-4">
            <h3 className="text-2xl font-bold">
              {selectedSeller.user?.first_name} {selectedSeller.user?.last_name}'s Details
            </h3>
            <button
              onClick={() => setSelectedSeller(null)}
              className="text-sm text-red-500 hover:underline"
            >
              Close
            </button>
          </div>

          {editing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
              <input
                type="text"
                className="border p-2"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                placeholder="First Name"
              />
              <input
                type="text"
                className="border p-2"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="Last Name"
              />
              <input
                type="email"
                className="border p-2"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
              />
              <input
                type="text"
                className="border p-2"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                placeholder="Phone"
              />
              <input
                type="boolean"
                className="border p-2"
                value={formData.is_indian}
                onChange={(e) => setFormData({ ...formData, is_indian: e.target.value })}
                placeholder="Nationality"
              />
              <div className="col-span-2 flex justify-end gap-2">
                <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={handleUpdate}>Save</button>
                <button className="bg-gray-400 text-white px-3 py-1 rounded" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
              <p><strong>Email:</strong> {selectedSeller.user?.email}</p>
              <p><strong>Phone:</strong> {selectedSeller.user?.phone_number}</p>
              <p><strong>Name:</strong> {selectedSeller.user?.first_name} {selectedSeller.user?.last_name}</p>
              <p><strong>Verified:</strong> {selectedSeller.user?.is_verified ? 'Yes' : 'No'}</p>
              <p><strong>Nationality:</strong> {selectedSeller.user?.is_indian ? 'Indian' : 'Foreigner'}</p>
              <div className="col-span-2 flex justify-end">
                <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={handleEdit}>Edit Info</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProfilePage;


// const AdminProfilePage = () => {
//   const [sellers, setSellers] = useState([]);
//   const [selectedSeller, setSelectedSeller] = useState(null);
//   const [editing, setEditing] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(false);

//   const getAllSeller = async () => {
//     try {
//       setLoading(true);
//       const data = await getSellers();
//       setSellers(data);
//       toast.success("seller fetched successfully")
//     } catch (error) {
//       toast.error("Error fetching sellers", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getAllSeller();
//   }, []);

//   const toggleSellerStatus = async (seller) => {
//     try {
//       setLoading(true);
//       await updateSeller(seller.id, { is_indian: !seller.user?.is_indian });
//       await getAllSeller();
//       if (selectedSeller?.id === seller.id) {
//         setSelectedSeller({ ...selectedSeller, is_indian: !seller.user?.is_indian });
//       }
//     } catch (err) {
//       toast.error("Failed to update status.",err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleVerification = async (seller) => {
//     try {
//       setLoading(true);
//       await updateSeller(seller.id, {
//         is_verified: !seller.user?.is_verified
//       });
//       await getAllSeller();
//       if (selectedSeller?.id === seller.id) {
//         setSelectedSeller({
//           ...selectedSeller,
//           user: {
//             ...selectedSeller.user,
//             is_verified: !selectedSeller.user?.is_verified
//           }
//         });
//       }
//     } catch (err) {
//       toast.error("Failed to update verification.",err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = () => {
//     setEditing(true);
//     setFormData({
//       email: selectedSeller.user?.email || '',
//       phone: selectedSeller.user?.phone || '',
//       first_name: selectedSeller.user?.first_name || '',
//       last_name: selectedSeller.user?.last_name || ''
//     });
//   };

//   const handleUpdate = async () => {
//     try {
//       setLoading(true);
//       await updateSeller(selectedSeller.id, formData);
//       await getAllSeller();
//       setEditing(false);
//     } catch (err) {
//       toast.error("Failed to update seller.",err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen p-6">
//       <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
//       <ToastContainer/>
//       {loading && <p className="text-gray-600 mb-4">Loading...</p>}

//       <div className="bg-white rounded shadow p-4 mb-10">
//         <h2 className="text-xl font-semibold mb-4">All Sellers</h2>
//         <table className="w-full table-auto border-collapse">
//           <thead>
//             <tr className="bg-gray-200 text-left text-sm">
//               <th className="px-4 py-2">Is Indian</th>
//               <th className="px-4 py-2">Name</th>
//               <th className="px-4 py-2">Email</th>
//               <th className="px-4 py-2">Phone</th>
//               <th className="px-4 py-2">Products</th>
//               <th className="px-4 py-2">Earnings</th>
//               <th className="px-4 py-2">Status</th>
//               <th className="px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {sellers.map((seller) => (
//               <tr key={seller.id} className="border-t text-sm">
//                 <td className="px-4 py-2">{seller.user?.is_verified ? "Verified" : "Not Verified"}</td>
//                 <td className="px-4 py-2">
//                   {seller.user?.first_name || 'N/A'} {seller.user?.last_name || 'N/A'}
//                 </td>
//                 <td className="px-4 py-2">{seller.user?.email || "Not Provided"}</td>
//                 <td className="px-4 py-2">{seller.user?.phone || "Not Provided"}</td>
//                 <td className="px-4 py-2">{seller.products?.length || 0}</td>
//                 <td className="px-4 py-2">{seller.earnings || "Not Provided"}</td>
//                 <td className="px-4 py-2">
//                   <span className={`px-2 py-1 text-xs rounded-full ${seller.is_verified ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
//                     {seller.is_indian ? 'Indian' : 'Foreigner'}
//                   </span>
//                 </td>
//                 <td className="px-4 py-2 space-x-2">
//                   <button
//                     className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700"
//                     onClick={() => {
//                       setSelectedSeller(seller);
//                       setEditing(false);
//                     }}
//                   >
//                     View
//                   </button>
//                   <button
//                     className={`text-white text-xs px-3 py-1 rounded ${seller.user?.is_indian ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
//                     onClick={() => toggleSellerStatus(seller)}
//                   >
//                     {seller.is_indian ? 'Indian' : 'Foreigner'}
//                   </button>
//                   <button
//                     className={`text-white text-xs px-3 py-1 rounded ${seller.user?.is_verified ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
//                     onClick={() => toggleVerification(seller)}
//                   >
//                     {seller.user?.is_indian ? 'Unverify' : 'Verify'}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Seller Detail Card */}
//       {selectedSeller && (
//         <div className="bg-white rounded shadow p-6 max-w-3xl mx-auto">
//           <div className="flex justify-between mb-4">
//             <h3 className="text-2xl font-bold">
//               {selectedSeller.user?.first_name} {selectedSeller.user?.last_name}'s Details
//             </h3>
//             <button
//               onClick={() => setSelectedSeller(null)}
//               className="text-sm text-red-500 hover:underline"
//             >
//               Close
//             </button>
//           </div>

//           {editing ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
//               <input
//                 type="text"
//                 className="border p-2"
//                 value={formData.first_name}
//                 onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
//                 placeholder="First Name"
//               />
//               <input
//                 type="text"
//                 className="border p-2"
//                 value={formData.last_name}
//                 onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
//                 placeholder="Last Name"
//               />
//               <input
//                 type="email"
//                 className="border p-2"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 placeholder="Email"
//               />
//               <input
//                 type="text"
//                 className="border p-2"
//                 value={formData.phone}
//                 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                 placeholder="Phone"
//               />
//               <div className="col-span-2 flex justify-end gap-2">
//                 <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={handleUpdate}>Save</button>
//                 <button className="bg-gray-400 text-white px-3 py-1 rounded" onClick={() => setEditing(false)}>Cancel</button>
//               </div>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
//               <p><strong>Email:</strong> {selectedSeller.user?.email}</p>
//               <p><strong>Phone:</strong> {selectedSeller.user?.phone}</p>
//               <p><strong>Name:</strong> {selectedSeller.user?.first_name} {selectedSeller.user?.last_name}</p>
//               <p><strong>Verified:</strong> {selectedSeller.user?.is_indian ? 'Yes' : 'No'}</p>
//               <p><strong>Status:</strong> {selectedSeller.isActive ? 'Active' : 'Inactive'}</p>
//               <div className="col-span-2 flex justify-end">
//                 <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={handleEdit}>Edit Info</button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminProfilePage;
