import businessApi from '@/api/businessApi';
import Spinner from '@/components/spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useMutation } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

export default function BusinessSettingsProfile() {

    const user = JSON.parse(localStorage.getItem('user'))
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });
    };

    const updateProfileMutation = useMutation({
        mutationFn: businessApi.updateProfile,
        onSuccess: (data) => {
            toast.success('User updated successfully')
        },
        onError: (err) => {
            toast.error(err.response.data.message)
        }
    })

    const handleUpdateProfile = () => {
        updateProfileMutation.mutate({
            name: formData.name,
            email: formData.email,
            businessId: user?.userId,
            userId: user?._id
        })
    }
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>
                        Update your profile information and avatar.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src="/placeholder.svg" alt="Avatar" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium">Profile picture</h3>
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm">Change</Button>
                                <Button variant="outline" size="sm">Remove</Button>
                            </div>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder={user?.name}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder={user?.email} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="gap-2" type="submit" onClick={handleUpdateProfile}>
                        <Check className="h-4 w-4" />
                        {updateProfileMutation.isPending
                            ? (
                                <>
                                    Save Changes <Spinner />
                                </>
                            )
                            : 'Save Changes'}
                    </Button>
                </CardFooter>
            </Card>
        </>
    )
}
