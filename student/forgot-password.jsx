import { useCallback, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { createFileRoute, Link } from '@tanstack/react-router'
import { CheckCircleIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ForgotPassword({ disabled }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [linkSent, setLinkSent] = useState(false)

  const handleSendEmail = useCallback(
    async (data) => {
      if (disabled) return
      setIsLoading(true)
      try {
        let response = await axios.post('/student/forgotPassword', data)
        response = response.data
        if (response.success) {
          toast.success(response.message)
          reset()
          setLinkSent(true)
        }
      } catch (error) {
        console.log('error', error)
        toast.error(error.response?.data?.message || 'Something went wrong')
      } finally {
        setIsLoading(false)
      }
    },
    [reset, disabled]
  )

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-lg">
        {linkSent ? (
          <>
            <div className="mt-8 text-center">
              <CheckCircleIcon className="text-success inline-block w-32" />
            </div>
            <p className="my-4 text-center text-xl font-bold">Link Sent</p>
            <p className="mt-4 mb-8 text-center font-semibold">
              Check your email to reset password
            </p>
            <div className="mt-4 text-center">
              <Link to="/student/login" onClick={() => setLinkSent(false)}>
                <Button size="sm" className="text-sm">
                  Login
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Forgot Password</CardTitle>
              <CardDescription>
                We will send password reset link on your email Id
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(handleSendEmail)}>
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label
                        htmlFor="email"
                        className={errors.email ? 'text-red-500' : ''}
                      >
                        Email
                      </Label>
                      <Input
                        type="text"
                        placeholder="Email"
                        {...register('email', { required: true })}
                      />
                      {errors.email && (
                        <span className="text-red-500">required</span>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                      loading={isLoading}
                    >
                      Send Reset Link
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Go To
                    <Link
                      to="/student/login"
                      className="ml-1 underline underline-offset-4"
                      disabled={disabled}
                    >
                      Login
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/student/forgot-password')({
  component: ForgotPassword,
})
