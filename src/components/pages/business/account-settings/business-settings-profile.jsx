import authApi from '@/api/authApi';
import businessApi from '@/api/businessApi';
import Spinner from '@/components/spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useMutation } from '@tanstack/react-query';
import { Check, Loader2, Plus } from 'lucide-react';
import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify';

export default function BusinessSettingsProfile() {
    const user = JSON.parse(localStorage.getItem('user'))
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });
    const [imageUrl, setImageUrl] = useState('')
    const fileInputRef = useRef(null);

    // Trigger file input when avatar is clicked
    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

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
            userId: user?._id,
            url: imageUrl
        })
    }

    // profile image upload
    const updateProfileImageMutation = useMutation({
        mutationFn: authApi.uploadImage,
        onSuccess: (data) => {
            console.log(data, "success");
            setImageUrl(data.url);
            toast.success('Image uploaded successfully')
        },
        onError: (err) => {
            console.log(err, "errror on file upload");
            toast.error('Unable to upload image.')
        }
    })

    // Handle file selection
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            updateProfileImageMutation.mutate(formData);
        }
    };

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
                        <div
                            className="relative h-24 w-24 cursor-pointer"
                            onClick={handleAvatarClick}
                        >
                            <Avatar className="h-full w-full">
                                <AvatarImage src={imageUrl || user?.url} alt="Avatar" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>

                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-full">
                                {updateProfileImageMutation.isPending ? (
                                    <Loader2 className="h-6 w-6 text-white animate-spin" /> // Spinner icon
                                ) : (
                                    <Plus className="h-6 w-6 text-white" /> // Plus icon
                                )}
                            </div>
                        </div>

                        {/* Hidden file input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium">Profile picture</h3>
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm" onClick={handleAvatarClick}>Upload</Button>
                                <Button variant="outline" size="sm">Remove</Button>
                            </div>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name"
                                onChange={handleChange}
                                placeholder={user?.name}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email"
                                type="email"
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
