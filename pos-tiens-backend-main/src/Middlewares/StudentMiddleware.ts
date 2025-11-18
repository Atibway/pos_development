import { NextFunction, Request, Response } from "express"
import { customPayloadResponse } from "../Helpers/Helpers";

export const validateStudentRequest = (req: Request, res: Response, next: NextFunction) => {
  const {
    firstName,
    middleName,
    lastName,
    email,
    phoneNumber,
    dateOfBirth,
    gender,
    nationality,
    residence,
    photo,
    fatherName,
    fatherContact,
    motherName,
    motherContact,
    studentType,
    studentSection,
    studentHouse,
    studentClass,
    feesCategory,
  } = req.body;


  if (!firstName) {
    return res
      .json(customPayloadResponse(false, "First Name is required"))
      .status(400)
      .end();
  } else if (!lastName) {
    return res
      .json(customPayloadResponse(false, "Last Name is required"))
      .status(400)
      .end();
  } else if (!dateOfBirth) {
    return res
      .json(customPayloadResponse(false, "Date of Birth is required"))
      .status(400)
      .end();
  } else if (!gender) {
    return res
      .json(customPayloadResponse(false, "Gender is required"))
      .status(400)
      .end();
  } else if (!nationality) {
    return res
      .json(customPayloadResponse(false, "Nationality is required"))
      .status(400)
      .end();
  } else if (!residence) {
    return res
      .json(customPayloadResponse(false, "Residence is required"))
      .status(400)
      .end();
  } else if (!fatherName) {
    return res
      .json(customPayloadResponse(false, "Father's Name is required"))
      .status(400)
      .end();
  } else if (!fatherContact) {
    return res
      .json(customPayloadResponse(false, "Father's Contact is required"))
      .status(400)
      .end();
  } else if (!motherName) {
    return res
      .json(customPayloadResponse(false, "Mother's Name is required"))
      .status(400)
      .end();
  } else if (!motherContact) {
    return res
      .json(customPayloadResponse(false, "Mother's Contact is required"))
      .status(400)
      .end();
  } else if (!studentType) {
    return res
      .json(customPayloadResponse(false, "Student Type is required"))
      .status(400)
      .end();
  } else if (!studentSection) {
    return res
      .json(customPayloadResponse(false, "Student Section is required"))
      .status(400)
      .end();
  } else if (!studentHouse) {
    return res
      .json(customPayloadResponse(false, "Student House is required"))
      .status(400)
      .end();
  } else if (!studentClass) {
    return res
      .json(customPayloadResponse(false, "Student Class is required"))
      .status(400)
      .end();
  } else if (!feesCategory) {
    return res
      .json(customPayloadResponse(false, "Fees Category is required"))
      .status(400)
      .end();
  } else {
    next();
    return;
  }
}
