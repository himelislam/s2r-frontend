import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import authApi from '@/api/authApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useUser } from '@/context/usercontext';
import { toast } from 'react-toastify';
import businessApi from '@/api/businessApi';

export default function ReferrerSignup() {
    const { businessId, campaignId, email: paramEmail, name: paramName } = useParams();
    const [name, setName] = useState(paramName || '');
    const [email, setEmail] = useState(paramEmail || '');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const navigate = useNavigate()
    const {dispatch} = useUser();

    console.log(businessId, paramEmail, paramName);

    const signupMutation = useMutation({
        // mutationFn: authApi.signup,
        mutationFn: ({name, email, password, dispatch}) => authApi.signup({name, email, password}, dispatch),
        onSuccess: (data) => {
            console.log('Signup successful:', data);
            navigate(`/referrer-invitation-setup/${businessId}/${campaignId}/${email}/${name}`)
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

    const { data: busienss = [] } = useQuery({
        queryKey: ['getBusinessById', businessId],
        queryFn: () => businessApi.getBusinessById(businessId),
        enabled: !!businessId,
      })

      console.log(busienss, "bs");
    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            {/* <SignupForm/> */}
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Sign Up as a Referrer under: {busienss?.name}</CardTitle>
                    <CardDescription>
                        Enter your email below to signup to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignupForm}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder={paramName}
                                    value={name}
                                    required
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={paramEmail}
                                    value={email}
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
                            <Button type="submit" className="w-full">
                                Sign up
                            </Button>
                            <Button variant="outline" className="w-full">
                                Signup with Google
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>

    )
}
