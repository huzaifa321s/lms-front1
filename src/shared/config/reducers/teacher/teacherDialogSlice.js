import { createSlice } from "@reduxjs/toolkit";

export const DialogSliceTeacher = createSlice({
    name:'dialogSliceTeacher',
    initialState:{
        isOpen:false,
        type:'',
        props:{
         
        }
    },
    reducers:{
        openModal:(state,action)=>{
if(action.payload.isOpen == false){
                 state.isOpen = false
            }else{
               state.isOpen = true
            }
            state.type = action.payload.type;
            state.props = action.payload.props;
            state.onClose = action.payload.onClose
        },
        closeModal:(state,action)=>{
state.isOpen = false;
            state.props = {};
        }
    }
})


export const {openModal,closeModal} = DialogSliceTeacher.actions
export default DialogSliceTeacher.reducer