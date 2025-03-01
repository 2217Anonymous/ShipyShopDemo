import { combineReducers, configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
// import { persistReducer, persistStore } from 'redux-persist'
// import storage from 'redux-persist/lib/storage';

import LayoutReducer from "./layouts/reducer";
import AuthReducer from "./auth/login/reducer";
import SellersReducer from "./pages/sellerSlice";
import LoginReducer from "./auth/login/reducer";



// import AccountReducer from "./auth/register/reducer";
// import ForgetPasswordReducer from "./auth/forgetpwd/reducer";
// import ProfileReducer from "./auth/profile/reducer";


// const persistConfig = {
//     key: 'root',
//     version: 1,
//     storage,
// };

// const persistedUserReducer = persistReducer(persistConfig, LoginReducer);

const reducer = combineReducers({
    Layout: LayoutReducer,
    auth:AuthReducer,
    Sellers: SellersReducer,
    // AuthUser: persistedUserReducer,
    // Account: AccountReducer,
    // ForgetPassword: ForgetPasswordReducer,
    // Profile: ProfileReducer

   
});

const store = configureStore({
    reducer,
    middleware: [thunk],
    devTools: true
});

// export const persistor = persistStore(store);
export default store;