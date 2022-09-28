import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import httpClient from '../../utils/api';
import { toast } from 'react-toastify';

const Product = () => {
  const { id } = useParams();
  const history = useHistory();
  const [product, setProduct] = useState({});
  const [init, setInit] = useState(true);
  const [input, setInput] = useState({
    productName: '',
    description: '',
    cost: '',
    amountAvailable: '',
  });

  const token = localStorage.getItem('token');
  httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  const inputChange = (e) => {
    e.preventDefault();
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const getProduct = async (id) => {
    try {
      const response = await httpClient.get(`/product/${id}`);
      const { data } = response;
      setProduct(data);
    } catch (error) {
      const response = error.response.data;
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.error(response.message);
      }
    }
  };

  const update = async () => {
    const postData = {
      productName: input.productName,
      description: input.description,
      cost: input.cost,
      amountAvailable: input.amountAvailable,
    };
    try {
      const response = await httpClient.put(`/product/${id}`, postData);
      const { data } = response;
      setInit(true);
      toast('Product updated successfully!');
    } catch (error) {
      const response = error.response.data;
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.error(response.message);
      }
    }
  };

  const remove = async () => {
    try {
      const response = await httpClient.delete(`/product/${id}`);
      const { data } = response;
      setInit(true);
      history.push('/seller');
      if (data.message) toast(data.message);
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
    getProduct(id);
  }, [init]);

  const { productName, description, cost, amountAvailable } = product;

  return (
    <div className='w-full min-h-screen bg-yellow-400 p-8 py-12 space-y-12 px-8'>
      <div className='flex flex-col items-center space-y-8'>
        <p className='text-xl font-medium'>Edit {productName}</p>
      </div>
      <div className='h-full w-full px-8 space-y-12'>
        <div className='flex flex-col items-center'>
          <input
            type='text'
            className='h-12 w-full px-4 rounded shadow-lg'
            id='productName'
            placeholder='Product name'
            defaultValue={productName}
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
            defaultValue={description}
            onChange={(e) => inputChange(e)}
          />
        </div>
        <div className='flex flex-col items-center'>
          <input
            type='number'
            className='h-12 w-full px-4 rounded shadow-lg'
            placeholder='Cost'
            name='cost'
            defaultValue={cost}
            onChange={(e) => inputChange(e)}
          />
        </div>
        <div className='flex flex-col items-center'>
          <input
            type='number'
            className='h-12 w-full px-4 rounded shadow-lg'
            placeholder='Amount available'
            name='amountAvailable'
            defaultValue={amountAvailable}
            onChange={(e) => inputChange(e)}
          />
        </div>
        <div className='flex justify-end w-full h-full'>
          <button
            type='button'
            onClick={() => remove()}
            className='block justify-center items-center py-2 px-2 mx-2 bg-red-400 hover:bg-red-700 hover:text-white h-12 w-32 rounded-full shawdow-xl'
          >
            Delete
          </button>
          <button
            type='button'
            onClick={() => update()}
            className='flex justify-center items-center py-2 px-2 bg-green-400 hover:bg-green-700 hover:text-white h-12 w-32 rounded-full shawdow-xl'
          >
            Update
          </button>
        </div>
      </div>
      <div className='flex justify-center'>
        <Link to='#' className='text-md font-sm'>
          {' '}
          Edit Product
        </Link>
      </div>
    </div>
  );
};

export default Product;
