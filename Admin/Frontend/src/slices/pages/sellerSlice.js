import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import { api, GET_DEACTIVE_SELLERS, GET_REQUEST_SELLER, GET_SELLER, GET_SELLERS, SELLER_STATUS_UPDATE } from "../ApiUrl";

export const get_seller_list = createAsyncThunk('data/get_seller_list',
    async (_, thunkAPI) => {
        try {
            const source = axios.CancelToken.source();
            thunkAPI.signal.addEventListener('abort', () => {
                source.cancel()
            })
            const response = axios.get(`${GET_SELLERS}`, { withCredentials: true });
            return response
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    },  
)

export const get_seller_request = createAsyncThunk(
    'seller/get_seller_request',
    async ({}, { rejectWithValue }) => {
        try {
            const response = await api.get(GET_REQUEST_SELLER, { withCredentials: true })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_seller = createAsyncThunk(
    'seller/get_seller',
    async (sellerId, { rejectWithValue }) => {
        try {
            const response = await api.get(`${GET_SELLER}/${sellerId}`, { withCredentials: true })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const seller_status_update = createAsyncThunk(
    'seller/seller_status_update',
    async (info, { rejectWithValue }) => {
        const payload = {
            sellerId: info.param.sellerId,
            status: info.param.status
        }
        try {
            const response = await axios.post(SELLER_STATUS_UPDATE, payload, { withCredentials: true })
            return response
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_active_sellers = createAsyncThunk(
    'seller/get_active_sellers',
    async ({ }, { rejectWithValue }) => {
        try {
            const response = await api.get(GET_SELLERS)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_deactive_sellers = createAsyncThunk(
    'seller/get_deactive_sellers',
    async ({ }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const response = await api.get(GET_DEACTIVE_SELLERS, { withCredentials: true })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const create_stripe_connect_account = createAsyncThunk(
    'seller/create_stripe_connect_account',
    async () => {
        try {
            const { data: { url } } = await api.get(`/payment/create-stripe-connect-account`, { withCredentials: true })
            window.location.href = url
            // return fulfillWithValue(data)
        } catch (error) {
            //return rejectWithValue(error.response.data)
        }
    }
)

export const active_stripe_connect_account = createAsyncThunk(
    'seller/active_stripe_connect_account',
    async (activeCode, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/payment/active-stripe-connect-account/${activeCode}`, {}, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

const sellersSlice = createSlice({
    name: 'Sellers',
    initialState: {
        loading: false,
        error: '',
        sellers: [],
        sellersRequest: [],
        deactiveSellers: [],
        totalSeller: 0,
        seller: ''
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(get_seller_list.pending, (state, action) => {
                state.loading = true
                state.listError = ''
            })
            .addCase(get_seller_list.fulfilled, (state, action) => {
                state.loading = false
                state.sellers = action?.payload?.sellers
                state.totalSeller = action?.payload?.totalSeller
            })
            .addCase(get_seller_list.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(get_seller_request.pending, (state, action) => {
                state.loading = true
                state.listError = ''
            })
            .addCase(get_seller_request.fulfilled, (state, action) => {
                state.loading = false
                state.sellersRequest = action?.payload.sellers
                state.totalSeller = action?.payload.totalSeller
            })
            .addCase(get_seller_request.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(get_deactive_sellers.pending, (state, action) => {
                state.loading = true
                state.listError = ''
            })
            .addCase(get_deactive_sellers.fulfilled, (state, action) => {
                state.loading = false
                state.deactiveSellers = action?.payload.sellers
                state.totalSeller = action?.payload.totalSeller
            })
            .addCase(get_deactive_sellers.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
    }
})

export default sellersSlice.reducer