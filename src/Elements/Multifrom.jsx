import React, { useState, Suspense } from "react";
import { submitSellerStore } from "../services/apiServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export default function Multifrom() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    business_name: "",
    category: "",
    store_discription: "",
    store_address: "",
    gst_no: "",
  });
  const [bankData, setBankData] = useState({
    bank_name: "",
    account_holder_name: "",
    account_no: "",
    ifsc_code: "",
    bank_branch_name: ""
  })
  const navigate = useNavigate()
  const handlInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;

    setBankData((prevData) =>
    ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await submitSellerStore(formData);
      console.log("Store updated successfully:", res.data);
      console.log(res)

      nextStep();


    } catch (error) {
      console.error("Error updating store:", error);
    }
  };
  const handleBankSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await submitSellerStore(bankData);
      console.log("Bank updated successfully", res.data)
      toast.success("Profile Updated ")
      navigate('/profile')
    } catch (error) {
      console.error("Error updating store:", error);
    }

  }
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div>
      <div className="flex justify-center mb-6 gap-6">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold text-white ${s === step
                ? "bg-blue-500"
                : s < step
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
          >
            {s}
          </div>
        ))}
      </div>

      {step === 0 && (
        <>
          <div className="flex justify-center items-center min-h-screen  m-4  ">
            <div className="w-full lg:w-2/3 p-8 bg-white shadow-lg rounded-lg">
              <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
                Store Details
              </h2>

              <form method="post" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="fullName"
                      className="text-sm font-medium text-gray-600"
                    >
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handlInputChange}
                      required
                      className="mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-600"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handlInputChange}
                      className="mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Business Name */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="businessName"
                      className="text-sm font-medium text-gray-600"
                    >
                      Business Name
                    </label>
                    <input
                      id="business_name"
                      type="text"
                      required
                      name="business_name"
                      value={formData.business_name}
                      onChange={handlInputChange}
                      className="mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Category */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="category"
                      className="text-sm font-medium text-gray-600"
                    >
                      Category
                    </label>
                    {/* <select
                      id="category"
                      required
                      className="mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select a category</option>
                      <option value="electronics">Electronics</option>
                      <option value="fashion">Fashion</option>
                      <option value="home">Home & Kitchen</option>
                      <option value="beauty">Beauty & Personal Care</option>
                      <option value="sports">Sports & Outdoors</option>
                    </select> */}
                    <input
                      id="category"
                      type="text"
                      required
                      name="category"
                      value={formData.category}
                      onChange={handlInputChange}
                      className="mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Store Description */}
                  <div className="flex flex-col sm:col-span-2">
                    <label
                      htmlFor="storeDescription"
                      className="text-sm font-medium text-gray-600"
                    >
                      Store Description
                    </label>
                    <textarea
                      id="storeDescription"
                      rows={3}
                      required
                      name="store_discription"
                      value={formData.store_discription}
                      onChange={handlInputChange}
                      className="mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Store Address */}
                  <div className="flex flex-col sm:col-span-2">
                    <label
                      htmlFor="storeAddress"
                      className="text-sm font-medium text-gray-600"
                    >
                      Store Address
                    </label>
                    <textarea
                      id="storeAddress"
                      rows={3}
                      name="store_address"
                      value={formData.store_address}
                      onChange={handlInputChange}
                      required
                      placeholder="Enter address"
                      className="mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* TIN */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="taxId"
                      className="text-sm font-medium text-gray-600"
                    >
                      Tax Identification Number (TIN)
                    </label>
                    <input
                      id="taxId"
                      type="text"
                      name="gst_no"
                      value={formData.gst_no}
                      onChange={handlInputChange}
                      required
                      className="mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex mt-6  gap-2 justify-end">
                  <button
                    type="button"
                    className="py-2 px-6 bg-blue-500 text-white rounded hover:bg-blue-600 transition"

                  >
                    Save
                  </button>

                  <button

                    type="submit"

                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Next
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <div className="flex justify-center items-center min-h-screen  m-4  ">
            <div className="w-full lg:w-2/3 p-8 bg-white shadow-lg rounded-lg">
              <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
                Bank Account Details
              </h2>

              <form method="post" onSubmit={handleBankSubmit}>
                {/* Bank Name */}

                <div className="flex flex-col">

                </div>
                <div className="mb-4">
                  <label htmlFor="bankName" className="block text-sm font-medium text-gray-600">
                    Bank Name
                  </label>
                  <input
                    id="bankName"
                    type="text"
                    name="bank_name"
                    value={bankData.bank_name}
                    onChange={handleBankChange}
                    className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your bank's name"
                  />
                </div>

                {/* Account Holder Name */}
                <div className="mb-4">
                  <label htmlFor="accountHolder" className="block text-sm font-medium text-gray-600">
                    Account Holder Name
                  </label>
                  <input
                    id="accountHolder"
                    type="text"
                    name="account_holder_name"
                    value={bankData.account_holder_name}
                    onChange={handleBankChange}
                    className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter account holder's name"
                  />
                </div>

                {/* Account Number */}
                <div className="mb-4">
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-600">
                    Account Number
                  </label>
                  <input
                    id="accountNumber"
                    type="text"
                    name="account_no"
                    value={formData.account_no}
                    onChange={handleBankChange}
                    className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your account number"
                  />
                </div>

                {/* IFSC Code */}
                <div className="mb-4">
                  <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-600">
                    IFSC Code
                  </label>
                  <input
                    id="ifscCode"
                    type="text"
                    name="ifsc_code"
                    value={bankData.ifsc_code}
                    onChange={handleBankChange}
                    className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter IFSC code"
                  />
                </div>

                {/* Bank Branch */}
                <div className="mb-4">
                  <label htmlFor="bankBranch" className="block text-sm font-medium text-gray-600">
                    Bank Branch
                  </label>
                  <input
                    id="bankBranch"
                    type="text"
                    name="bank_branch_name"
                    value={bankData.bank_branch_name}
                    onChange={handleBankChange}
                    className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter branch name"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
