import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import InputField from '../InputField'
import InputSelect from '../InputSelect'
import Button from '../Button'
import Select from 'react-select'
import { FaRegUserCircle, FaPhone } from 'react-icons/fa'
import axiosInstance from '../../axios-instance'
import { useNavigate } from 'react-router-dom'
import ButtonLoader from '../ButtonLoader'

const EditcustomersForm = (props) => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const customers = searchParams.get('customers')
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [fatherName, setFatherName] = useState('')
  const [fatherContact, setFatherContact] = useState('')
  const [motherName, setMotherName] = useState('')
  const [nationality, setNationality] = useState('')
  const [residence, setResidence] = useState('')

  const [gender, setGender] = useState({})


  const genderOptions = [
    {
      label: 'MALE',
      value: 'male',
    },
    {
      label: 'FEMALE',
      value: 'female',
    },
  ]

  return (
    <div className="bg-white h-[90vh] overflow-y-auto">
      <div className="flex bg-gray1 p-3 justify-between">
        <div>
          <p className="text-primary font-semibold text-md">Update customers</p>
        </div>
        <div>
          <Link to="/customers">Back</Link>
        </div>
      </div>
      <div>
        <p className="text-secondary text-lg font-semibold ml-5 mt-2">
          customers Identity
        </p>
        <div className="flex px-2 -mt-5">
          <div className="w-1/4 p-2">
            <InputField
              type="text"
              placeholder="Enter First Name"
              label="First Name"
              name="firstName"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              icon={<FaRegUserCircle className="w-3 -ml-7 mt-3" />}
            />
            <InputSelect
              type="text"
              placeholder="Select Gender"
              label="Genders"
              name="gender"
              selectedOption={gender}
              onChange={setGender}
              options={genderOptions}
            />

            <InputField
              type="text"
              placeholder="Enter Occupation"
              label="Occupation"
              name="occupations"
              onChange={(e) => setNationality(e.target.value)}
              value={nationality}
              icon={<FaRegUserCircle className="w-3 -ml-7 mt-3" />}
            />
          </div>
          <div className="w-1/4 p-2">
            <InputField
              type="text"
              placeholder="Enter Middle Name"
              label="Middle Name"
              name="middleName"
              onChange={(e) => setMiddleName(e.target.value)}
              value={middleName}
              icon={<FaRegUserCircle className="w-3 -ml-7 mt-3" />}
            />
            <InputField
              type="text"
              placeholder="Enter Place Of Residence"
              label="Place Of Residence"
              name="residence"
              onChange={(e) => setResidence(e.target.value)}
              value={residence}
              icon={<FaRegUserCircle className="w-3 -ml-7 mt-3" />}
            />
          </div>
          <div className="w-1/4 p-2">
            <InputField
              type="text"
              placeholder="Enter Last Name"
              label="Last Name"
              name="lastName"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              icon={<FaRegUserCircle className="w-3 -ml-7 mt-3" />}
            />
            <InputField
              type="email"
              placeholder="Enter Email Address"
              label="Email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              icon={<FaRegUserCircle className="w-3 -ml-7 mt-3" />}
            />
          </div>
          <div className="w-1/4 p-2">
            <InputField
              type="date"
              label="Date Of Birth"
              name="dateOfBirth"
              onChange={(e) => setDateOfBirth(e.target.value)}
              value={dateOfBirth}
            />
            <InputField
              type="text"
              placeholder="Enter Your Phone Number"
              label="Phone Number"
              name="phoneNumber"
              onChange={(e) => setPhoneNumber(e.target.value)}
              value={phoneNumber}
              icon={<FaPhone className="w-3 -ml-7 mt-3" />}
            />
          </div>
        </div>
        <hr className="text-gray2" />
        <p className="text-secondary text-lg font-semibold ml-5 mt-5">
          Next of Kin
        </p>
        <div className="flex px-2 -mt-5">
          <div className="w-1/4 p-2">
            <InputField
              type="text"
              placeholder="Enter NOK Name"
              label="Name"
              name="nok_name"
              onChange={(e) => setFatherName(e.target.value)}
              value={fatherName}
              icon={<FaRegUserCircle className="w-3 -ml-7 mt-3" />}
            />
          </div>
          <div className="w-1/4 p-2">
            <InputField
              type="text"
              placeholder="Enter NOK Contacts"
              label="Contact"
              onChange={(e) => setFatherContact(e.target.value)}
              value={fatherContact}
            />
          </div>
          <div className="w-1/4 p-2">
            <InputField
              type="text"
              placeholder="Enter Relationship"
              label="Relationship"
              name="motherName"
              onChange={(e) => setMotherName(e.target.value)}
              value={motherName}
              icon={<FaRegUserCircle className="w-3 -ml-7 mt-3" />}
            />
          </div>
        </div>

      </div>
      <div className="flex justify-between p-2">
        <div></div>
        {loading ? (
          <div>
            <ButtonLoader />
          </div>
        ) : (
          <div>
            <Button value={'Update Student'} />
          </div>
        )}
      </div>
    </div>
  )
}

export default EditcustomersForm
