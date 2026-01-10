import { useCallback, useState } from "react"
import { z } from "zod"
import axios from "axios"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, User, Phone, Camera, Save, CalendarPlusIcon as CalendarLucide, FileText, Lock } from "lucide-react"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { handleUpdateProfile } from "../../../../../shared/config/reducers/student/studentAuthSlice"
import { useMutation } from "@tanstack/react-query"
import { PasswordInput } from "@/components/password-input"
import { getFileUrl } from '@/utils/globalFunctions'

export default function ProfileForm() {
  const dispatch = useDispatch()
  const credentials = useSelector((state) => state.studentAuth.credentials, shallowEqual)
  const [dp, setDp] = useState("")
  const [date, setDate] = useState("")
  const [phone, setPhone] = useState(credentials?.phone)
  const [phoneError, setPhoneError] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [passBtnLoading, setPassBtnLoading] = useState(false)
  const [passwordObj, setPasswordObj] = useState({
    password: "",
    newPassword: "",
  })
  const disabled1 = passwordObj.password.trim() === "" && true
  const disabled2 = passwordObj.newPassword.trim() === "" && true

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordObj({ ...passwordObj, [name]: value })
  }

  const profileFormSchema = z.object({
    firstname: z
      .string()
      .min(2, {
        message: "Firstname must be at least 2 characters.",
      })
      .max(30, {
        message: "Firstname must not be longer than 30 characters.",
      }),
    lastname: z
      .string()
      .min(2, {
        message: "Lastname must be at least 2 characters.",
      })
      .max(30, {
        message: "Lastname must not be longer than 30 characters.",
      }),
    dob: z.any().superRefine((value) => {
      const date = new Date(value)
      const updatedDate = date.setDate(date.getDate() + 1)
      setDate(updatedDate)
    }),
    profile: z.any().optional(),
    bio: z.string().max(160).min(4),
  })

  const defaultValues = {
    firstname: credentials?.firstName || "",
    lastname: credentials?.lastName || "",
    bio: credentials?.bio ? credentials.bio : "",
    dob: credentials?.dateOfBirth,
    profile: "",
  }

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const defaultProfile = "https://img.freepik.com/premium-vector/people-profile-graphic_24911-21373.jpg?w=826"

  const postData = useCallback(
    async (obj, endPoint = "updateProfile") => {
      endPoint === "updatePassword" && setPassBtnLoading(true)
      try {
        console.log("obj ===>", obj)
        const isFormData = obj instanceof FormData
        let response = await axios.put(`/student/${endPoint}`, obj)
        response = response.data
        console.log("Registration response -> ", response)
        if (response.success) {
          if (endPoint === "updateProfile") {
            document.cookie = `studentCredentials=${JSON.stringify(response.data)}; path=/`
            dispatch(handleUpdateProfile(response.data))
          }
          toast.success(response.message)
        }
      } catch (error) {
        console.log("error", error)
        const errorResponse = error.response?.data
        if (endPoint === "updatePassword") {
          toast.error(errorResponse?.message || "Failed to update password")
        } else {
          toast.error(errorResponse?.message || "Failed to update profile")
        }
      } finally {
        setPassBtnLoading(false)
      }
    },
    [axios, toast, dispatch],
  )

  const mutation = useMutation({
    mutationFn: postData,
  })

  const saveChanges = useCallback(
    (data) => {
      console.log("date ===>", date)
      const formData = new FormData()
      formData.append("firstName", data.firstname)
      formData.append("lastName", data.lastname)

      if (data.bio) formData.append("bio", data.bio)

      const dob = date || credentials?.dateOfBirth
      if (dob) formData.append("dateOfBirth", dob)

      if (phone) formData.append("phone", phone)

      if (selectedFile) {
        formData.append("profile", selectedFile)
      }
      // Do not append profile string if no file is selected, to avoid messing up backend logic

      mutation.mutate(formData)
    },
    [phone, date, selectedFile, credentials, mutation],
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
            Profile Settings
          </h1>
          <p className="text-slate-600 text-lg">Manage your personal information and account preferences</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr,3fr] gap-4">
          {/* Profile Overview Card */}
          <div className="max-w-sm mx-auto lg:mx-0">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 sticky top-12">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                    <img
                      className="w-full h-full object-cover"
                      src={
                        dp || (credentials?.profile
                          ? getFileUrl(credentials.profile, 'public/student/profile')
                          : defaultProfile)
                      }
                      alt="Profile"
                      loading="lazy"
                    />
                    {console.log("sssss", getFileUrl(credentials.profile, 'public/student/profile'))}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-slate-800 mb-1">
                  {credentials?.firstName} {credentials?.lastName}
                </h3>
                <p className="text-slate-600 mb-4">{credentials?.email}</p>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-center text-slate-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {credentials?.phone || "Not provided"}
                  </div>
                  <div className="flex items-center justify-center text-slate-600">
                    <CalendarLucide className="w-4 h-4 mr-2" />
                    {credentials?.dateOfBirth
                      ? format(new Date(credentials.dateOfBirth), "MMM dd, yyyy")
                      : "Not provided"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form Section */}
          <div className="space-y-4">
            {/* Personal Information Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-3 mr-4">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Personal Information
                </h2>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => saveChanges(data))} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Picture Upload */}
                    <FormField
                      control={form.control}
                      name="profile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium flex items-center">
                            <Camera className="w-4 h-4 mr-2" />
                            Profile Picture
                          </FormLabel>
                          <div className="flex items-center space-x-4">
                            <img
                              className="h-16 w-16 rounded-full border-2 border-blue-100 shadow-lg object-cover"
                              src={
                                dp || (credentials?.profile
                                  ? getFileUrl(credentials.profile, 'public/student/profile')
                                  : defaultProfile)
                              }
                              alt="Current profile"
                            />
                            <Label
                              htmlFor="image"
                              className="cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                            >
                              <Camera className="w-4 h-4 inline mr-2" />
                              Change Photo
                            </Label>
                            <FormControl>
                              <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    setSelectedFile(file)
                                    setDp(URL.createObjectURL(file))
                                    field.onChange(e.target.files) // Update form state if needed
                                  }
                                }}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Bio */}
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium flex items-center">
                            <FileText className="w-4 h-4 mr-2" />
                            Bio
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us a little bit about yourself..."
                              className="resize-none bg-white border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 rounded-lg min-h-[100px] transition-all duration-300"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-slate-500">
                            Share a brief description about yourself (max 160 characters)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Fields */}
                    <FormField
                      control={form.control}
                      name="firstname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your first name"
                              className="bg-white border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-300"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-slate-500">
                            Your first name as it appears on official documents
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your last name"
                              className="bg-white border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-300"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-slate-500">Your family name or surname</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Date of Birth */}
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-slate-700 font-medium flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            Date of Birth
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal bg-white border-slate-200 hover:bg-slate-50 transition-all duration-300",
                                    !field.value && "text-slate-400",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Select your date of birth</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white shadow-xl border-slate-200" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                captionLayout="dropdown"
                                className="rounded-lg"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription className="text-slate-500">
                            Your date of birth is used to calculate your age
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phone Number */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className={cn("text-slate-700 font-medium flex items-center", phoneError && "text-red-500")}
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <PhoneInput
                              className="bg-white border border-slate-200 rounded-lg px-3 py-2 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-300"
                              international
                              placeholder="Enter your phone number"
                              value={phone || ""}
                              onChange={(e) => {
                                setPhone(e)
                                if (e) {
                                  setPhoneError("")
                                } else {
                                  setPhoneError("Phone number is required")
                                }
                              }}
                            />
                          </FormControl>
                          <FormDescription className="text-slate-500">
                            We'll use this to contact you about important updates
                          </FormDescription>
                          {phoneError && <span className="text-red-500 text-sm">{phoneError}</span>}
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={mutation.status === "pending"}
                  >
                    {mutation.status === "pending" ? (
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
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-full p-3 mr-4">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  Security Settings
                </h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-slate-700 font-medium mb-2 block">Current Password</Label>
                    <PasswordInput
                      placeholder="Enter current password"
                      className="bg-white border-slate-200 focus:border-red-300 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-300"
                      onChange={handlePasswordChange}
                      name="password"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-700 font-medium mb-2 block">New Password</Label>
                    <PasswordInput
                      placeholder="Enter new password"
                      className="bg-white border-slate-200 focus:border-red-300 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-300"
                      onChange={handlePasswordChange}
                      name="newPassword"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    disabled={disabled1 || disabled2 || passBtnLoading}
                    onClick={() => postData(passwordObj, "updatePassword")}
                  >
                    {passBtnLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Lock className="w-4 h-4 mr-2" />
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
