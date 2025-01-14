import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Check, Eye, EyeOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useMutation } from '@tanstack/react-query';
import authApi from '@/api/authApi';
import { toast } from 'react-toastify';

export default function BusinessSettingsAccount() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [passwordError, setPasswordError] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));


    const changePasswordMutation = useMutation({
        mutationFn: authApi.changePassword,
        onSuccess: (data) => {
            console.log('success');
            setPasswordError('');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            toast.success('Password updated')

        },
        onError: (err) => {
            console.log('err', err);
            toast.error(err.response.data.message);
        }
    })

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return 'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.';
        }
        return '';
    };
    
    const handleChangePassword = () => {
        // Validate password confirmation
        if (newPassword !== confirmNewPassword) {
            return setPasswordError('Passwords do not match.');
        }
    
        // Validate password strength
        const validationError = validatePassword(newPassword);
        if (validationError) {
            return setPasswordError(validationError);
        }
    
        // Clear any existing errors and proceed
        setPasswordError('');

        changePasswordMutation.mutate({
            currentPassword: currentPassword,
            newPassword: newPassword,
            userId: user?._id,
        })
    
        // Handle password change logic
        console.log('Password Change:', { currentPassword, newPassword, confirmNewPassword });
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                    <CardDescription>
                        Manage your account security settings and connected devices.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <div className='relative'>
                            <Input id="current-password" type={showCurrentPassword ? "text" : "password"} onChange={(e) => setCurrentPassword(e.target.value)} value={currentPassword}/>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowCurrentPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex items-center px-2"
                            >
                                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <div className='relative'>
                            <Input id="new-password" type={showNewPassword ? 'text' : 'password'} onChange={(e) => setNewPassword(e.target.value)} value={newPassword} />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowNewPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex items-center px-2"
                            >
                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <div className="relative">
                            <Input id="confirm-password" type={showConfirmNewPassword ? 'text' : 'password'} onChange={(e) => setConfirmNewPassword(e.target.value)} value={confirmNewPassword} />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex items-center px-2"
                            >
                                {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>
                    {passwordError && (
                        <p className="text-red-500 text-xs mt-1 text-">{passwordError}</p>
                    )}
                    <Button className="mt-4" onClick={handleChangePassword}>Change Password</Button>
                    <Separator />
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                        <div className="flex items-center space-x-2">
                            <Switch id="2fa" />
                            <Label htmlFor="2fa">Enable two-factor authentication</Label>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium">Connected Devices</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">MacBook Pro</p>
                                    <p className="text-xs text-muted-foreground">Last active: 2 hours ago</p>
                                </div>
                                <Button variant="outline" size="sm">Disconnect</Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">iPhone 12</p>
                                    <p className="text-xs text-muted-foreground">Last active: 5 minutes ago</p>
                                </div>
                                <Button variant="outline" size="sm">Disconnect</Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
