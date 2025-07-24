import { Link, useNavigate, useParams } from "react-router-dom"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import authApi from "@/api/authApi";
import { toast } from "react-toastify";

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const resetPasswordMutation = useMutation({
        mutationFn: authApi.resetPassword,
        onSuccess: (data) => {
            console.log(data.message, "reset password sent successfully");
            toast("Password updated successfully ");
            // navigate('/')
        },
        onError: (err) =>{
            toast.error(err.message);
        }
    })

    const handleResetPassword = (e) =>{
        e.preventDefault();
        resetPasswordMutation.mutate({
            password,
            token
        })
    }
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="mx-auto w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Reset Password</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Enter your new password
                    </p>
                </div>
                <form className="space-y-4" onSubmit={handleResetPassword}>
                    <div className="space-y-2">
                        <Label htmlFor="email">Enter New Password</Label>
                        <Input 
                        id="password" 
                        type="text" 
                        placeholder="Enter your new password" 
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                    </div>
                    <Button type="submit" className="w-full">
                        Reset Password
                    </Button>
                </form>
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Remember your password?{" "}
                    <Link to="/auth/login" className="font-medium underline" prefetch={false}>
                        Login
                    </Link>
                </div>
            </div>
        </div>
    )
}