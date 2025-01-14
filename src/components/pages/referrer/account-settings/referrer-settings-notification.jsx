import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Check } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

export default function ReferrerSettingsNotifications() {
    return (
        <>
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
        </>
    )
}
