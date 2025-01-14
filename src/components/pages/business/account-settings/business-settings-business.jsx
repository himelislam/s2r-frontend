import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import useBusiness from '@/hooks/useBusiness';
import { Check } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import businessApi from '@/api/businessApi';
import { toast } from 'react-toastify';
import Spinner from '@/components/spinner';

export default function BusinessSettingsBusiness() {
    const { businessState } = useBusiness();
    const user = JSON.parse(localStorage.getItem('user'))
    const [formData, setFormData] = useState({
        name: businessState.businessName || '',
        email: businessState.email || '',
        address: businessState.address || '',
        phone: businessState.phone || ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });
    };

    const updateBusinessProfileMutation = useMutation({
        mutationFn: businessApi.updateBusinessProfile,
        onSuccess: (data) => {
            toast.success(data.message)
        },
        onError: (err) => {
            toast.success(err.response.data.message)
        }
    })

    const handleUpdateBusinessProfile = () => {
        updateBusinessProfileMutation.mutate({
            businessId: user?.userId,
            businessName: formData.name,
            businessEmail: formData.email,
            address: formData.address,
            phone: formData.phone
        })
    }


    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Business</CardTitle>
                    <CardDescription>
                        Update your business profile information and avatar.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src="/placeholder.svg" alt="Avatar" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium">Business profile</h3>
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm">Change</Button>
                                <Button variant="outline" size="sm">Remove</Button>
                            </div>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Business Name</Label>
                            <Input
                                id="name"
                                placeholder={businessState?.businessName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Business Email</Label>
                            <Input id="email" placeholder={businessState?.businessEmail} type="email" onChange={handleChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" placeholder={businessState?.address} onChange={handleChange} type="text" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" placeholder={businessState?.phone} onChange={handleChange} type="number" />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="gap-2" onClick={handleUpdateBusinessProfile}>
                        <Check className="h-4 w-4" /> {updateBusinessProfileMutation.isPending
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
