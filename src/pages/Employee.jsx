import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { getAllSellers } from "../services/apiServices";

const BASE_URL='http://localhost:8005'
const fallbackAvatar = "https://randomuser.me/api/portraits/med/men/62.jpg";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
    avatar: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  // const [filterDept, setFilterDept] = useState("All");

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // const fetchSeller = async () => {
  //   try {
  //     const data = await getAllSellers();
  //     const users = data.users
  //     const sellers = data.sellers

  //     const mappedEmployees = sellers && users.map((seller) => {
  //       const user = seller.user || {};
  //       const fullName =
  //         (user.first_name && user.last_name)
  //           ? `${user.first_name} ${user.last_name}`
  //           : user.username || "Unknown";
  //       return {
  //         id: seller.id,
  //         name: fullName,
  //         role: seller?.user?.role,
  //         indian: seller?.user?.is_indian,
  //         verify: seller?.user?.is_verified,
  //         avatar: "",
  //       };
  //     });
  //     setEmployees(mappedEmployees);
  //   } catch (error) {
  //     toast.error(error.message || "Failed to fetch sellers.");
  //   }
  // };


  const fetchSeller = async () => {
    try {
      const data = await getAllSellers();
      const users = data.users || [];
      const sellers = data.sellers || [];
  
      const sellerMap = new Map();
      sellers.forEach((seller) => {
        if (seller.user) {
          sellerMap.set(seller.user.id, seller.business_name);
        }
      });
  
      const mappedEmployees = users.map((user) => {
        const fullName = user.first_name || user.last_name
          ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
          : user.username || "Unknown";
  
        return {
          id: user.id,
          name: fullName,
          role: user.role || "Unknown",
          indian: user.is_indian ?? false,
          verify: user.is_verified ?? false,
          avatar: user.user_profile
            ? `${BASE_URL}${user.user_profile}`
            : fallbackAvatar,
          business_name: sellerMap.get(user.id) || "End User",
        };
      });
  
      setEmployees(mappedEmployees);
    } catch (error) {
      toast.error(error.message || "Failed to fetch users and sellers.");
    }
  };
  
  useEffect(() => {
    fetchSeller();
  }, []);

  const openAddModal = () => {
    setFormData({ name: "", role: "", avatar: "" });
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const openEditModal = (employee) => {
    setFormData(employee);
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    setFormData({ first_name: "", role: "", avatar: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    const { name, role, department } = formData;
    if (!name.trim() || !role.trim() || !department.trim()) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (editingEmployee) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editingEmployee.id ? { ...emp, ...formData } : emp
        )
      );
      toast.success("Employee updated successfully!");
    } else {
      const newEmployee = { ...formData };
      setEmployees((prev) => [newEmployee, ...prev]);
      toast.success("Employee added successfully!");
    }

    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      toast.success("Employee deleted.");
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      emp.name.toLowerCase().includes(searchLower) ||
      emp.role.toLowerCase().includes(searchLower);

    // const matchesDept = filterDept === "All" || emp.department === filterDept;

    // return matchesSearch && matchesDept;
    return matchesSearch;
  });


  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  // Reset current page if it exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <div className="flex h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex-1 bg-white rounded-lg shadow-md p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Employees</h2>
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus /> Add Employee
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/4"
          >
            <option value="All">All Departments</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Analytics">Analytics</option>
            <option value="Sales">Sales</option> 
          </select> */}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Avatar</th>
                <th className="p-3">Name</th>
                <th className="p-3">Role</th>
                <th className="p-3">Business Name</th>
                <th className="p-3">Is Indian</th>
                <th className="p-3">Is Verified</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((emp) => (
                  <tr key={emp.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3">{emp.id}</td>
                    <td className="p-3">
                      <img
                        src={emp.avatar || fallbackAvatar}
                        alt={emp.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </td>
                    <td className="p-3">{emp.name}</td>
                    <td className="p-3">{emp.role}</td>
                    <td className="p-3">{emp.business_name}</td>
                    <td className="p-3">{emp.indian ? 'Indian' : 'Foreigner'}</td>
                    <td className="p-3">{emp.verify ? 'Yes' : 'No'}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => openEditModal(emp)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded flex items-center gap-1"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1"
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-6 text-gray-500 font-semibold"
                  >
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-4">
            <button
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <h3 className="text-xl font-semibold mb-4">
              {editingEmployee ? "Edit Employee" : "Add Employee"}
            </h3>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Name*"
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="role"
                value={formData.role}
                placeholder="Role*"
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="avatar"
                value={formData.avatar}
                placeholder="Avatar URL (optional)"
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
