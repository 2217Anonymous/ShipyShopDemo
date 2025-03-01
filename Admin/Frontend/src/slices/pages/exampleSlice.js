import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import { OUTLETS_LIST, OUTLET_STATUS_CHANGE, VIEW_OUTLET } from "../ApiUrl";

export const add_edit_outlet = createAsyncThunk('data/add_edit_outlet',
    async (data,thunkAPI) => {
        const userData = {
            id                      : data.Id ? data.Id : 0,
            name                    : data.Name,
            code                    : data.Code,
            contactPerson           : data.ContactPerson,
            contactPersonSurName    : data.ContactPersonSurname,
            mobileNum               : data.MobileNum,
            emailId                 : data.EmailId,
            address                 : data.Address,
            location                : data.Location,
            rentpaymentDate         : data.RentPaymentDate,
            advanceAmt              : parseInt(data.AdvanceAmt),
            gstTin                  : data.GstTin,
            ebNumber                : data.EbNumber,
            password                : data.Password,
            confirmPassword         : data.ConfirmPassword,
            geoLocation             : data.Geolocation
        }
        try {
            const response = await axios.post(ADD_EDIT_OUTLET, userData);
            return response
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
})

export const get_outlet_list = createAsyncThunk('data/get_outlet_list',
    async (arg,thunkAPI) => {
        try{
            const source = axios.CancelToken.source();
            thunkAPI.signal.addEventListener('abort',() => {
                source.cancel()
            })
            const response = axios.get(OUTLETS_LIST);
            return response
        } catch(error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)

export const outlets_status_change = createAsyncThunk('data/outlets_status_change',
    async (dt,thunkAPI) => {
        const data = {
            id          : dt.param,
            geoLocation : dt.GeoLocation
        }
        try{
            const response = await axios.post(OUTLET_STATUS_CHANGE,data)
            return response
        } catch(error){
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const view_outlet = createAsyncThunk('data/view_outlet',
    async (dt,thunkAPI) => {
        const data = {
            id          : dt.Param,
            geoLocation : dt.GeoLocation
        }
        try{
            const response = await axios.post(VIEW_OUTLET,data)
            return response
        } catch(error){
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const outlet_document_upload = createAsyncThunk('data/outlet_document_upload',
    async (dt,thunkAPI) => {
        const form = new FormData();
        form.append("OutletParamStr",   dt.ParamId)
        form.append("DocName",          dt.DocName)
        form.append("FileURI",          dt.FileURI)
        form.append("geoLocation",      dt.GeoLocation)
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data' // Set the Content-Type header to 'multipart/form-data'
            }
        };
        try{
            const response = await axios.post(OUTLET_DOCUMENT_UPLOAD,form,config)
            return response
        } catch(error){
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const outlet_document_delete = createAsyncThunk('data/outlet_document_delete',
    async (dt,thunkAPI) => {
        const data = {
            id          : dt.Param,
            geoLocation : dt.GeoLocation
        }
        try{
            const response = await axios.post(DELETE_OUTLET_DOCUMENT,data)
            return response
        } catch(error){
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

const getOutletSlice = createSlice({
    name : 'Outlets',
    initialState:{
        loading             : false,
        error               : '',
        outletList          : [],
        selectedOutletList  : {},
        documentList        : [],
        selectedDocument    : {},
    },
    reducers:{},
    extraReducers:(builder) => {
        builder
        .addCase(add_edit_outlet.pending,(state,action) => {
            state.loading   = true
            state.error     = ''
        })
        .addCase(add_edit_outlet.fulfilled,(state,action) => {
            state.loading       = false
            // state.outletList.push(action.payload.Data)
        })
        .addCase(add_edit_outlet.rejected,(state,action) => {
            state.loading   = false
            state.error     = action.error.message
        })
        .addCase(get_outlet_list.pending,(state,action) => {
            state.loading   = true
            state.listError = ''
        })
        .addCase(get_outlet_list.fulfilled,(state,action) => {
            state.loading       = false
            state.outletList    = action.payload
        })
        .addCase(get_outlet_list.rejected,(state,action) => {
            state.loading   = false
            state.error = action.error.message
        })

        .addCase(view_outlet.pending,(state,action) => {
            state.loading   = true
            state.error     = ''
        })
        .addCase(view_outlet.fulfilled,(state,action) => {
            state.loading               = false
            state.selectedOutletList    = action.payload
        })
        .addCase(view_outlet.rejected,(state,action) => {
            state.loading   = true
            state.error     = action.error.message
        })
        
        .addCase(outlets_status_change.pending,(state,action) => {
            state.loading   = true
            state.error     = ''
        })
        .addCase(outlets_status_change.fulfilled,(state,action) => {
            state.loading               = false
            state.selectedOutletList    = action.payload
        })
        .addCase(outlets_status_change.rejected,(state,action) => {
            state.loading   = true
            state.error     = action.error.message
        })
        .addCase(outlet_document_upload.pending,(state,action) => {
            state.loading   = true
            state.error     = ''
        })
        .addCase(outlet_document_upload.fulfilled,(state,action) => {
            state.loading               = false
            //state.selectedOutletList    = action.payload
        })
        .addCase(outlet_document_upload.rejected,(state,action) => {
            state.loading   = false
            state.error     = action.error.message
        })
        .addCase(outlet_document_delete.fulfilled,(state,action) => {
            state.loading               = false
        })
    }
})

export default getOutletSlice.reducer
