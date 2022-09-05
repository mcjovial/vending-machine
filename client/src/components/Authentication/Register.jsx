import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

const Register = ({ setAuthorized }) => {
  const history = useHistory();
  const api = import.meta.env.API || "https://express-vender.herokuapp.com/api";
  // const [error, setError] = useState({});
  const [input, setInput] = useState({
    username: "",
    password: "",
    role: "",
  });

  console.log(input);

  const inputChange = (e) => {
    e.preventDefault();
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const register = async () => {
    console.log(api);
    const data = {
      username: input.username,
      password: input.password,
      role: input.role,
    };

    try {
      // register
      const response = await axios.post(`${api}/user/register`, data, {
        headers: {
          "Content-Type": "Application/json",
        },
      });
      const responseData = response.data;

      // setToken, authorize and redirect
      setAuthorized(true);
      localStorage.setItem("token", responseData.token);
      localStorage.setItem("role", responseData.role);
      if (responseData.role === "seller") {
        history.push("/seller");
      } else {
        history.push("/");
      }

      console.log(response);
    } catch (error) {
      console.log(error);
      const response = error.response.data;
      alert(response.error);
    }
  };

  return (
    <div className="w-full h-full bg-yellow-400 p-8 py-12 space-y-12">
      <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
        <p className="text-2xl font-bold">Welcome</p>
        <p className="text-xl font-medium"> </p>
        <p className="text-xl font-medium">To get started create an acount</p>
      </div>
      <div className="h-full w-full px-8 space-y-10">
        <div className="flex flex-col items-center space-y-4">
          <input
            type="text"
            className="h-12 w-full px-4 rounded-full shadow-lg"
            id="username"
            placeholder="username"
            name="username"
            onChange={(e) => inputChange(e)}
          />
        </div>
        <div className="flex flex-col items-center space-y-2">
          <input
            type="text"
            className="h-12 w-full px-4 rounded-full shadow-lg"
            id="role"
            name="role"
            placeholder="Buyer or Seller"
            onChange={(e) => inputChange(e)}
          />
        </div>
        <div className="flex flex-col items-center space-y-2">
          <input
            type="password"
            className="h-12 w-full px-4 rounded-full shadow-lg"
            placeholder="Password"
            name="password"
            onChange={(e) => inputChange(e)}
          />

          <div className="flex justify-end w-full">
            <Link to="/password-reset" className="h-12 w-32">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
      <div className="flex justify-end w-full h-full">
        <button
          type="button"
          onClick={() => register()}
          className="flex justify-center items-center py-2 px-2 bg-green-400 hover:bg-green-300 h-12 w-32 rounded-xl shawdow-xl"
        >
          Create
        </button>
      </div>
      <div className="flex justify-center">
        <Link to="/login" className="text-md font-sm">
          Already have an account?{" "}
          <span className="text-lg font-bold underline">Sign In</span>
        </Link>
      </div>
    </div>
  );
};

export default Register;
