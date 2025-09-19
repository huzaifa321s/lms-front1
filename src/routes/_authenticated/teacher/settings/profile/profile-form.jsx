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
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { handleUpdateProfile } from '../../../../../shared/config/reducers/teacher/teacherAuthSlice'
import { useMutation } from '@tanstack/react-query'
import { PasswordInput } from '@/components/password-input'
import { IconLock } from '@tabler/icons-react'

export default function ProfileForm() {
  const dispatch = useDispatch()
  const credentials = useSelector((state) => state.teacherAuth.credentials)
  const [dp, setDp] = useState('')
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
    firstname: z
      .string()
      .min(2, {
        message: 'Firstname must be at least 2 characters.',
      })
      .max(30, {
        message: 'Firstname must not be longer than 30 characters.',
      }),
    lastname: z
      .string()
      .min(2, {
        message: 'Lastname must be at least 2 characters.',
      })
      .max(30, {
        message: 'Lastname must not be longer than 30 characters.',
      }),
    profile: z.string(),
    bio: z.string().max(160).min(4),
    qualification: z.string().optional(),
    address: z.string().optional(),
  })
console.log("crdes",credentials)
  const defaultValues = {
    firstname: credentials?.firstName || '',
    lastname: credentials?.lastName || '',
    bio: credentials?.bio || '',
    profile: '',
    qualification: credentials?.qualification || '',
    address: credentials?.address || '',
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
      endPoint === 'updatePassword' && setPassBtnLoading(true)
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
        const errorResponse = error.response.data
        if (endPoint === 'updatePassword') {
          toast.error(errorResponse.message)
        } else {
          toast.error(errorResponse.message)
        }
      } finally {
        setPassBtnLoading(false)
      }
    },
    [axios, toast, dispatch]
  )

  const mutation = useMutation({
    mutationFn: postData,
  })

  const saveChanges = useCallback(
    (data) => {
      const postObj = {
        profile: credentials?.profile,
        firstName: data.firstname,
        lastName: data.lastname,
        bio: data.bio,
        qualification: data.qualification,
        address: data.address
      }
      mutation.mutate(postObj)
    },
    [ credentials, mutation]
  )

  return (
   <div className="min-h-screen font-sans bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#f1f5f9]">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent mb-2">
              Profile Settings
            </h1>
            <p className="text-[#64748b] text-lg">
              Manage your personal information and account preferences
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[12px] p-6 border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#cbd5e1]/20 transition-all duration-300 sticky top-8">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#e2e8f0] shadow-lg bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
                    <img
                      className="w-full h-full object-cover"
                      src={
                        dp || credentials?.profile
                          ? `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}/teacher/profile/${credentials.profile}`
                          : defaultProfile
                      }
                      alt="Profile"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-[#1e293b] mb-1">
                  {credentials?.firstName} {credentials?.lastName}
                </h3>
                <p className="text-[#64748b] mb-4">{credentials?.email}</p>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-center text-[#64748b]">
                    <GraduationCap className="w-4 h-4 mr-2 text-[#2563eb]" />
                    {credentials?.qualification || 'Not provided'}
                  </div>
                  <div className="flex items-center justify-center text-[#64748b]">
                    <Home className="w-4 h-4 mr-2 text-[#2563eb]" />
                    {credentials?.address || 'Not provided'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information Card */}
            <div className="bg-white rounded-[12px] p-8 border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#cbd5e1]/20 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-full p-3 mr-4">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
                  Personal Information
                </h2>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((data) => saveChanges(data))}
                  className="space-y-6"
                >
                  {/* Profile Picture Upload */}
                  <FormField
                    control={form.control}
                    name="profile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#64748b] font-medium flex items-center">
                          <Camera className="w-4 h-4 mr-2 text-[#2563eb]" />
                          Profile Picture
                        </FormLabel>
                        <div className="flex items-center space-x-4">
                          <img
                            className="h-16 w-16 rounded-full border-2 border-[#e2e8f0] shadow-lg"
                            src={
                              dp || credentials?.profile
                                ? `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}/teacher/profile/${credentials.profile}`
                                : defaultProfile
                            }
                            alt="Current profile"
                          />
                          <Label
                            htmlFor="image"
                            className="cursor-pointer bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white px-4 py-2 rounded-[8px] hover:shadow-lg hover:scale-105 transition-all duration-300"
                          >
                            <Camera className="w-4 h-4 inline mr-2" />
                            Change Photo
                          </Label>
                          <FormControl>
                            <Input
                              id="image"
                              type="file"
                              accept="image/*"
                              {...field}
                              className="hidden"
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="text-[#ef4444]" />
                      </FormItem>
                    )}
                  />

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#64748b] font-medium">First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your first name"
                              className="bg-white rounded-[8px] border-[#e2e8f0] text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-[#94a3b8]">
                            Your first name as it appears on official documents
                          </FormDescription>
                          <FormMessage className="text-[#ef4444]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#64748b] font-medium">Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your last name"
                              className="bg-white rounded-[8px] border-[#e2e8f0] text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-[#94a3b8]">
                            Your family name or surname
                          </FormDescription>
                          <FormMessage className="text-[#ef4444]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Qualification and Address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="qualification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#64748b] font-medium flex items-center">
                            <GraduationCap className="w-4 h-4 mr-2 text-[#2563eb]" />
                            Qualification
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your highest qualification"
                              className="bg-white rounded-[8px] border-[#e2e8f0] text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-[#94a3b8]">
                            Your highest degree or certification
                          </FormDescription>
                          <FormMessage className="text-[#ef4444]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#64748b] font-medium flex items-center">
                            <Home className="w-4 h-4 mr-2 text-[#2563eb]" />
                            Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your address"
                              className="bg-white rounded-[8px] border-[#e2e8f0] text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-[#94a3b8]">
                            Your current mailing address
                          </FormDescription>
                          <FormMessage className="text-[#ef4444]" />
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
                        <FormLabel className="text-[#64748b] font-medium flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-[#2563eb]" />
                          Bio
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us a little bit about yourself..."
                            className="resize-none bg-white rounded-[8px] border-[#e2e8f0] text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 min-h-[100px] transition-all duration-300"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-[#94a3b8]">
                          Share a brief description about yourself (max 160 characters)
                        </FormDescription>
                        <FormMessage className="text-[#ef4444]" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={mutation.status === 'pending'}
                    className="w-full rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-semibold py-3 shadow-lg hover:shadow-[#cbd5e1]/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {mutation.status === 'pending' ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating Profile...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Save className="w-4 h-4 mr-2" />
                        Update Profile
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Password Change Card */}
            <div className="bg-white rounded-[12px] p-8 border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#cbd5e1]/20 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-full p-3 mr-4">
                  <IconLock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#ef4444] to-[#dc2626] bg-clip-text text-transparent">
                  Security Settings
                </h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-[#64748b] font-medium mb-2 block">
                      Current Password
                    </Label>
                    <PasswordInput
                      placeholder="Enter current password"
                      className="bg-white rounded-[8px] border-[#e2e8f0] text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300 hide-password-toggle"
                      onChange={handlePasswordChange}
                      name="password"
                    />
                  </div>

                  <div>
                    <Label className="text-[#64748b] font-medium mb-2 block">
                      New Password
                    </Label>
                    <PasswordInput
                      placeholder="Enter new password"
                      className="bg-white rounded-[8px] border-[#e2e8f0] text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300 hide-password-toggle"
                      onChange={handlePasswordChange}
                      name="newPassword"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    disabled={disabled1 || disabled2 || passBtnLoading}
                    onClick={() => postData(passwordObj, 'updatePassword')}
                    className="rounded-[8px] bg-gradient-to-r from-[#ef4444] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] text-white border-0 px-6 py-2 shadow-lg hover:shadow-[#cbd5e1]/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {passBtnLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <IconLock className="w-4 h-4 mr-2" />
                        Update Password
                      </div>
                    )}
                  </Button>
                </div>
              </div>

              {/* Custom styles for hiding browser password toggles */}
              <style>{`
                .hide-password-toggle::-ms-reveal,
                .hide-password-toggle::-ms-clear {
                  visibility: hidden;
                  pointer-events: none;
                  display: none;
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}