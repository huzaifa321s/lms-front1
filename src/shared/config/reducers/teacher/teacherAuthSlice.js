
import { createSlice } from '@reduxjs/toolkit'
import { clearCookie, getCookie } from '../../../utils/helperFunction';

export const teacherAuthSlice = createSlice({
    name: "teacherAuth",
    initialState: {
        token: getCookie("teacherToken") || null,
        credentials: getCookie("teacherCredentials") || null,
    },
    reducers: {
        handleLogin: (state, action) => {
            const { token, credentials } = action.payload;
            state.token = token;
            state.credentials = credentials
        },
        handleLogoutTeacher: (state) => {
            state.token = null;
            state.credentials = null;
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

export const { handleLogin, handleLogoutTeacher, handleUpdateProfile } = teacherAuthSlice.actions;

export default teacherAuthSlice.reducer;