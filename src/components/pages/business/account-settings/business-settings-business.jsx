import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import useBusiness from '@/hooks/useBusiness';
import { Check } from 'lucide-react';

export default function BusinessSettingsBusiness() {
    const { businessState } = useBusiness();
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
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder={businessState?.businessName} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" placeholder={businessState?.businessEmail} type="email" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" placeholder={businessState?.address} type="text" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" placeholder={businessState?.phone} type="number" />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="gap-2">
                        <Check className="h-4 w-4" /> Save changes
                    </Button>
                </CardFooter>
            </Card>
        </>
    )
}
