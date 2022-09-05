import React from "react";
import { Link } from "react-router-dom";

const Drawer = ({ setOpen, authorized, logout }) => (
  <div
    className="bg-yellow-400 h-96 w-72 inset-y-0 right-0 top-14 transform flex flex-col fixed rounded-l-xl"
    onMouseLeave={() => setOpen(false)}
  >
    <div className="flex flex-col p-8 space-y-4">
      <Link
        to="/"
        className="text-2xl font-medium h-8 flex items-center"
        onClick={() => setOpen(false)}
      >
        Home
      </Link>
      {authorized ? (
        <>
          <Link
            to="/seller"
            className="text-2xl font-medium h-8 flex items-center"
            onClick={() => setOpen(false)}
          >
            Seller
          </Link>
          <button
            type="button"
            className="text-2xl font-medium h-8 flex items-center"
            onClick={() => logout()}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="text-2xl font-medium"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-2xl font-medium"
            onClick={() => setOpen(false)}
          >
            Register
          </Link>
        </>
      )}
    </div>
  </div>
);

export default Drawer;
