import axios from "axios"
import { useSelector } from "react-redux";

const InitializeAxios = () => {
  axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL
  const TOKEN = useSelector((state) => state.adminAuth?.token);


  // const credentials = {
  //   "_id": "67d3525f3bc34e94a832e7b3",
  //   "profile": "",
  //   "firstName": "Alice",
  //   "lastName": "Smith",
  //   "email": "alice.smith@example.com"
  // }
  // document.cookie = `adminToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZDM1MjVmM2JjMzRlOTRhODMyZTdiMyIsImZpcnN0TmFtZSI6IkFsaWNlIiwibGFzdE5hbWUiOiJTbWl0aCIsImVtYWlsIjoiYWxpY2Uuc21pdGhAZXhhbXBsZS5jb20iLCJ1c2VyVHlwZSI6ImFkbWluIiwiaWF0IjoxNzUyNTUzNzM5fQ.0zwapwTet5cTyqKSQrtD5uD94GgzMHLheC_NN6QVbwk; path=/`
  // document.cookie = `adminCredentials=${JSON.stringify(credentials)}; path=/`

  console.log("TOKEN ===>", TOKEN);
  if (TOKEN) {
    console.log("condition true");
    axios.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`
  }
}

export default InitializeAxios