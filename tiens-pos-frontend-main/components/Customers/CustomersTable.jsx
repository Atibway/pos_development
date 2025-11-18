import React, { useState, useEffect } from 'react'
import { BsPencilSquare, BsTrash } from 'react-icons/bs'
import InputField from '../InputField'
import Button from '../Button'
import ButtonLoader from '../ButtonLoader'
import ButtonSecondary from '../ButtonSecondary'
import Select from 'react-select'
import axiosInstance from '../../axios-instance'
import Swal from "sweetalert2"
import { useFeedback } from '../../hooks/feedback'
import { useDispatch } from 'react-redux'
import { getCustomers } from '../../store/slices/store'

const CustomersTable = ({ customersData }) => {
  const dispatch = useDispatch()
  const { toggleFeedback } = useFeedback()

  const [packages, setPackages] = useState([])
  const [modalEdit, setModalEdit] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await axiosInstance.get('/packages')
        if (res.data.status) {
          setPackages(res.data.payload.map(pkg => ({
            value: pkg.id,
            label: pkg.name
          })))
        }
      } catch (err) {
        console.error('Error fetching packages', err)
      }
    }
    fetchPackages()
  }, [])

  const openEditModal = (customer) => {
    setEditingCustomer(customer)
    setName(customer.name)
    setEmail(customer.email)
    setPhone(customer.phone)
    setLocation(customer.location)
    setSelectedPackage(customer.package ? {
      value: customer.package.id,
      label: customer.package.name
    } : null)
    setModalEdit(true)
  }

  const closeEditModal = () => {
    setModalEdit(false)
    setEditingCustomer(null)
    setPosting(false)
  }

  const updateCustomer = async () => {
    if (!editingCustomer) return
    setPosting(true)
    try {
      const res = await axiosInstance.put('/customers', {
        id: editingCustomer.id,
        name,
        email,
        phone,
        location,
        packageId: selectedPackage?.value || null
      })
      if (res.data.status) {
        toggleFeedback('success', { title: 'Success', text: 'Customer updated' })
        dispatch(getCustomers())
        closeEditModal()
      } else {
        toggleFeedback('error', { title: 'Error', text: res.data.payload })
      }
    } catch (err) {
      toggleFeedback('error', { title: 'Error', text: err.message })
    } finally {
      setPosting(false)
    }
  }

  const deleteCustomer = (customer) => {
    Swal.fire({
      title: 'Confirm deletion',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete'
    }).then(async result => {
      if (!result.isConfirmed) return
      try {
        const res = await axiosInstance.delete(`/customers/${customer.id}`)
        if (res.data.status) {
          toggleFeedback('success', { title: 'Deleted', text: 'Customer removed' })
          dispatch(getCustomers())
        } else {
          toggleFeedback('error', { title: 'Error', text: res.data.payload })
        }
      } catch (err) {
        toggleFeedback('error', { title: 'Error', text: err.message })
      }
    })
  }

  return (
    <>
      {/* Edit Modal */}
      {modalEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[600px] p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-primary">Edit Customer</h2>
              <button onClick={closeEditModal} className="text-red-500 font-bold text-lg">×</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <InputField label='Name' value={name} onChange={e => setName(e.target.value)} />
              <InputField label='ID' value={email} onChange={e => setEmail(e.target.value)} />
              <InputField label='Phone' value={phone} onChange={e => setPhone(e.target.value)} />
              <InputField label='Location' value={location} onChange={e => setLocation(e.target.value)} />
              <div className="col-span-2">
                <label className="text-sm text-primary font-medium mb-1 block">Attach Package</label>
                <Select
                  options={packages}
                  value={selectedPackage}
                  onChange={setSelectedPackage}
                  placeholder="Select Package"
                  isClearable
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              {posting ? <ButtonLoader /> : (
                <div onClick={updateCustomer}>
                  <Button value="Update" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto max-h-[400px]">
  <table className="min-w-full table-auto mt-4">
          <thead className='bg-gray1'>
            <tr>
              <th className="p-2 text-left text-sm text-primary">Name</th>
              <th className="p-2 text-left text-sm text-primary">Phone</th>
              <th className="p-2 text-left text-sm text-primary">ID</th>
              <th className="p-2 text-left text-sm text-primary">Location</th>
              <th className="p-2 text-left text-sm text-primary">Package</th>
              <th className="p-2 text-left text-sm text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customersData.map(customer => (
              <tr key={customer.id} className="border-b border-gray1  hover:bg-gray2">
                <td className="p-2 text-sm">{customer.name}</td>
                <td className="p-2 text-sm">{customer.phone}</td>
                <td className="p-2 text-sm">{customer.email}</td>
                <td className="p-2 text-sm">{customer.location}</td>
                <td className="p-2 text-sm">{customer.package?.name || "N/A"}</td>
                <td className="p-2 flex space-x-4">
                  <BsPencilSquare
                    onClick={() => openEditModal(customer)}
                    className="text-yellow cursor-pointer"
                  />
                  <BsTrash
                    onClick={() => deleteCustomer(customer)}
                    className="text-red cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default CustomersTable
