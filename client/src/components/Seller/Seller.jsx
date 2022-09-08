import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import httpClient from '../../utils/api';

const Seller = () => {
  const username = localStorage.getItem('name');
  const [name, setName] = useState('');
  const [products, setProducts] = useState([]);
  const [submitted, setSubmitted] = useState('');
  const [input, setInput] = useState({
    productName: '',
    description: '',
    cost: '',
    amountAvailable: '',
  });

  const token = localStorage.getItem('token');
  httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  // console.log(httpClient.defaults.headers, token);

  const inputChange = (e) => {
    e.preventDefault();
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const getProducts = async () => {
    try {
      const response = await httpClient.get('/product');
      const { data } = response;
      setProducts(data);
      console.log(data);
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

  const submit = async () => {
    const postData = {
      productName: input.productName,
      description: input.description,
      cost: input.cost,
      amountAvailable: input.amountAvailable,
    };

    try {
      const response = await httpClient.post('/product', postData);
      const { data } = response;
      setSubmitted(data.message);
      if (data.message) alert(data.message);
    } catch (error) {
      const response = error.response.data;
      console.log(error.response.data.message);
      if (response.error) {
        alert(response.error);
      } else {
        alert(response.message);
      }
    }
  };

  useEffect(() => {
    setName(username);
    getProducts();
  }, [submitted]);

  return (
    <div className=' flex flex-col justify-center bg-yellow-400 py-8 items-center'>
      <p className='font-bold text-3xl'>Welcome Back! {name}</p>
      <div className='w-full h-full  p-8 py-12 space-y-12 px-8'>
        <div className='h-full w-full px-8 space-y-12'>
          <div className='grid md:grid-cols-3 sm:grid-cols-2'>
            {products.map((product, i) => (
              <Link
                to={`/product/${product._id}`}
                key={i}
                href='#'
                className='block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
              >
                <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
                  {product.productName}
                </h5>
                <p className='font-normal text-gray-700 dark:text-gray-400'>
                  &cent;{product.cost}
                </p>
              </Link>
            ))}
          </div>
        </div>
        <div className='flex flex-col items-center space-y-8'>
          <p className='text-xl font-medium'>Add new product</p>
        </div>
        <div className='h-full w-full px-8 space-y-12'>
          <div className='flex flex-col items-center'>
            <input
              type='text'
              className='h-12 w-full px-4 rounded shadow-lg'
              id='productName'
              placeholder='Product name'
              name='productName'
              onChange={(e) => inputChange(e)}
            />
          </div>
          <div className='flex flex-col items-center'>
            <input
              type='text'
              className='h-12 w-full px-4 rounded shadow-lg'
              placeholder='Description'
              name='description'
              onChange={(e) => inputChange(e)}
            />
          </div>
          <div className='flex flex-col items-center'>
            <input
              type='number'
              className='h-12 w-full px-4 rounded shadow-lg'
              placeholder='Cost'
              name='cost'
              onChange={(e) => inputChange(e)}
            />
          </div>
          <div className='flex flex-col items-center'>
            <input
              type='number'
              className='h-12 w-full px-4 rounded shadow-lg'
              placeholder='Amount available'
              name='amountAvailable'
              onChange={(e) => inputChange(e)}
            />
          </div>
          <div className='flex justify-end w-full h-full'>
            <button
              type='button'
              onClick={() => submit()}
              className='flex justify-center items-center py-2 px-2 bg-green-400 hover:bg-green-700 hover:text-white h-12 w-32 rounded-full shawdow-xl'
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seller;
