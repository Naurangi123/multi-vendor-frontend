import React, { useContext} from 'react';
import { FcManager, FcBusinessman } from 'react-icons/fc';
import { FaHeart } from 'react-icons/fa';
import VendorHomeCard from '../Elements/VendorHomeCard';
import Navbar from './Navbar';
import { UserContext } from '../context/UserContext';

export default function DashboardHome() {

  const { role, } = useContext(UserContext);



  return (
    <>
     <Navbar/>
      {role !== 'super_admin' && <VendorHomeCard />}
    </>
  );
}
