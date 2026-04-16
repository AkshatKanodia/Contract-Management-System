import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import contractService from './contractService';

const initialState = {
  contracts: [],
  currentContract: null,
  contractHistory: [],
  page: 1,
  pages: 1,
  total: 0,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Create new contract
export const createContract = createAsyncThunk(
  'contracts/create',
  async (contractData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await contractService.createContract(contractData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get contracts
export const getContracts = createAsyncThunk(
  'contracts/getAll',
  async (queryStr, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await contractService.getContracts(queryStr, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get contract by ID
export const getContract = createAsyncThunk(
  'contracts/getOne',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await contractService.getContract(id, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update contract
export const updateContract = createAsyncThunk(
  'contracts/update',
  async ({id, data}, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await contractService.updateContract(id, data, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getContractHistory = createAsyncThunk(
  'contracts/history',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await contractService.getContractHistory(id, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteContract = createAsyncThunk(
  'contracts/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await contractService.deleteContract(id, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createContract.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Optional: you can push new contract to contracts list here,
        // or just let a refetch handle it
      })
      .addCase(createContract.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getContracts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getContracts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.contracts = action.payload.contracts;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.total;
      })
      .addCase(getContracts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getContract.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getContract.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentContract = action.payload;
      })
      .addCase(getContract.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateContract.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateContract.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentContract = action.payload;
      })
      .addCase(updateContract.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getContractHistory.fulfilled, (state, action) => {
        state.contractHistory = action.payload;
      });
  },
});

export const { reset } = contractSlice.actions;
export default contractSlice.reducer;
