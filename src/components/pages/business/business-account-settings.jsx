import React from "react"
import { User, Mail, Lock, Bell, Smartphone, Globe, CreditCard, LogOut, Check, AlertCircle } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useBusiness from "@/hooks/useBusiness"
import { useSearchParams } from "react-router-dom"

export default function BusinessAccountSettings() {
    const user = JSON.parse(localStorage.getItem('user'))
    const { businessState } = useBusiness();

    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = searchParams.get("tab") || "profile";

    const handleTabChange = (tabValue) => {
        setSearchParams({ tab: tabValue });
    };

    return (
        <div className="container max-w-6xl space-y-6">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <Tabs value={currentTab} onValueChange={handleTabChange} className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:space-x-12">
                        <aside className="lg:w-1/6">
                            <TabsList className="grid w-full grid-cols-1 gap-2">
                                <TabsTrigger value="profile" className="justify-start gap-2">
                                    <User className="h-4 w-4" />
                                    Profile
                                </TabsTrigger>
                                <TabsTrigger value="business" className="justify-start gap-2">
                                    <User className="h-4 w-4" />
                                    Business
                                </TabsTrigger>
                                <TabsTrigger value="account" className="justify-start gap-2">
                                    <Lock className="h-4 w-4" />
                                    Account
                                </TabsTrigger>
                                <TabsTrigger value="notifications" className="justify-start gap-2">
                                    <Bell className="h-4 w-4" />
                                    Notifications
                                </TabsTrigger>
                                <TabsTrigger value="display" className="justify-start gap-2">
                                    <Globe className="h-4 w-4" />
                                    Display
                                </TabsTrigger>
                                <TabsTrigger value="billing" className="justify-start gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    Billing
                                </TabsTrigger>
                            </TabsList>
                        </aside>

                        <div className="flex-1">
                            <TabsContent value="profile" className="space-y-6">
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
                                                <Input id="name" placeholder={user?.name} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input id="email" placeholder={user?.email} type="email" />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="gap-2">
                                            <Check className="h-4 w-4" /> Save changes
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>

                            <TabsContent value="business" className="space-y-6">
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
                            </TabsContent>
                            <TabsContent value="account" className="space-y-6">
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
                                            <Input id="current-password" type="password" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input id="new-password" type="password" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                                            <Input id="confirm-password" type="password" />
                                        </div>
                                        <Button className="mt-4">Change Password</Button>
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
                            </TabsContent>
                            <TabsContent value="notifications" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Notifications</CardTitle>
                                        <CardDescription>
                                            Choose what notifications you want to receive.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Email notifications</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive emails about your account activity.
                                                </p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Push notifications</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive push notifications in your browser.
                                                </p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Monthly newsletter</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive our monthly newsletter with updates.
                                                </p>
                                            </div>
                                            <Switch />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="display" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Display</CardTitle>
                                        <CardDescription>
                                            Customize your display preferences.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Language</Label>
                                            <Select defaultValue="en">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="en">English</SelectItem>
                                                    <SelectItem value="es">Spanish</SelectItem>
                                                    <SelectItem value="fr">French</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Dark mode</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Switch between light and dark mode.
                                                </p>
                                            </div>
                                            <Switch />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="billing" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Billing and Plans</CardTitle>
                                        <CardDescription>
                                            Manage your billing information and subscription plan.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="rounded-lg border p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">Free Plan</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Basic features with limited access
                                                    </p>
                                                </div>
                                                <Button variant="outline">Upgrade</Button>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="space-y-2">
                                            <Label>Payment method</Label>
                                            <div className="rounded-lg border p-4">
                                                <div className="flex items-center space-x-4">
                                                    <CreditCard className="h-6 w-6" />
                                                    <div>
                                                        <p className="font-medium">No payment method added</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Add a payment method to upgrade your plan
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </div>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}
