import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import authApi from '@/api/authApi';
import { Eye, EyeOff, Shield, Star, TrendingUp, Users, Zap } from 'lucide-react';
import { useUser } from '@/context/usercontext';
import { toast } from 'react-toastify';
import Spinner from '../spinner';
import InfoSidebar from './Infosidebar';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate()
  const { dispatch, userState } = useUser();

  console.log(userState, "from Login page");

  const loginMutation = useMutation({
    mutationFn: ({ email, password, dispatch }) => authApi.login({ email, password }, dispatch),
    onSuccess: (data) => {
      console.log('Login successful:', data);
      if (data.userType == 'owner') {
        navigate('/b/dashboard')
      } else if (data.userType == 'referrer') {
        navigate('/r/dashboard')
      } else if (data.userType == 'user') {
        navigate('/select-role')
      }
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
    <div className="flex h-screen w-full items-center justify-center">

      <InfoSidebar />

      {/* <LoginForm /> */}
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-white rounded-xl overflow-hidden p-1">
              <img
                src="https://cdn.cmsfly.com/680cda66c612a5002b6d29d1/images/Screenshot2025-07-24at103638PM-L1HtJ.png"
                alt=""
                className="w-full h-full object-cover rounded-sm"
              />
            </div>

            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ATTACH-N'-HATCH
            </span>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue your journey</CardDescription>
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
                  <Link to="/auth/forget-password" className="ml-auto inline-block text-sm underline">
                    Forgot password?
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
              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending
                  ? (
                    <>
                      Sign in <Spinner />
                    </>
                  )
                  : 'Sign in'}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Sign in with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to='/auth/signup' className="underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card >
    </div>




  )
}
