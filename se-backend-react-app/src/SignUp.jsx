import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import { useCallback } from "react";
import * as yup from "yup";

const validationSchema = yup.object({
  name: yup.string().required("Name is required."),
  email: yup
    .string()
    .email("Invalid email format.")
    .required("Email is required."),
  password: yup
    .string()
    .required("Password is required.")
    .min(8, "Password must contain 8 or more characters.")
    .matches(/.*[a-z].*/, "Password must contain at least 1 lower case letter.")
    .matches(/.*[A-Z].*/, "Password must contain at least 1 upper case letter.")
    .matches(/.*[0-9].*/, "Password must contain at least 1 number.")
    .matches(
      /.*[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~].*/,
      "Password must contain at least 1 special character"
    ),
  confirmationPassword: yup
    .string()
    .required("Confirmation password is required.")
    .oneOf([yup.ref("password")], "Your passwords do not match."),
  profileUrl: yup.string().required("Profile pic is required."),
});

const SignUp = ({ setAppState }) => {
  const onSubmit = useCallback(
    (values, formikBag) => {
      axios
        .request({
          url: "/users/signup",
          baseURL: `${process.env.REACT_APP_EXPRESS_URL}`,
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          data: values,
        })
        .then((response) => {
          const { jwt_token } = response.data;
          localStorage.setItem("jwt_token", jwt_token);
          setAppState({ isLoggedIn: true, currentSection: "users" });
        })
        .catch((err) => {
          formikBag.setFieldError(
            "confirmationPassword",
            err.response.data.message
          );
          console.log("error", err);
        });
    },
    [setAppState]
  );

  return (
    <div className="container d-flex flex-row align-items-center justify-content-center">
      <Formik
        initialValues={{
          email: "",
          password: "",
          name: "",
          bio: "",
          profileUrl:
            "https://png.pngitem.com/pimgs/s/506-5067022_sweet-shap-profile-placeholder-hd-png-download.png",
        }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form>
          <div className="d-flex flex-column">
            <label>Name</label>
            <Field name="name" id="name" className="form-control" />
            <ErrorMessage name="name">
              {(msg) => <p className="text-danger">{msg}</p>}
            </ErrorMessage>
          </div>
          <div className="d-flex flex-column">
            <label>Bio</label>
            <Field
              component="textarea"
              name="bio"
              id="bio"
              className="form-control"
            />
            <ErrorMessage name="bio">
              {(msg) => <p className="text-danger">{msg}</p>}
            </ErrorMessage>
          </div>
          <div className="d-flex flex-column">
            <label>Email</label>
            <Field name="email" id="email" className="form-control" />
            <ErrorMessage name="email">
              {(msg) => <p className="text-danger">{msg}</p>}
            </ErrorMessage>
          </div>
          <div className="d-flex flex-column mb-2">
            <label>Password</label>
            <Field
              name="password"
              id="password"
              className="form-control"
              type="password"
            />
            <ErrorMessage name="password">
              {(msg) => <p className="text-danger">{msg}</p>}
            </ErrorMessage>
          </div>
          <div className="d-flex flex-column mb-2">
            <label>Confirm Password</label>
            <Field
              name="confirmationPassword"
              id="confirmationPassword"
              className="form-control"
              type="password"
            />
            <ErrorMessage name="confirmationPassword">
              {(msg) => <p className="text-danger">{msg}</p>}
            </ErrorMessage>
          </div>
          <button className="btn btn-primary" type="submit">
            Sign Up
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default SignUp;
