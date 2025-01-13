import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { CreditCard } from 'lucide-react'
import React from 'react'

export default function BusinessSettingsBilling() {
    return (
        <>
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
        </>
    )
}
