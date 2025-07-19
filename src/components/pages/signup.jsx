import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import authApi from '@/api/authApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Eye, EyeOff, Shield, Star, TrendingUp, Users, Zap } from 'lucide-react';
import { useUser } from '@/context/usercontext';
import { toast } from 'react-toastify';
import Spinner from '../spinner';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const navigate = useNavigate()
    const { dispatch } = useUser();

    const signupMutation = useMutation({
        // mutationFn: authApi.signup,
        mutationFn: ({ name, email, password, dispatch }) => authApi.signup({ name, email, password }, dispatch),
        onSuccess: (data) => {
            console.log('Signup successful:', data);
            navigate('/select-role')
        },
        onError: (error) => {
            console.error('Signup failed:', error?.message);
            toast.error(error?.response?.data?.message)
        },
    })

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        // Regex validation for password
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(value)) {
            setPasswordError(
                'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.'
            );
        } else {
            setPasswordError('');
        }
    };


    const handleSignupForm = (e) => {
        e.preventDefault()
        if (passwordError) {
            return; // Prevent submission if password is invalid
        }
        signupMutation.mutate({
            name,
            email,
            password,
            dispatch
        })
    }
    return (
        <div className="flex h-screen w-full items-center justify-center">




            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                    <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-center px-16 py-4 text-white">
                    <div className="">
                        {/* Logo and Brand */}
                        <div className="flex items-center gap-3 my-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl flex items-center justify-center">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-2xl font-bold">ATTACH-N'-HATCH</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl font-bold mb-4 leading-tight">
                            Turn Referrals into Revenue with
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                {" "}
                                QR Campaigns
                            </span>
                        </h1>

                        <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                            Empower businesses to launch trackable referral campaigns, reward promoters, and grow their customer base—all through dynamic QR codes and seamless automation.
                        </p>

                        {/* Features */}
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <Zap className="w-4 h-4 text-blue-400" />
                                </div>
                                <span className="text-blue-100">Multi-Campaign Management </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                    <Users className="w-4 h-4 text-purple-400" />
                                </div>
                                <span className="text-blue-100">Dynamic QR Codes</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-green-400" />
                                </div>
                                <span className="text-blue-100">Referrer Rewards System </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-yellow-400" />
                                </div>
                                <span className="text-blue-100">Advanced analytics & insights</span>
                            </div>
                        </div>

                        {/* Testimonial */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
                            <div className="flex items-center gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-blue-100 mb-4 italic">
                                "Attach-n-Hatch helped us triple our referrals in just 3 months. The automated tracking and rewards system saved us hours of manual work!"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">SJ</span>
                                </div>
                                <div>
                                    <div className="font-semibold text-white">Sarah Johnson</div>
                                    <div className="text-blue-300 text-sm">Product Manager, TechCorp</div>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        {/* <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">10K+</div>
                <div className="text-blue-300 text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">50K+</div>
                <div className="text-blue-300 text-sm">Projects Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">99.9%</div>
                <div className="text-blue-300 text-sm">Uptime</div>
              </div>
            </div> */}
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-10 right-10 w-20 h-20 border border-white/20 rounded-full"></div>
                <div className="absolute bottom-10 right-20 w-16 h-16 border border-white/20 rounded-full"></div>
                <div className="absolute top-1/2 right-5 w-2 h-2 bg-white/40 rounded-full"></div>
                <div className="absolute top-1/3 right-12 w-1 h-1 bg-white/60 rounded-full"></div>
            </div>


            {/* <SignupForm/> */}
            <Card className="mx-auto max-w-sm">
                {/* <CardHeader>
                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                    <CardDescription>
                        Enter your email below to signup to your account
                    </CardDescription>
                </CardHeader> */}

                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ATTACH-N'-HATCH
                        </span>
                    </div>
                    <CardTitle className="text-2xl font-bold">Sign up</CardTitle>
                    <CardDescription>Enter your email below to signup to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignupForm}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder=""
                                    required
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
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
                                    {/* <Link to="/" className="ml-auto inline-block text-sm underline">
                                        Forgot your password?
                                    </Link> */}
                                </div>
                                <div className="relative">
                                    {/* Password Input */}
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        // onChange={(e) => setPassword(e.target.value)}
                                        onChange={handlePasswordChange}
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
                                {/* Password Error Message */}
                                {passwordError && (
                                    <p className="text-red-500 text-xs mt-1 text-">{passwordError}</p>
                                )}
                            </div>
                            <Button type="submit" className="w-full" disabled={signupMutation.isPending}>
                                {signupMutation.isPending
                                    ? (
                                        <>
                                            Sign up <Spinner />
                                        </>
                                    )
                                    : 'Sign up'}
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
                                Sign up with Google
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link to='/login' className="underline">
                                Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>

    )
}
