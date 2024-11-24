import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import authApi from '@/api/authApi';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      console.log('Login successful:', data.userType);
      if(data.userType == 'owner'){
        navigate('/b/dashboard')
      }else if(data.userType == 'referrer'){
        navigate('/r/dashboard')
      }
      // navigate('/dashboard')
    },
    onError: (error) => {
      console.error('Login failed:', error?.message);
    },
  })

  const handleLoginFrom = (e) => {
    e.preventDefault()
    loginMutation.mutate({
      email,
      password
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
            <div className="grid gap-2">
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
