import React, { useState } from "react"
import { User, Mail, Lock, Bell, Smartphone, Globe, CreditCard, LogOut, Check, AlertCircle, Sun, Moon } from 'lucide-react'

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
import { DropdownMenu } from "@radix-ui/react-dropdown-menu"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMutation } from "@tanstack/react-query"
import businessApi from "@/api/businessApi"
import { toast } from "react-toastify"
import BusinessSettingsProfile from "./account-settings/business-settings-profile"
import BusinessSettingsBusiness from "./account-settings/business-settings-business"
import BusinessSettingsAccount from "./account-settings/business-settings-account"
import BusinessSettingsNotifications from "./account-settings/business-settings-notifications"
import BusinessSettingsDisplay from "./account-settings/business-settings-display"
import BusinessSettingsBilling from "./account-settings/business-settings-billing"

export default function BusinessAccountSettings() {
    const [searchParams, setSearchParams] = useSearchParams();
    const user = JSON.parse(localStorage.getItem('user'))
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
                                <BusinessSettingsProfile/>
                            </TabsContent>

                            <TabsContent value="business" className="space-y-6">
                                <BusinessSettingsBusiness/>
                            </TabsContent>
                            <TabsContent value="account" className="space-y-6">
                               <BusinessSettingsAccount/>
                            </TabsContent>
                            <TabsContent value="notifications" className="space-y-6">
                                <BusinessSettingsNotifications/>
                            </TabsContent>
                            <TabsContent value="display" className="space-y-6">
                                <BusinessSettingsDisplay/>
                            </TabsContent>
                            <TabsContent value="billing" className="space-y-6">
                                <BusinessSettingsBilling/>
                            </TabsContent>
                        </div>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}
