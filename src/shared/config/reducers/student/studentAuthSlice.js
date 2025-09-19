import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { clearCookie, getCookie } from '../../../utils/helperFunction';



// export const getLeadsContent = createAsyncThunk('/teacher/auth', async () => {
// 	const response = await axios.get('/api/users?page=2', {})
// 	return response.data;
// })

export const studentAuthSlice = createSlice({
    name: "studentAuth",
    initialState: {
        token: getCookie("studentToken") || null,
        credentials: getCookie('studentCredentials') || null,
        subscription: getCookie("studentSubscription") || null,
        courses: getCookie("studentCourses") || null,
    },
    reducers: {
        // Login / Logout
        handleLogin: (state, action) => {
            const { token, credentials, subscription } = action.payload;
            console.log('credentials innner ====>', credentials)
            state.token = token;
            state.credentials = credentials
            state.subscription = subscription
            document.cookie = `studentToken=${token}; path=/`;
            delete credentials.subscription;
            const enrolledCourses = credentials.enrolledCourses;
            delete credentials.enrolledCourses
            console.log('credentials logged ===>', credentials)
            document.cookie = `studentCredentials=${JSON.stringify(credentials)}; path=/`;
            document.cookie = `studentSubscription=${JSON.stringify(subscription)}; path=/`;
            document.cookie = `studentCourses=${JSON.stringify(enrolledCourses)}; path=/`;

        },
        handleLogout: (state) => {
            state.token = null;
            state.credentials = null;
            state.subscription = null;
            clearCookie("teacherToken")
            clearCookie("teacherCredentials")
            clearCookie("studentToken")
            clearCookie("studentCredentials")
            clearCookie("studentSubscription")
            clearCookie("adminToken")
            clearCookie("adminCredentials")
        },
        handleUpdateProfile: (state, action) => {
            const updatedCredentials = { ...state.credentials, ...action.payload };
            state.credentials = updatedCredentials;
        },

        setCustomerId: (state, action) => {
            const updatedCredentials = { ...state.credentials, customerId: action.payload };
            state.credentials = updatedCredentials;
            document.cookie = `studentCredentials=${JSON.stringify(updatedCredentials)}; path=/`;

        },
        updateSubscription: (state, action) => {
            const { subscription, remainingEnrollmentCount } = action.payload;
            const updatedCredentials = {
                ...state.credentials, subscription, remainingEnrollmentCount,
            };
            state.subscription = subscription;
            console.log('subscription Slice ===>', subscription)
            state.credentials = updatedCredentials
            document.cookie = `studentSubscription=${JSON.stringify(subscription)}; path=/`;
        },
        handleCourseEnrollment: (state, action) => {
            let enrolledCourses = state.credentials.enrolledCourses;
            const { id, remainingEnrollmentCount } = action.payload;
            const updatedCredentials = {
                ...state.credentials,
                remainingEnrollmentCount,
                enrolledCourses: [...enrolledCourses, id]
            };
            state.credentials = updatedCredentials;
            document.cookie = `studentCredentials=${JSON.stringify(updatedCredentials)}; path=/`;
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

export const { handleLogin, handleLogout, handleUpdateProfile, setCustomerId, updateSubscription, handleCourseEnrollment } = studentAuthSlice.actions;

export default studentAuthSlice.reducer;
