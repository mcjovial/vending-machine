import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import httpClient from '../../utils/api';
import { toast } from 'react-toastify';

const LogoutAll = ({ authorized, role, setAuthorized }) => {
  const history = useHistory();
  const [input, setInput] = useState({
    username: '',
  });

  const inputChange = (e) => {
    e.preventDefault();
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  useEffect(() => {
    if (authorized) {
      if (role === 'seller') {
        history.push('/seller');
      } else {
        history.push('/');
      }
    }
  }, [authorized]);
  

  const logout = async () => {
    const postData = {
      username: input.username,
    };
    try {
      const response = await httpClient.post('/user/logout/all', postData);
      const { data } = response;
      history.push('/login');
      toast(data.message);
    } catch (error) {
      const response = error.response.data;
      if (response.error) {
        toast.error(response.error)
      } else {
        toast.error(response.message)
      }
    }
  };

  return (
    <div className='w-full min-h-screen bg-yellow-400 p-8 py-12 space-y-12'>
      <div className='flex flex-col items-center space-y-8'>
        <p className='font-bold text-4xl'>Have an existing Session?</p>
        <p className='text-xl font-medium'>Logout from all devices</p>
      </div>
      <div className='h-full w-full px-8 space-y-12'>
        <div className='flex flex-col items-center'>
          <input
            type='text'
            className='h-12 w-full px-4 rounded-full shadow-lg'
            id='username'
            placeholder='Username'
            name='username'
            onChange={(e) => inputChange(e)}
          />
        </div>
      </div>
      <div className='flex justify-end w-full h-full'>
        <button
          type='button'
          onClick={() => logout()}
          className='flex justify-center items-center py-2 px-2 bg-green-400 hover:bg-green-300 h-12 w-32 rounded-xl shawdow-xl'
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default LogoutAll;
