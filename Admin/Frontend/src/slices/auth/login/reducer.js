import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ADMIN_LOGIN_URL, api, LOGIN_URL, LOGOUT_URL, SELLER_LOGIN_URL, SELLER_REGISTER_URL } from "../../ApiUrl";
import { jwtDecode } from "jwt-decode";
import AdminServices from "../../../services/AdminServices";

export const admin_login = createAsyncThunk(
  'auth/admin_login',
  async (info, { rejectWithValue }) => {
    try {
      const res = await AdminServices.loginAdmin(info);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const seller_login = createAsyncThunk(
  'auth/seller_login',
  async (info, { rejectWithValue }) => {
    const data = {
      email: info.email,
      password: info.password,
    };
    try {
      const response = await api.post(SELLER_LOGIN_URL, data, { withCredentials: true });
      localStorage.setItem('accessToken', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const seller_register = createAsyncThunk(
  'auth/seller_register',
  async (info, { rejectWithValue }) => {
    const data = {
      name: info.name,
      email: info.email,
      password: info.password,
    };
    try {
      const response = await api.post(SELLER_REGISTER_URL, data, { withCredentials: true });
      localStorage.setItem('accessToken', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async ({ navigate, role }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(LOGOUT_URL, { withCredentials: true });
      localStorage.removeItem('accessToken');
      if (role === 'admin') {
        navigate('/admin-login');
      } else {
        navigate('/login');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const initialState = {
  successMessage: '',
  errorMessage: '',
  loader: false,
  userInfo: '',
  // role: returnRole(localStorage.getItem('accessToken')),
  token: localStorage.getItem('accessToken'),
};

const loginSlice = createSlice({
  name: 'AuthUser',
  initialState,
  reducers: {
    messageClear: (state) => {
      state.errorMessage = '';
      state.successMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(admin_login.pending, (state) => {
        state.loader = true;
      })
      .addCase(admin_login.fulfilled, (state, action) => {
        console.log(action.payload?.values?.token)
        state.loader = false;
        state.successMessage = action.payload?.message || 'Login successful';
        state.token = action.payload?.values?.token;
      })
      .addCase(admin_login.rejected, (state, action) => {
        console.log(action.payload,"payload")
        state.loader = false;
        state.errorMessage = action.payload || 'Login failed';
      })
      .addCase(seller_login.pending, (state) => {
        state.loader = true;
      })
      .addCase(seller_login.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload?.message || 'Login successful';
        state.token = action.payload?.token;
        // state.role = returnRole(action.payload?.token);
      })
      .addCase(seller_login.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload || 'Login failed';
      })
      .addCase(seller_register.pending, (state) => {
        state.loader = true;
      })
      .addCase(seller_register.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload?.message || 'Registration successful';
        state.token = action.payload?.token;
        // state.role = returnRole(action.payload?.token);
      })
      .addCase(seller_register.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload || 'Registration failed';
      });
  },
});

export const { messageClear } = loginSlice.actions;

export default loginSlice.reducer;
