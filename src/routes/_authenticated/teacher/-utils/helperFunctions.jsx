import axios from "axios";

 export const getTeacherCreds = async() =>{
    try{
       let response = await axios.get('teacher/get-creds');
       response = response.data
       if(response.success) {
         response = response.data
         console.log('response after',response)
        return response
       }
    }catch(error){
      console.log('error',error);
    }
  }