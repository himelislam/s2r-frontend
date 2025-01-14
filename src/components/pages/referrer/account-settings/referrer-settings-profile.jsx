import refereeApi from '@/api/refereeApi'
import referrerApi from '@/api/referrerApi'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import useReferrer from '@/hooks/useReferrer'
import { useMutation } from '@tanstack/react-query'
import { Check } from 'lucide-react'
import React, { useState } from 'react'

export default function ReferrerSettingsProfile() {
    const {referrerState} = useReferrer();

    const user = JSON.parse(localStorage.getItem('user'))
    const [formData, setFormData] = useState({
        name: referrerState?.name || '',
        email: referrerState?.email || '',
        phone: referrerState?.phone || '',
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });
    };

    const updateReferrerProfileMutation = useMutation({
        mutationFn: referrerApi.updateReferrerProfile,
        onSuccess: (data) => {
            toast.success('Referrer updated successfully')
        },
        onError: (err) => {
            toast.error(err.response.data.message)
        }
    })

    const handleReferrerUpdateProfile = () => {
        updateReferrerProfileMutation.mutate({
            referrerId: user?.userId,
            userId: user?._id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone
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
                            <Input id="name" placeholder={referrerState?.name} onChange={handleChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" placeholder={referrerState?.email} onChange={handleChange} type="email" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="username">Phone</Label>
                            <Input id="phone" placeholder={referrerState?.phone} onChange={handleChange} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="gap-2" onClick={handleReferrerUpdateProfile}>
                        <Check className="h-4 w-4" /> Save changes
                    </Button>
                </CardFooter>
            </Card>
        </>
    )
}
