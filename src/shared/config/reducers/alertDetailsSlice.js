import { createSlice } from "@reduxjs/toolkit";

export const AlertSlice = createSlice({
    name:'alert',
    initialState:{
        condition:false,
        title:"",
        description:"",
        variant:""
    },
    reducers:{
        showAlert:(state,action) => {
            state.condition = true
   
        }
    }
})

export const { showAlert } = AlertSlice.actions;

export default AlertSlice.reducer