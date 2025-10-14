import { configureStore } from "@reduxjs/toolkit";
import { studentAuthSlice } from "../reducers/student/studentAuthSlice";
import { teacherAuthSlice } from "../reducers/teacher/teacherAuthSlice";
import { DialogSliceTeacher } from "../reducers/teacher/teacherDialogSlice";
import { StudentDialogSlice } from "../reducers/student/studentDialogSlice";
import { adminAuthSlice } from "../reducers/admin/adminAuthSlice";
import { DialogSlice } from "../reducers/admin/DialogSlice";

const store = configureStore({
  reducer: {
    studentAuth: studentAuthSlice.reducer,
    teacherAuth: teacherAuthSlice.reducer,
    adminAuth:adminAuthSlice.reducer,
    dialogSlice:DialogSlice.reducer,
    teacherDialogSlice:DialogSliceTeacher.reducer,
    studentDialogSlice:StudentDialogSlice.reducer
  },
});


export default store;