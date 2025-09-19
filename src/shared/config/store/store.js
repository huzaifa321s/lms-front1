import { configureStore } from "@reduxjs/toolkit";
import { studentAuthSlice } from "../reducers/student/studentAuthSlice";
import { teacherAuthSlice } from "../reducers/teacher/teacherAuthSlice";
import { headerSlice } from "../reducers/HeaderSlice";
import {AlertSlice} from '../reducers/alertDetailsSlice'
import {AnimatedBgSlice} from '../reducers/animateBgSlice'
import { globalSlice } from "../reducers/globalDataSlice";
import { DialogSliceTeacher } from "../reducers/teacher/teacherDialogSlice";
import { StudentDialogSlice } from "../reducers/student/studentDialogSlice";
import { adminAuthSlice } from "../reducers/admin/adminAuthSlice";
import { DialogSlice } from "../reducers/admin/DialogSlice";

const store = configureStore({
  reducer: {
    header:headerSlice.reducer,
    globalSlice:globalSlice.reducer,
    studentAuth: studentAuthSlice.reducer,
    teacherAuth: teacherAuthSlice.reducer,
    adminAuth:adminAuthSlice.reducer,
    alertDetails:AlertSlice.reducer,
    bgSlice:AnimatedBgSlice.reducer,
    dialogSlice:DialogSlice.reducer,
    teacherDialogSlice:DialogSliceTeacher.reducer,
    studentDialogSlice:StudentDialogSlice.reducer
  },
});


export default store;