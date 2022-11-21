import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useEffect } from "react";
import * as yup from "yup";
import _ from "lodash";
import "./Profile.css";

const validationSchema = yup.object({
  name: yup.string().required("Name is required."),
  bio: yup.string().required("Bio is required."),
  profileUrl: yup.string().required("Profile picture is required."),
  email: yup.string(),
});

function Profile() {
  const [initialValues, setInitialValues] = useState({
    name: "",
    bio: "",
    profileUrl:
      "https://png.pngitem.com/pimgs/s/506-5067022_sweet-shap-profile-placeholder-hd-png-download.png",
    email: "",
  });
  const { values, getFieldProps, setValues, dirty, handleSubmit } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, formikBag) => {
      axios
        .request({
          url: "/users/",
          baseURL: `${process.env.REACT_APP_EXPRESS_URL}`,
          method: "put",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            "Content-Type": "application/json",
          },
          data: values,
        })
        .then(({ data: { name, bio, profileUrl, email } }) => {
          formikBag.setValues({ name, bio, profileUrl, email });
        })
        .catch((err) => {
          console.log("error", err);
        });
    },
  });
  useEffect(() => {
    axios
      .request({
        url: "/users/",
        baseURL: `${process.env.REACT_APP_EXPRESS_URL}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      })
      .then(({ data: { bio, name, email, profileUrl } }) =>
        setValues({ bio, name, email, profileUrl })
      )
      .catch((err) => {
        console.log("error");
      });
  }, [setValues]);
  console.log("values", dirty, values);

  const isDirty = _.isEqual(initialValues, values);
  return (
    <form
      onSubmit={handleSubmit}
      className="container d-flex p-3 bg-light rounded border"
    >
      <img
        src={values.profileUrl}
        className="profile-image rounded border"
        alt={values.name}
      />
      <div className="d-flex flex-column p-3">
        <div className="mb-2">
          <input
            name="name"
            className="fs-3 p-1 rounded border"
            {...getFieldProps("name")}
          />
        </div>
        <div>
          <textarea
            rows={5}
            cols={100}
            name="bio"
            style={{ resize: "none" }}
            className="p-2 rounded border"
            {...getFieldProps("bio")}
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

export default Profile;
