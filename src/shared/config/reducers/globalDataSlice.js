import { createSlice } from "@reduxjs/toolkit";
import { getCookie } from "../../utils/helperFunction";
const suspenseLoading = getCookie('suspenseLoading')


export const globalSlice = createSlice({
  name: 'globalSlice',
  initialState: {
    suspenseLoading: getCookie('suspenseLoading') || false
  },
  reducers: {
    setLoading: (state, action) => {
      state.suspenseLoading = true
      document.cookie = `suspenseLoading=true; path=/`
    },
    setLoadingToFalse: (state, action) => {
      state.suspenseLoading = false
      document.cookie = `suspenseLoading=false; path=/`
    }
  }

})

export const { setLoading, setLoadingToFalse } = globalSlice.actions;
export default globalSlice.reducer;