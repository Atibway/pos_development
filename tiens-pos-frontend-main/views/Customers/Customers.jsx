import React, { useEffect, useState } from 'react';
import '../../assets/styles/main.css';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { BsSearch } from 'react-icons/bs';
import Select from 'react-select';
import Button2 from '../../components/Button2';
import ButtonSecondary from '../../components/ButtonSecondary';
import CustomersTable from '../../components/Customers/CustomersTable';
import axiosInstance from '../../axios-instance';
import Swal from "sweetalert2";
import Loader from '../../components/Loader';
import { useFeedback } from '../../hooks/feedback';

const Customers = () => {
  const { toggleFeedback } = useFeedback();

  // Manage customers locally instead of Redux
  const [customers, setCustomers] = useState([]);

  // Modal states
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [posting, setPosting] = useState(false);

  // Packages and selection
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Search inputs
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchPackage, setSearchPackage] = useState(null);

  const [loading, setLoading] = useState(false);

  // Fetch customers (all or filtered)
  const fetchCustomers = async (searchQuery = "") => {
    setLoading(true);
    try {
      let url = '/customers';
      if (searchQuery) {
        url += `?search=${encodeURIComponent(searchQuery)}`;
      }
      const res = await axiosInstance.get(url);
      if (res.data.status) {
        setCustomers(res.data.payload);
      } else {
        setCustomers([]);
        toggleFeedback("error", { title: "Error", message: "Failed to fetch customers" });
      }
    } catch (error) {
      toggleFeedback("error", { title: "Error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await axiosInstance.get("/packages");
      if (res.data.status) {
        const options = res.data.payload.map(pkg => ({
          value: pkg.id,
          label: pkg.name,
        }));
        setPackages(options);
      }
    } catch (error) {
      console.error("Failed to fetch packages", error);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchCustomers();
    fetchPackages();
  }, []);

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const postCustomer = async () => {
    if (!name || !email || !phone || !location) {
      toggleFeedback("error", { title: "Error", message: "Please fill all fields" });
      return;
    }
    try {
      setPosting(true);
      const response = await axiosInstance.post("/customers", {
        name,
        email,
        phone,
        location,
        packageId: selectedPackage?.value || null,
      });
      if (response.data.status) {
        toggleFeedback("success", { title: "Success", message: "Distributor added successfully" });
        await fetchCustomers(); // refresh list after adding
        setName(""); setEmail(""); setPhone(""); setLocation(""); setSelectedPackage(null);
        closeModal();
      } else {
        toggleFeedback("error", { title: "Error", message: response.data.payload });
      }
    } catch (error) {
      toggleFeedback("error", { title: "Error", message: error.message });
    } finally {
      setPosting(false);
    }
  };

  const deleteCustomer = (customer) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.delete(`/customers/${customer.id}`);
          if (response.data.status) {
            await fetchCustomers(); // refresh after deletion
            Swal.fire({ icon: "success", title: "Deleted!", text: "Distributor deleted.", timer: 1500, showConfirmButton: false });
          }
        } catch (error) {
          toggleFeedback("error", { title: "Error", message: "Failed to delete distributor" });
        }
      }
    });
  };

  // Search handler combining all search inputs
  const handleSearch = async () => {
    const searchQuery = [
      searchName,
      searchEmail,
      searchPhone,
      searchLocation,
      searchPackage?.label || ""
    ].filter(Boolean).join(" ");

    await fetchCustomers(searchQuery);
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchName, searchEmail, searchPhone, searchLocation, searchPackage]);

  return (
    <div className="w-full bg-white rounded-md shadow">
      <div className="p-3">
        {/* Header & Search Inputs */}
<div className="flex flex-wrap gap-3 items-center justify-between mb-4">
  <h1 className="text-secondary font-semibold text-2xl mt-5">Distributors</h1>
  
  {/* Grow input to take remaining space */}
  <InputField
    className="flex-grow min-w-[300px] px-4 py-3 text-lg"
    placeholder="Search Name, Phone, Location, ID"
    value={searchName}
    onChange={e => setSearchName(e.target.value)}
  />
  
  <Button2 value="Add Distributor" onClick={openModal} />
</div>


        {/* Modal for Adding Distributor */}
        {modal && (
          <div className="z-50 bg-black/50 fixed inset-0 flex items-start justify-center">
            <div className="w-3/12" onClick={closeModal}></div>
            <div className="w-6/12 bg-white rounded-lg mt-[10vh] shadow-lg">
              <div className="flex justify-between items-center p-4 bg-gray-100 rounded-t-lg">
                <h2 className="text-xl font-semibold text-primary">Add Distributor</h2>
                <button onClick={closeModal} className="text-xl cursor-pointer">×</button>
              </div>
              <div className="p-4 flex gap-4">
                <div className="flex-1">
                  <InputField label="Name Of Distributor" placeholder="Enter Name" value={name} onChange={e => setName(e.target.value)} />
                  <InputField label="ID" placeholder="Enter Distributor ID" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="flex-1">
                  <InputField label="Phone Number" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
                  <InputField label="Location" placeholder="Enter Location" value={location} onChange={e => setLocation(e.target.value)} />
                  <label className="text-sm text-gray-500 mb-1 mt-2 block">Attach Package</label>
                  <Select options={packages} value={selectedPackage} onChange={setSelectedPackage} placeholder="Select Package" isClearable />
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-100 rounded-b-lg">
                <ButtonSecondary value="Close" onClick={closeModal} />
                <div className="w-36">
                  {posting ? <Loader /> : <Button value="Add Distributor" onClick={postCustomer} />}
                </div>
              </div>
            </div>
            <div className="w-3/12" onClick={closeModal}></div>
          </div>
        )}

        {/* Customers Table or Loader */}
        {loading ? (
          <div className="flex justify-center py-10"><Loader /></div>
        ) : (
          <CustomersTable customersData={customers} onDelete={deleteCustomer} />
        )}
      </div>
    </div>
  );
};

export default Customers;
