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
import { useSearchParams } from "react-router-dom"
import useReferrer from "@/hooks/useReferrer"
import ReferrerSettingsProfile from "./account-settings/referrer-settings-profile"
import ReferrerSettingsAccount from "./account-settings/referrer-settings-account"
import ReferrerSettingsNotifications from "./account-settings/referrer-settings-notification"
import ReferrerSettingsDisplay from "./account-settings/referrer-settings-display"


export default function ReferrerAccountSettings() {
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
                            </TabsList>
                        </aside>
                        <div className="flex-1">
                            <TabsContent value="profile" className="space-y-6">
                                <ReferrerSettingsProfile/>
                            </TabsContent>
                            <TabsContent value="account" className="space-y-6">
                                <ReferrerSettingsAccount/>
                            </TabsContent>
                            <TabsContent value="notifications" className="space-y-6">
                                <ReferrerSettingsNotifications/>
                            </TabsContent>
                            <TabsContent value="display" className="space-y-6">
                                <ReferrerSettingsDisplay/>
                            </TabsContent>
                        </div>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}
