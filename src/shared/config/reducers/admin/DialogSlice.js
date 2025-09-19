import { createSlice } from "@reduxjs/toolkit";
export const DialogSlice = createSlice({
    name: 'dialog',
    initialState: {
        isOpen: false,
        type: '',
        props: {

        }
    },
    reducers: {
        openModal: (state, action) => {
            if (action.payload.isOpen == false) {
                state.isOpen = false
            } else {
                state.isOpen = true
            }
            state.type = action.payload.type;
            state.props = action.payload.props;
        },
        closeModal: (state, action) => {
            state.isOpen = false;
            state.props = {};
        }
    }
})

export const { openModal, closeModal } = DialogSlice.actions;
export default DialogSlice.reducer