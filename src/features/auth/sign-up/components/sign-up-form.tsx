import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { ClipboardIcon, Images, Camera } from 'lucide-react'
import { useDispatch } from 'react-redux'
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

type SignUpFormProps = HTMLAttributes<HTMLFormElement>
const MAX_FILE_SIZE = 1024 * 1024 * 5
const ACCEPTED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]
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
      .min(3, { message: 'Last name must be at least 3 characters long.' }),
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

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  async function onSubmit(data: z.infer<typeof formSchema>) {
    if(props.disabled) return
    setIsLoading(true)
    const RegisterationForm = new FormData()
    for (const key in data) {
      RegisterationForm.append(key, data[key])
    }
    console.log('RegsiterationForm ===>', RegisterationForm)
    try {
      let response = await axios.post('/student/register', RegisterationForm)
      response = response.data
      if (response.success) {
        const { token, credentials } = response.data
        dispatch(handleLogin({ token, credentials }))
        toast.success('Registered successfully')
        navigate({ to: '/student/login' })
      }
    } catch (error) {
      console.log('error', error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
  <Form {...form}>
  <form
    onSubmit={form.handleSubmit(onSubmit)}
    className={cn('grid grid-cols-1 md:grid-cols-2 gap-4', className)} // two-column layout with gap
    {...props}
  >
    {/* Profile Image Section */}
    <div className='col-span-1 md:col-span-2 flex flex-col items-center space-y-4 my-6'>
      <div className='relative group'>
        {selectedImage ? (
          <div className='relative h-20 w-20 rounded-full border-4 border-blue-500 overflow-hidden ring-2 ring-blue-100 transition-all duration-300 group-hover:scale-105'>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt='Selected profile'
              className='h-full w-full object-cover'
            />
            <div className='absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity'>
              <Camera className='w-5 h-5 text-white' />
            </div>
          </div>
        ) : (
          <div className='h-20 w-20 rounded-full border-2 border-dashed border-slate-300 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center group-hover:border-blue-400'>
            <Images size={24} className='text-slate-400 group-hover:text-blue-500' />
          </div>
        )}
        <div className='absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white flex items-center justify-center group-hover:scale-110 transition-transform'>
          <Camera className='h-4 w-4 text-white' />
        </div>
      </div>

      <FormField
        control={form.control}
        name='profile'
        render={({ field }) => (
          <FormItem className='w-full md:w-auto'>
            <FormControl>
              <div className='relative'>
                <Input
                  type='file'
                  className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
                  id='fileInput'
                  accept='image/*'
                  onBlur={field.onBlur}
                  name={field.name}
                  onChange={(e) => {
                    field.onChange(e.target.files)
                    setSelectedImage(e.target.files?.[0] || null)
                  }}
                  ref={field.ref}
                />
                <Button
                  size='sm'
                  type='button'
                  variant='outline'
                  className='pointer-events-none border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 rounded-lg px-4 py-2 text-sm shadow-sm'
                >
                  {selectedImage ? 'Change Photo' : 'Choose Photo'}
                </Button>
              </div>
            </FormControl>
            <FormMessage className='text-red-500 text-xs text-center' />
          </FormItem>
        )}
      />
    </div>

    {/* First & Last Name */}
    <FormField
      control={form.control}
      name='firstName'
      render={({ field }) => (
        <FormItem>
          <FormLabel className='text-sm font-medium text-slate-700'>First Name</FormLabel>
          <FormControl>
            <Input
              placeholder='John'
              className='h-9 rounded-md border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm'
              {...field}
            />
          </FormControl>
          <FormMessage className='text-red-500 text-xs' />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name='lastName'
      render={({ field }) => (
        <FormItem>
          <FormLabel className='text-sm font-medium text-slate-700'>Last Name</FormLabel>
          <FormControl>
            <Input
              placeholder='Doe'
              className='h-9 rounded-md border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm'
              {...field}
            />
          </FormControl>
          <FormMessage className='text-red-500 text-xs' />
        </FormItem>
      )}
    />

    {/* Email */}
    <FormField
      control={form.control}
      name='email'
      render={({ field }) => (
        <FormItem className='col-span-1 md:col-span-2'>
          <FormLabel className='text-sm font-medium text-slate-700'>Email Address</FormLabel>
          <FormControl>
            <Input
              type='email'
              placeholder='you@example.com'
              className='h-9 rounded-md border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm'
              {...field}
            />
          </FormControl>
          <FormMessage className='text-red-500 text-xs' />
        </FormItem>
      )}
    />

    {/* Password & Confirm */}
    <FormField
      control={form.control}
      name='password'
      render={({ field }) => (
        <FormItem>
          <FormLabel className='text-sm font-medium text-slate-700'>Password</FormLabel>
          <FormControl>
            <PasswordInput
              placeholder='••••••••'
              className='h-9 rounded-md border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm'
              {...field}
            />
          </FormControl>
          <FormMessage className='text-red-500 text-xs' />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name='confirmPassword'
      render={({ field }) => (
        <FormItem>
          <FormLabel className='text-sm font-medium text-slate-700'>Confirm Password</FormLabel>
          <FormControl>
            <PasswordInput
              placeholder='••••••••'
              className='h-9 rounded-md border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm'
              {...field}
            />
          </FormControl>
          <FormMessage className='text-red-500 text-xs' />
        </FormItem>
      )}
    />

    {/* Submit Button */}
    <div className='col-span-1 md:col-span-2'>
      <Button
        type='submit'
        disabled={isLoading}
        className='w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-md shadow-sm transition-all duration-200 disabled:opacity-50'
      >
        {isLoading ? 'Creating Account...' : 'Create Student Account'}
      </Button>
    </div>
  </form>
</Form>

  )
}