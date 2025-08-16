/* eslint-disable no-unused-vars */
import React, { useState,useContext,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitSellerStore } from "../services/apiServices"; 
// import { useCurrentUser } from "../hooks/useUser";
import { UserContext } from "../context/UserContext";

export default function SellerStore({ nextStep }) {
  const navigate = useNavigate();
  // const {user}=useCurrentUser()
  const {user}= useContext(UserContext)

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    business_name: '',
    category: '',
    phone_no:'',
    storeDescription: '',
    storeAddress: '',
    taxId: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        full_name: user.username || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      await submitSellerStore(data);
      nextStep(); 
    } catch (error) {
      setErrorMsg("Failed to submit store details. Please try again.");
      console.error("Submission Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-h-screen py-10">
     
    </div>
  );
}
