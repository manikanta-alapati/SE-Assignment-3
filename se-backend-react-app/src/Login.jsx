import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import { useCallback } from "react";
import * as yup from "yup";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format.")
    .required("Email is required."),
  password: yup.string().required("Password is required"),
});

const Login = ({ setAppState }) => {
  const onSubmit = useCallback(
    (values, formikBag) => {
      axios
        .request({
          url: "/users/login",
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
          formikBag.setFieldError("password", err.response.data.message);
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
        }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form>
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
              type="password"
              className="form-control"
            />
            <ErrorMessage name="password">
              {(msg) => <p className="text-danger">{msg}</p>}
            </ErrorMessage>
          </div>
          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
