import axios from 'axios';

const API_URL = 'http://localhost:5000/api/contracts/';

// Create new contract
const createContract = async (contractData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, contractData, config);
  return response.data;
};

// Get contracts
const getContracts = async (queryStr = '', token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + '?' + queryStr, config);
  return response.data; // returns { contracts, page, pages, total }
};

// Get single contract
const getContract = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + id, config);
  return response.data;
};

// Update contract
const updateContract = async (id, contractData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + id, contractData, config);
  return response.data;
};

// Get history
const getContractHistory = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + id + '/history', config);
  return response.data;
};

//Delete contract - Admin only
const deleteContract = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + id, config);
  return response.data;
}

const contractService = {
  createContract,
  getContracts,
  getContract,
  updateContract,
  getContractHistory,
  deleteContract,
};

export default contractService;
