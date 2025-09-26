import { createSlice } from '@reduxjs/toolkit'
import { clearCookie, getCookie } from '../../../utils/helperFunction';

export const adminAuthSlice = createSlice({
    name: "adminAuth",
    initialState: {
        token: getCookie("adminToken") || null,
        credentials: getCookie("adminCredentials") || null,
    },
    reducers: {
        handleLogin: (state, action) => {
            const { token, credentials } = action.payload;
            state.token = token;
            state.credentials = credentials
        },
        handleLogoutAdmin: (state) => {
            state.token = null;
            state.credentials = null
            clearCookie("teacherToken")
            clearCookie("teacherCredentials")
            clearCookie("studentToken")
            clearCookie("studentCredentials")
            clearCookie("studentSubscription")
            clearCookie("adminToken")
            clearCookie("adminCredentials")
        },
        handleUpdateProfile: (state, action) => {
            state.credentials = action.payload;
        }
    },

});

export const { handleLogin, handleLogoutAdmin, handleUpdateProfile } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
