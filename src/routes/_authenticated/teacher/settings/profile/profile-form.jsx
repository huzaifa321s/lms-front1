import { useCallback, useState } from 'react'
import { z } from 'zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  User,
  Camera,
  Save,
  FileText,
  GraduationCap,
  Home
} from 'lucide-react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'

import { handleUpdateProfile } from '../../../../../shared/config/reducers/teacher/teacherAuthSlice'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/password-input'

import { IconLock } from '@tabler/icons-react'

export default function ProfileForm({ teacherCreds }) {
  const dispatch = useDispatch()
  const [dp] = useState('')
  const [passBtnLoading, setPassBtnLoading] = useState(false)
  const [passwordObj, setPasswordObj] = useState({
    password: '',
    newPassword: '',
  })
  const disabled1 = passwordObj.password.trim() === ''
  const disabled2 = passwordObj.newPassword.trim() === ''

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordObj({ ...passwordObj, [name]: value })
  }

  const profileFormSchema = z.object({
    firstname: z.string().min(2).max(30),
    lastname: z.string().min(2).max(30),
    profile: z.string(),
    bio: z.string().min(4).max(160),
    qualification: z.string().optional(),
    address: z.string().optional(),
  })

  const defaultValues = {
    firstname: teacherCreds?.firstName || '',
    lastname: teacherCreds?.lastName || '',
    bio: teacherCreds?.bio || '',
    profile: '',
    qualification: teacherCreds?.qualification || '',
    address: teacherCreds?.address || '',
  }

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  const defaultProfile =
    'https://img.freepik.com/premium-vector/people-profile-graphic_24911-21373.jpg?w=826'

  const postData = useCallback(
    async (obj, endPoint = 'updateProfile') => {
      if (endPoint === 'updatePassword') setPassBtnLoading(true)
      try {
        let response = await axios.put(`/teacher/${endPoint}`, obj)
        response = response.data
        if (response.success) {
          if (endPoint === 'updateProfile') {
            document.cookie = `teacherCredentials=${JSON.stringify(
              response.data
            )}; path=/`
            dispatch(handleUpdateProfile(response.data))
          }
          toast.success(response.message)
        }
      } catch (error) {
        toast.error(error.response.data?.message || 'Error')
      } finally {
        setPassBtnLoading(false)
      }
    },
    [dispatch]
  )

  const mutation = useMutation({
    mutationFn: postData,
  })

  const saveChanges = useCallback(
    (data) => {
      const postObj = {
        profile: teacherCreds?.profile,
        firstName: data.firstname,
        lastName: data.lastname,
        bio: data.bio,
        qualification: data.qualification,
        address: data.address,
      }
      mutation.mutate(postObj)
    },
    [teacherCreds, mutation]
  )

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your personal information and account preferences
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-8">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg bg-gradient-to-br from-gray-100 to-gray-200">
                    <img
                      src={
                        dp || teacherCreds?.profile
                          ? `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}/teacher/profile/${teacherCreds.profile}`
                          : defaultProfile
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-blue-800 p-3 rounded-full shadow-lg hover:scale-110 cursor-pointer transition">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {teacherCreds?.firstName} {teacherCreds?.lastName}
                </h3>
                <p className="text-gray-500">{teacherCreds?.email}</p>
                <div className="space-y-2 mt-4 text-sm">
                  <div className="flex items-center justify-center text-gray-600">
                    <GraduationCap className="w-4 h-4 mr-2 text-blue-600" />
                    {teacherCreds?.qualification || 'Not provided'}
                  </div>
                  <div className="flex items-center justify-center text-gray-600">
                    <Home className="w-4 h-4 mr-2 text-blue-600" />
                    {teacherCreds?.address || 'Not provided'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Info Form */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-full p-3 mr-4">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Personal Information
                </h2>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(saveChanges)}
                  className="space-y-6"
                >
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Qualification & Address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="qualification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qualification</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter highest qualification" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Bio */}
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tell us about yourself" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    {mutation.status === 'pending' ? 'Updating...' : 'Update Profile'}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Password Form */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-full p-3 mr-4">
                  <IconLock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  Security Settings
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <PasswordInput
                    placeholder="Current password"
                    name="password"
                    onChange={handlePasswordChange}
                  />
                </div>
                <div>
                  <PasswordInput
                    placeholder="New password"
                    name="newPassword"
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  disabled={disabled1 || disabled2 || passBtnLoading}
                  onClick={() => postData(passwordObj, 'updatePassword')}
                >
                  {passBtnLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
