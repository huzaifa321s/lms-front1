import axios from "axios";

 export const getAdminCreds = async() =>{
    try{
       let response = await axios.get('/admin/get-creds');
       response = response.data
       if(response.success) {
         response = response.data
        return response
       }
    }catch(error){
      console.log('error',error);
    }
  }