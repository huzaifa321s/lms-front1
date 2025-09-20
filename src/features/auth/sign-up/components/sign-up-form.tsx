import { useActionState, useEffect, useState } from 'react';
import { z } from 'zod';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useDispatch } from 'react-redux';
import { ClipboardIcon, Images } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/password-input';
import { handleLogin } from '../../../../shared/config/reducers/student/studentAuthSlice';

type SignUpFormProps = HTMLAttributes<HTMLFormElement>;

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const formSchema = z
  .object({
    profile: z
      .any()
      .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
      .refine(
        (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
        'Only .jpg, .jpeg, .png and .webp formats are supported.'
      ),
    firstName: z.string().min(3, { message: 'First name must be at least 3 characters long.' }),
    lastName: z.string().min(3, { message: 'Last name must be at least 3 characters long.' }),
    email: z.string().min(1, { message: 'Please enter your email' }).email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(1, { message: 'Please enter your password' })
      .min(7, { message: 'Password must be at least 7 characters long' }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, { message: 'You must agree to the terms and conditions.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      profile: null,
      terms: false,
    },
    mode: 'onSubmit',
  });

  const [state, submitAction, isPending] = useActionState(
    async (_, formData) => {
      try {
        const response = await axios.post('/student/register', formData);
        if (response.data.success) {
          const { token, credentials } = response.data.data;
          dispatch(handleLogin({ token, credentials }));
          toast.success('Registered successfully');
          return { success: true };
        }
        throw new Error(response.data.message || 'Registration failed');
      } catch (error) {
        console.log('error',error)
        const errorMessage = error.response?.data?.message || 'Failed to register. Please try again.';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    { success: null, error: null }
  );

  useEffect(() => {
    if (state.success) {
      navigate({ to: '/student/login' });
      form.reset();
    }
  }, [state.success, navigate, form]);

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <Form {...form}>
      <form
        action={submitAction}
        className={cn('space-y-6', className)}
        style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}
        {...props}
      >
        {/* Enhanced Profile Image Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group">
            {selectedImage ? (
              <div className="relative h-28 w-28 rounded-full border-4 border-[#2563eb] shadow-lg overflow-hidden">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected profile"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="h-28 w-28 rounded-full border-4 border-dashed border-[#e2e8f0] bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] flex items-center justify-center group-hover:border-[#2563eb] group-hover:bg-[#2563eb]/5 transition-all duration-300">
                <div className="flex flex-col items-center space-y-2">
                  <Images size={32} className="text-[#94a3b8] group-hover:text-[#2563eb] transition-colors duration-300" />
                  <span className="text-xs text-[#64748b] font-medium">Add Photo</span>
                </div>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-[#2563eb] border-4 border-white shadow-lg flex items-center justify-center">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>

          <FormField
            control={form.control}
            name="profile"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="fileInput"
                      accept="image/*"
                      onBlur={field.onBlur}
                      name={field.name}
                      onChange={(e) => {
                        field.onChange(e.target.files);
                        setSelectedImage(e.target.files?.[0] || null);
                      }}
                      ref={field.ref}
                      disabled={isPending}
                    />
                    <Button
                      size="sm"
                      type="button"
                      variant="outline"
                      className="pointer-events-none border-[#e2e8f0] bg-white text-[#475569] hover:bg-[#f8fafc] hover:border-[#2563eb] hover:text-[#2563eb] rounded-[8px] px-4 py-2 font-medium transition-all duration-200"
                    >
                      <ClipboardIcon className="mr-2 h-4 w-4" />
                      Choose Profile Image
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-[#ef4444] text-sm font-medium text-center" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-[#1e293b]">First Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter your first name"
                      className="w-full rounded-[8px] border-2 border-[#e2e8f0] bg-white py-3 px-4 text-[#1e293b] placeholder-[#94a3b8] transition-all duration-300 hover:border-[#cbd5e1] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                      disabled={isPending}
                      aria-label="First Name"
                      {...field}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="h-4 w-4 text-[#64748b]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-[#ef4444] text-sm font-medium" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-[#1e293b]">Last Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter your last name"
                      className="w-full rounded-[8px] border-2 border-[#e2e8f0] bg-white py-3 px-4 text-[#1e293b] placeholder-[#94a3b8] transition-all duration-300 hover:border-[#cbd5e1] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                      disabled={isPending}
                      aria-label="Last Name"
                      {...field}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="h-4 w-4 text-[#64748b]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-[#ef4444] text-sm font-medium" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-[#1e293b]">Email Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full rounded-[8px] border-2 border-[#e2e8f0] bg-white py-3 px-4 pr-10 text-[#1e293b] placeholder-[#94a3b8] transition-all duration-300 hover:border-[#cbd5e1] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                    disabled={isPending}
                    aria-label="Email Address"
                    {...field}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="h-4 w-4 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-[#ef4444] text-sm font-medium" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-[#1e293b]">Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Create a strong password"
                    className="w-full rounded-[8px] border-2 border-[#e2e8f0] bg-white py-3 px-4 text-[#1e293b] placeholder-[#94a3b8] transition-all duration-300 hover:border-[#cbd5e1] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                    disabled={isPending}
                    aria-label="Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[#ef4444] text-sm font-medium" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-[#1e293b]">Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Confirm your password"
                    className="w-full rounded-[8px] border-2 border-[#e2e8f0] bg-white py-3 px-4 text-[#1e293b] placeholder-[#94a3b8] transition-all duration-300 hover:border-[#cbd5e1] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                    disabled={isPending}
                    aria-label="Confirm Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[#ef4444] text-sm font-medium" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 rounded-[8px] bg-[#f8fafc] border border-[#e2e8f0]">
                  <FormControl>
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-0.5 h-4 w-4 text-[#2563eb] border-[#e2e8f0] rounded focus:ring-[#2563eb]/20 focus:ring-2"
                      disabled={isPending}
                      {...field}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                  <label htmlFor="terms" className="text-sm text-[#64748b] cursor-pointer">
                    I agree to the{' '}
                    <a href="#" className="text-[#2563eb] hover:text-[#1d4ed8] font-medium hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-[#2563eb] hover:text-[#1d4ed8] font-medium hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>
              <FormMessage className="text-[#ef4444] text-sm font-medium" />
            </FormItem>
          )}
        />

        {state.error && (
          <p className="text-[#ef4444] text-sm text-center" role="alert">
            {state.error}
          </p>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#d97706] hover:to-[#b45309] text-white font-semibold py-3 px-6 rounded-[8px] shadow-sm transition-all duration-300 hover:shadow-[0_4px_12px_rgba(245,158,11,0.25)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-6"
          aria-label="Create Account"
        >
          {isPending ? (
            <div className="flex items-center justify-center gap-2">
              Creating Account...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
              Create Account
            </div>
          )}
        </Button>
      </form>
    </Form>
  );
}