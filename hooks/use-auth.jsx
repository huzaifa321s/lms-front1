import { useSelector } from 'react-redux'

const UseAuth = () => {
  const isLoggedIn = useSelector((state) => state.studentAuth?.token)
    ? true
    : false
  const isTeacherLoggedIn = useSelector((state) => state.teacherAuth?.token)
    ? true
    : false

  const isAdminLoggedIn = useSelector((state) => state.adminAuth?.token)
    ? true
    : false
  return { isLoggedIn, isTeacherLoggedIn, isAdminLoggedIn }
}

export default UseAuth
