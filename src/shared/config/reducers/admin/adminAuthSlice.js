import { createSlice } from '@reduxjs/toolkit'
import { clearCookie, getCookie } from '../../../utils/helperFunction';




// export const getLeadsContent = createAsyncThunk('/teacher/auth', async () => {
// 	const response = await axios.get('/api/users?page=2', {})
// 	return response.data;
// })

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
        handleLogout: (state) => {
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

    extraReducers: (builder) => {
        // builder
        // // Register
        // .addCase(getLeadsContent.pending, (state) => {
        //   state.isLoading = true;
        // })
        // .addCase(getLeadsContent.fulfilled, (state, action) => {
        //   state.leads = action.payload.data;
        //   state.isLoading = false;
        // })
        // .addCase(getLeadsContent.rejected, (state, action) => {
        //   state.isLoading = false;
        // });
    },
});

export const { handleLogin, handleLogout, handleUpdateProfile } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
