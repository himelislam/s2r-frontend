import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Check } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

export default function ReferrerSettingsAccount() {
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
        </>
    )
}
