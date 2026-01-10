import axios from "axios";

export const getTeacherCreds = async () => {
  try {
    const response = await axios.get('teacher/get-creds');
    if (response.data.success) {
      console.log('teacher creds response', response.data.data)
      return response.data.data
    }
    throw new Error(response.data.message || 'Failed to fetch teacher credentials')
  } catch (error) {
    console.error('Error fetching teacher credentials:', error);
    throw error;
  }
}