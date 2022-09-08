import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Menu from './Menu';
import Drawer from './Drawer';
import httpClient from '../../utils/api';

const Header = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  const [open, setOpen] = useState(false);
  const history = useHistory();
  const [authorized, setAuthorized] = useState(token);

  useEffect(() => {
    setAuthorized(token);
  }, []);

  const logout = async () => {
    try {
      const response = await httpClient.get('/user/logout/all');

      const { data } = response;
      localStorage.clear();
      history.push('/');
      setAuthorized('');
      alert(data.message);
    } catch (error) {
      const response = error.response.data;
      console.log(error);
      if (response.error) {
        alert(response.error);
      } else {
        alert(response.message);
      }
    }
  };

  return (
    <div className='pb-12'>
      <div className='bg-gray-700 h-14 flex justify-between items-center fixed w-full px-4'>
        <Link to='/' className='text-xl font-bold text-yellow-400'>
          Vender
        </Link>
        <button
          type='button'
          className='md:hidden'
          onClick={() => setOpen(!open)}
        >
          <Menu />
        </button>
        <div className='hidden md:flex space-x-8'>
          {role == 'seller' ? (
            ''
          ) : (
            <Link
              to='/'
              className='text-xl font-medium text-yellow-400'
            >
              Buyer
            </Link>
          )}
          {role == 'buyer' ? (
            ''
          ) : (
            <Link
              to='/seller'
              className='text-xl font-medium text-yellow-400'
            >
              Seller
            </Link>
          )}
          {token ? (
            <button
              type='button'
              className='text-2xl font-medium h-8 flex items-center text-yellow-600'
              onClick={() => logout()}
            >
              Logout
            </button>
          ) : (
            ''
          )}
        </div>
      </div>
      {open ? (
        <Drawer setOpen={setOpen} authorized={authorized} logout={logout} />
      ) : undefined}
    </div>
  );
};

export default Header;
