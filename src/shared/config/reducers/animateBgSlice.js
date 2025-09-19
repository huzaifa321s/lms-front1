import { createSlice } from "@reduxjs/toolkit";

export const AnimatedBgSlice = createSlice({
  name:'BgSlice',
  initialState:{
    title:"Dashboard"
  },
  reducers:{
    addTitle:(state,action) =>{
        state.title = action.payload.title;
    }
  }
})

export const {addTitle} = AnimatedBgSlice.actions;
export default AnimatedBgSlice.reducer