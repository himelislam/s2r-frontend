import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useMutation,  } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import authApi from '@/api/authApi';
import { Eye, EyeOff } from 'lucide-react';
import { useUser } from '@/contexts/usercontext';
import { toast } from 'react-toastify';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate()
  const { dispatch, userState } = useUser();

  console.log(userState, "from Login page");

  const loginMutation = useMutation({
    // mutationFn: authApi.login,
    mutationFn: ({ email, password, dispatch }) => authApi.login({ email, password }, dispatch), // Pass dispatch
    onSuccess: (data) => {
      console.log('Login successful:', data.userType);
      if (data.userType == 'owner') {
        navigate('/b/dashboard')
      } else if (data.userType == 'referrer') {
        navigate('/r/dashboard')
      } else if(data.userType == 'user'){
        navigate('/select-role')
      }
      // navigate('/dashboard')
    },
    onError: (error) => {
      console.error('Login failed:', error?.message);
      toast.error(error?.response?.data?.message)
    },
  })

  const handleLoginFrom = (e) => {
    e.preventDefault()
    loginMutation.mutate({
      email,
      password,
      dispatch
    })
    console.log(email, "hemail");
    console.log(password, "hpass");
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      {/* <LoginForm /> */}
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLoginFrom}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {/* <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="/" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
          </div> */}

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forget-password" className="ml-auto inline-block text-sm underline">
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative">
                  {/* Password Input */}
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10" // Add padding for the eye button
                  />
                  {/* Eye Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to='/signup' className="underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card >
    </div>
  )
}
