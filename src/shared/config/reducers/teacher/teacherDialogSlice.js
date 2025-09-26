import { createSlice } from "@reduxjs/toolkit";

export const DialogSliceTeacher = createSlice({
    name: 'dialogSliceTeacher',
    initialState: {
        isOpen: false,
        type: '',
        props: {

        }
    },
    reducers: {
        openModalTeacher: (state, action) => {
            if (action.payload.isOpen == false) {
                state.isOpen = false
            } else {
                state.isOpen = true
            }
            state.type = action.payload.type;
            state.props = action.payload.props;
        },
        closeModalTeacher: (state, action) => {
            state.isOpen = false;
            state.props = {};
        }
    }
})


export const { openModalTeacher, closeModalTeacher } = DialogSliceTeacher.actions
export default DialogSliceTeacher.reducer