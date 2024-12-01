import { Link, useNavigate } from "react-router-dom"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import authApi from "@/api/authApi";
import { toast } from "react-toastify";

export default function ForgetPassword() {
    const [email, setEmail] = useState('');

    const ForgetPasswordMutation = useMutation({
        mutationFn: authApi.forgetPassword,
        onSuccess: (data) => {
            console.log(data.message, "forget password sent successfully");
            toast("varifaction mail sent to your inbox");
        },
        onError: (err) =>{
            toast.error(err.message);
            toast.error(err.message);
        }
    })

    const handleForgetPassword = (e) =>{
        e.preventDefault();
        ForgetPasswordMutation.mutate({
            email
        })
        console.log(email, 'from forgetpass');
    }
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="mx-auto w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Forgot Password</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>
                <form className="space-y-4" onSubmit={handleForgetPassword}>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email" 
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                    </div>
                    <Button type="submit" className="w-full">
                        Reset Password
                    </Button>
                </form>
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Remember your password?{" "}
                    <Link to="/login" className="font-medium underline" prefetch={false}>
                        Login
                    </Link>
                </div>
            </div>
        </div>
    )
}