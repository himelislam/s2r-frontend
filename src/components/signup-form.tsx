// import Link from "next/link"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import authApi from "../api/authApi"

export function SignupForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate()

    const signupMutation = useMutation({
        mutationFn: authApi.signup,
        onSuccess: (data) => {
            console.log('Signup successful:', data);
            navigate('/select-role')
        },
        onError: (error) => {
            console.error('Signup failed:', error?.message);
        },
    })

    const handleSignupForm = (e) => {
        e.preventDefault()
        signupMutation.mutate({
            name,
            email,
            password
        })
    }

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Sign Up</CardTitle>
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
                            Sign up
                        </Button>
                        <Button variant="outline" className="w-full">
                            Signup with Google
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
    )
}
