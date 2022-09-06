import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Menu from "./Menu";
import Drawer from "./Drawer";

const Header = () => {
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const authorized = localStorage.getItem("token");

  const logout = () => {
    localStorage.clear();
    history.push("/");
  };

  return (
    <div className="pb-12">
      <div className="bg-gray-700 h-14 flex justify-between items-center fixed w-full px-4">
        <Link to="/" className="text-xl font-bold text-yellow-400">
          Vender
        </Link>
        <button type="button" className="md:hidden" onClick={() => setOpen(!open)}>
          <Menu />
        </button>
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-xl font-bold text-yellow-400">
            Home
          </Link>
          <Link to="/seller" className="text-xl font-medium text-yellow-400">
            Seller
          </Link>
          {authorized ? (
            <button
              type="button"
              className="text-2xl font-medium h-8 flex items-center text-yellow-600"
              onClick={() => logout()}
            >
              Logout
            </button>
          ): ''}
        </div>
      </div>
      {open ? (
        <Drawer
          setOpen={setOpen}
          authorized={authorized}
          logout={logout}
        />
      ) : undefined}
    </div>
  );
};

export default Header;
