import { createSlice } from '@reduxjs/toolkit'
import { clearCookie, getCookie } from '../../../utils/helperFunction';

export const studentAuthSlice = createSlice({
    name: "studentAuth",
    initialState: {
        token: getCookie("studentToken") || null,
        credentials: getCookie('studentCredentials') || null,
        subscription: getCookie("studentSubscription") || null,
        courses: JSON.parse(localStorage.getItem('studentCourses')) ?? [],

    },
    reducers: {
        // Login / Logout
        handleLogin: (state, action) => {
            const { token, credentials, subscription } = action.payload;
            console.log('credentials innner ====>', credentials)
            state.token = token;
            state.credentials = credentials
            state.subscription = subscription
            state.courses = credentials.enrolledCourses;
            const enrolledCourses = credentials.enrolledCourses;
            const updatedCreds = {
                _id: credentials._id,
                email: credentials.email,
                profile: credentials.profile,
                bio: credentials.bio,
                firstName: credentials.firstName,
                lastName: credentials.lastName,
                dateOfBirth: credentials.dateOfBirth,
                phone: credentials.phone,
                remainingEnrollmentCount: credentials.remainingEnrollmentCount,
                status: credentials.status,
                notifications: [],
                customerId: credentials.customerId,
                createdAt: credentials.createdAt,
                updatedAt: credentials.updatedAt

            }
            console.log('credentials logged ===>', credentials)
            document.cookie = `studentToken=${token}; path=/`;
            document.cookie = `studentCredentials=${JSON.stringify(updatedCreds)}; path=/`;
            document.cookie = `studentSubscription=${JSON.stringify(subscription)}; path=/`;
            if (enrolledCourses && enrolledCourses.length > 0) {
                localStorage.setItem('studentCourses', JSON.stringify(enrolledCourses));
            }


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
            state.subscription = subscription;
            const updatedCredentials = {
                ...state.credentials, subscription, remainingEnrollmentCount,
            };
            console.log('subscription Slice ===>', subscription)
            state.credentials = updatedCredentials
            document.cookie = `studentSubscription=${JSON.stringify(subscription)}; path=/`;
        },
        handleCourseEnrollment: (state, action) => {
            const { id, remainingEnrollmentCount } = action.payload;

            state.credentials = {
                ...state.credentials,
                remainingEnrollmentCount,
            };


            const updatedEnrolledCourses = [...state.courses, id];
            state.courses = updatedEnrolledCourses;

            if (updatedEnrolledCourses.length > 0) {
                localStorage.setItem("studentCourses", JSON.stringify(updatedEnrolledCourses));
            } else {
                localStorage.removeItem("studentCourses"); // optional: clear if empty
            }
        },

    }
});

export const { handleLogin, handleLogout, handleUpdateProfile, setCustomerId, updateSubscription, handleCourseEnrollment } = studentAuthSlice.actions;

export default studentAuthSlice.reducer;
