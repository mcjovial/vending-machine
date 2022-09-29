import React, { useEffect } from 'react';
import { useState } from 'react';
import httpClient from '../utils/api';
import { toast } from 'react-toastify';

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState({});
  const [init, setInit] = useState();

  const token = localStorage.getItem('token');
  httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  const getProducts = async () => {
    try {
      const response = await httpClient.get('/product');
      const { data } = response;
      setProducts(data);
    } catch (error) {
      const response = error.response.data;
      if (response.error) {
        toast.error(response.error)
      } else {
        toast.error(response.message)
      }
    }
  };

  const getUser = async () => {
    try {
      const response = await httpClient.get('/user/info');
      const { data } = response;
      setUser(data);
    } catch (error) {
      const response = error.response.data;
      if (response.error) {
        toast.error(response.error)
      } else {
        toast.error(response.message)
      }
    }
  };

  const buy = async (e, id) => {
    try {
      const response = await httpClient.post(`/product/buy/${id}`, {
        amount: 1,
      });

      const { data } = response;
      setInit(data);
      toast(`Change: ${data.change_description} 
            Total: ${data.change}`);
      // alert(response.data.change_description);
    } catch (error) {
      const response = error.response.data;
      if (response.error) {
        toast.error(response.error)
      } else {
        toast.error(response.message)
      }
    }
  };

  const reset = async (e) => {
    try {
      const response = await httpClient.post('/user/reset');

      const { data } = response;
      setInit(data);
      toast('Account reset successful');
    } catch (error) {
      const response = error.response.data;
      if (response.error) {
        toast.error(response.error)
      } else {
        toast.error(response.message)
      }
    }
  };

  const u_deposit = async (e, amount) => {
    try {
      const response = await httpClient.put('/user', { deposit: amount });

      const { data } = response;
      setInit(data);
      toast('Amount deposited successfully');
    } catch (error) {
      const response = error.response.data;
      if (response.error) {
        toast.error(response.error)
      } else {
        toast.error(response.message)
      }
    }
  };

  useEffect(() => {
    getProducts();
    getUser();
  }, [init]);

  const { username, deposit, role } = user;
  const coins = [5, 10, 20, 50, 100];

  return (
    <div className=' flex flex-col justify-center p-8 items-center'>
      <p className='font-bold text-5xl text-green-500 mb-8'>Hello {username}</p>
      <div className=' flex flex-col items-center'>
        <p className='text-2xl w-full text-center mb-12'>
          Welcome to Vender. Deposit and Pick a drink.
        </p>
        <div className='mb-5 grid grid-cols-5'>
          {coins.map((coin, i) => (
            <button
              key={i}
              onClick={(e) => u_deposit(e, coin)}
              // className='rounded-full bg-gray-700 hover:bg-gray-300 m-1 p-8 text-white shadow-xl'
              className='w-20 h-20 rounded-full bg-blue-500 hover:bg-red-500 text-white sm:mx-2 shadow-lg'
            >
              ¢{coin}
            </button>
          ))}
        </div>
        <div className='flex items-center bg-gray-300 rounded-2xl p-4 my-10'>
          <div className='grid md:grid-cols-3 sm:grid-cols-2'>
            {products.map((product, i) => (
              <button
                onClick={(e) => buy(e, product._id)}
                key={i}
                className='block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
              >
                <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
                  {product.productName}
                </h5>
                <p className='font-normal text-gray-700 dark:text-gray-400'>
                  &cent;{product.cost}
                </p>{' '}
                <span>{product.amountAvailable} units</span>
              </button>
            ))}
          </div>
        </div>
        <span className='text-3xl text-yellow-500 my-12'>
          Deposit: ¢{deposit}
        </span>
        <button
          onClick={reset}
          className='bg-red-500 rounded-2xl p-5 text-white hover:bg-red-800'
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
