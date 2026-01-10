import { useCallback, useState } from 'react'
import { z } from 'zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  User,
  Camera,
  GraduationCap,
  Home,
  Lock
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
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/password-input'
import { getFileUrl } from '@/utils/globalFunctions'


export default function ProfileForm({ teacherCreds }) {
  const dispatch = useDispatch()
  const [dp, setDp] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
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
      const formData = new FormData()
      formData.append('firstName', data.firstname)
      formData.append('lastName', data.lastname)
      formData.append('bio', data.bio)

      if (data.qualification) formData.append('qualification', data.qualification)
      if (data.address) formData.append('address', data.address)

      if (selectedFile) {
        formData.append('profile', selectedFile)
      }

      mutation.mutate(formData)
    },
    [teacherCreds, mutation, selectedFile]
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] font-sans">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent mb-3">
            Profile Settings
          </h1>
          <p className="text-[#64748b] text-lg max-w-2xl mx-auto">
            Manage your personal information and account preferences
          </p>
        </header>

        {/* Layout Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Profile Card */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-[16px] border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] p-6 sticky top-10">
              <div className="text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#f1f5f9] shadow-lg bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0]">
                    <img
                      src={
                        dp ||
                        (teacherCreds?.profile
                          ? getFileUrl(teacherCreds.profile, 'public/teacher/profile')
                          : defaultProfile)
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label
                    htmlFor="profile-upload"
                    className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] p-2.5 rounded-full shadow-md hover:scale-110 cursor-pointer transition"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </label>
                  <Input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setSelectedFile(file)
                        setDp(URL.createObjectURL(file))
                      }
                    }}
                  />
                </div>

                {/* Name & Info */}
                <h3 className="text-xl font-semibold text-[#1e293b]">
                  {teacherCreds?.firstName} {teacherCreds?.lastName}
                </h3>
                <p className="text-[#64748b] text-sm">{teacherCreds?.email}</p>

                {/* Additional Info */}
                <div className="space-y-2 mt-5 text-sm">
                  <div className="flex items-center justify-center text-[#475569]">
                    <GraduationCap className="w-4 h-4 mr-2 text-[#2563eb]" />
                    {teacherCreds?.qualification || 'Not provided'}
                  </div>
                  <div className="flex items-center justify-center text-[#475569]">
                    <Home className="w-4 h-4 mr-2 text-[#2563eb]" />
                    {teacherCreds?.address || 'Not provided'}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-2 space-y-10">
            {/* Personal Info Section */}
            <section className="bg-white rounded-[16px] border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] p-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-full p-3 mr-4">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
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
                            <Input
                              placeholder="Enter highest qualification"
                              {...field}
                            />
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
                          <Textarea
                            placeholder="Tell us about yourself..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                  >
                    {mutation.status === "pending"
                      ? "Updating..."
                      : "Update Profile"}
                  </Button>
                </form>
              </Form>
            </section>

            {/* Password Section */}
            <section className="bg-white rounded-[16px] border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] p-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-full p-3 mr-4">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#ef4444] to-[#dc2626] bg-clip-text text-transparent">
                  Security Settings
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <PasswordInput
                  placeholder="Current password"
                  name="password"
                  onChange={handlePasswordChange}
                />
                <PasswordInput
                  placeholder="New password"
                  name="newPassword"
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  disabled={disabled1 || disabled2 || passBtnLoading}
                  onClick={() => postData(passwordObj, "updatePassword")}
                >
                  {passBtnLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );

}
