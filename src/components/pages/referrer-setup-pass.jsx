import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import authApi from '@/api/authApi';
import { Eye, EyeOff } from 'lucide-react';
import { useUser } from '@/context/usercontext';
import { toast } from 'react-toastify';
import Spinner from '../spinner';


export default function ReferrerSetupPass() {
    const { businessId, referrerId, email } = useParams();
    const [passwordError, setPasswordError] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate()
    // const { dispatch, userState } = useUser();

    console.log(businessId, referrerId, email, "from Login page");

    const signupMutation = useMutation({
        mutationFn: authApi.referrerSetupPass,
        // mutationFn: ({ businessId, referrerId, email, password }) => authApi.referrerSetupPass({ businessId, referrerId,email, password }),
        onSuccess: (data) => {
            console.log(data, "Login successful:");
            if (data.userType == 'owner') {
                navigate('/b/dashboard')
            } else if (data.userType == 'referrer') {
                navigate('/r/dashboard')
            } else if (data.userType == 'user') {
                navigate('/select-role')
            }
            // navigate('/dashboard')
        },
        onError: (error) => {
            console.error('Login failed:', error?.message);
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

    const handleLoginFrom = (e) => {
        e.preventDefault()
        signupMutation.mutate({
            businessId,
            referrerId,
            email,
            password,
        })
    }

    return (
        <div className="flex h-screen w-full items-center justify-center px-4">

            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">To Access the dashboard</CardTitle>
                    <CardDescription>
                        Please set up a password
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
                                    value={email}
                                    disabled
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
                                            Signup <Spinner />
                                        </>
                                    )
                                    : 'Signup'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card >
        </div>
    )
}
