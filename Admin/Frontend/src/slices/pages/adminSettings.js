import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import { api, GET_DEACTIVE_SELLERS, GET_REQUEST_SELLER, GET_SELLER, GET_SELLERS, SELLER_STATUS_UPDATE } from "../ApiUrl";
import CategoryServices from "../../services/CategoryServices";


export const getCategoryList = createAsyncThunk(
    'master/category_list',
    async ({ rejectWithValue }) => {
        try {
            const res = await CategoryServices.getAllCategory();
            return res;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const masterSlice = createSlice({
  name: 'Category',
  initialState,
  reducers: {
    messageClear: (state) => {
      state.errorMessage = '';
      state.successMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategoryList.pending, (state) => {
        state.loader = true;
      })
      .addCase(getCategoryList.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload?.message || 'successful';
      })
      .addCase(getCategoryList.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload || 'failed';
      })
  },
});

export const { messageClear } = masterSlice.actions;

export default masterSlice.reducer;
