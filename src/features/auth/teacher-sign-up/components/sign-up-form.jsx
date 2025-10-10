import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ClipboardIcon, Images } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/password-input'
import { handleLogin } from '../../../../shared/config/reducers/student/studentAuthSlice'
import { useAppUtils } from '../../../../hooks/useAppUtils'


const MAX_FILE_SIZE = 1024 * 1024 * 5
const ACCEPTED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]
const ACCEPTED_IMAGE_TYPES = ['jpeg', 'jpg', 'png', 'webp']
const formSchema = z
  .object({
    profile: z
      .any()
      .refine((files) => {
        return files?.[0]?.size <= MAX_FILE_SIZE
      }, `Max image size is 5MB.`)
      .refine(
        (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
        'Only .jpg, .jpeg, .png and .webp formats are supported.'
      ),
    firstName: z
      .string()
      .min(3, { message: 'First name must be at least 3 characters long.' }),
    lastName: z
      .string()
      .min(3, { message: 'Lirst name must be at least 3 characters long.' }),
    email: z
      .string()
      .min(1, { message: 'Please enter your email' })
      .email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(1, {
        message: 'Please enter your password',
      })
      .min(7, {
        message: 'Password must be at least 7 characters long',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export function SignUpForm({ className, ...props }) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const {dispatch,navigate} = useAppUtils()
  
  async function onSubmit(data) {
    setIsLoading(true)
    const RegisterationForm = new FormData()
    for (const key in data) {
      RegisterationForm.append(key, data[key])
    }
    console.log('RegsiterationForm ===>', RegisterationForm)
    try {
      let response = await axios.post('/teacher/register', RegisterationForm)
      response = response.data
      if (response.success) {
        // localStorage.setItem("teacherEmail", JSON.stringify(registerObj.email));
        // navigate('/teacher/verify-otp');
        // navigate('/student/login');
        const { token, credentials } = response.data
        document.cookie = `teacherToken=${token}; path=/`
        document.cookie = `teacherCredentials=${JSON.stringify(credentials)}; path=/`
        dispatch(handleLogin({ token, credentials }));
        toast.success('Registered successfully')
        navigate({ to: '/teacher' })
      }
    } catch (error) {
      console.log('error', error)
      toast.error(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  const [selectedImage, setSelectedImage] = useState(null)

  return (  <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn('grid gap-4', className)}
          {...props}
        >
          {/* Profile Image Preview */}
          <div className="flex justify-center">
            {selectedImage ? (
              <div className="relative h-[110px] w-[110px] rounded-full border-2 border-[#2563eb]/20 overflow-hidden transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-full bg-[#e2e8f0] p-4 transition-all duration-300 hover:bg-[#2563eb]/10">
                <Images size={56} className="text-[#64748b]" />
              </div>
            )}
          </div>

          {/* Profile Image Upload */}
          <FormField
            control={form.control}
            name="profile"
            render={({ field }) => (
              <FormItem className="flex justify-center">
                <FormControl>
                  <Button
                    size="sm"
                    type="button"
                    variant="outline"
                    
                  >
                    <Input
                      type="file"
                      className="hidden"
                      id="fileInput"
                      accept="image/*"
                      onBlur={field.onBlur}
                      name={field.name}
                      onChange={(e) => {
                        field.onChange(e.target.files)
                        setSelectedImage(e.target.files?.[0] || null)
                      }}
                      ref={field.ref}
                    />
                    <Label htmlFor="fileInput" className="flex items-center gap-2 cursor-pointer">
                      <ClipboardIcon className="h-4 w-4 text-[#64748b]" />
                      <span className="whitespace-nowrap text-[#64748b] font-medium">
                        Choose your image
                      </span>
                    </Label>
                  </Button>
                </FormControl>
                <FormMessage className="text-[#ef4444] text-center" />
              </FormItem>
            )}
          />

          {/* First Name */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-[#1e293b]">
                  First Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="First Name"
                    className="rounded-[8px] border-[#e2e8f0] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 text-[#1e293b] transition-all duration-300 hover:shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[#ef4444]" />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-[#1e293b]">
                  Last Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Last Name"
                    className="rounded-[8px] border-[#e2e8f0] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 text-[#1e293b] transition-all duration-300 hover:shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[#ef4444]" />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-[#1e293b]">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    className="rounded-[8px] border-[#e2e8f0] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 text-[#1e293b] transition-all duration-300 hover:shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[#ef4444]" />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-[#1e293b]">
                  Password
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="********"
                    className="rounded-[8px] border-[#e2e8f0] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 text-[#1e293b] transition-all duration-300 hover:shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[#ef4444]" />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-[#1e293b]">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="********"
                    className="rounded-[8px] border-[#e2e8f0] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 text-[#1e293b] transition-all duration-300 hover:shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[#ef4444]" />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            
            disabled={isLoading}
            loading={isLoading}
          >
            Create Account
          </Button>
        </form>
      </Form>
  )
}
