"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Gift, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useNavigate, useParams } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { Loader } from "@/components/pages/loader"
import campaignApi from "@/api/campaignApi"

export default function RewardSystemForm() {
    const [rewardType, setRewardType] = useState(undefined)
    const [giftCardMethod, setGiftCardMethod] = useState("add-later")
    const navigate = useNavigate()
    const { campaignId } = useParams();
    const [campaign, setCampaign] = useState(null);

    // Handle showing the appropriate gift card setup method
    const handleGiftCardMethodChange = (value) => {
        setGiftCardMethod(value)

        // Hide all method-specific content
        document.querySelectorAll("#gift-card-options > div").forEach((el) => {
            el.classList.add("hidden")
        })

        // Show the selected method's content
        const selectedEl = document.querySelector(`#gift-card-options > div[data-method="${value}"]`)
        if (selectedEl) {
            selectedEl.classList.remove("hidden")
        }
    }

    useEffect(() => {
        if (rewardType === "giftcard") {
            handleGiftCardMethodChange(giftCardMethod)
        }
    }, [rewardType, giftCardMethod])




    const getCampaignbyIdMutation = useMutation({
        mutationFn: campaignApi.getCampaignById,
        onSuccess: (data) => {
            setCampaign(data)
        },
        onError: (err) => {
            console.log(err, "get Err");
        }
    })


    useEffect(() => {
        getCampaignbyIdMutation.mutate({
            campaignId: campaignId
        })
    }, [])

    if (getCampaignbyIdMutation.isPending) {
        return <Loader />
    }

    return (
        <div>
            <div className='flex-1 flex flex-col'>
                <h1 className="text-xl font-bold mb-2">{campaign?.campaignName}</h1>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <div
                            className="text-sm text-muted-foreground font-medium cursor-pointer hover:underline"
                            onClick={() => navigate(`/b/dashboard/campaign-portal/builder/${campaignId}`)}
                        >
                            Campaign
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />

                        <div
                            className="text-sm text-muted-foreground text-orange-500 font-medium cursor-pointer hover:underline"
                            onClick={() => navigate(`/b/dashboard/campaign-portal/reward/${campaignId}`)}
                        >
                            Reward
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />

                        <div
                            className="text-sm text-muted-foreground cursor-pointer hover:underline"
                            onClick={() => navigate(`/b/dashboard/campaign-portal/settings/${campaignId}`)}
                        >
                            Settings
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />

                        <div
                            className="text-sm text-muted-foreground cursor-pointer hover:underline"
                            onClick={() => navigate(`/b/dashboard/campaign-portal/email-builder/${campaignId}`)}
                        >
                            Email
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />

                        <div
                            className="text-sm text-muted-foreground cursor-pointer hover:underline"
                            onClick={() => navigate(`/b/dashboard/campaign-portal/integration/${campaignId}`)}
                        >
                            Integration
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />

                        <div
                            className="text-sm text-muted-foreground cursor-pointer hover:underline"
                            onClick={() => navigate(`/b/dashboard/campaign-portal/promotes/${campaignId}`)}
                        >
                            Promotes
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Card className="w-full max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl">Reward System Setup</CardTitle>
                        <CardDescription>Choose a reward method for your customers</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <RadioGroup value={rewardType} onValueChange={setRewardType} className="grid gap-4">
                            <div className="flex items-start space-x-3 space-y-0">
                                <RadioGroupItem value="coupon" id="coupon" className="mt-1" />
                                <div className="grid gap-1.5 leading-none">
                                    <Label htmlFor="coupon" className="text-base font-medium flex items-center gap-2">
                                        <Tag className="h-4 w-4" />
                                        Coupon Code
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Offer discount codes that customers can redeem at checkout
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 space-y-0">
                                <RadioGroupItem value="giftcard" id="giftcard" className="mt-1" />
                                <div className="grid gap-1.5 leading-none">
                                    <Label htmlFor="giftcard" className="text-base font-medium flex items-center gap-2">
                                        <Gift className="h-4 w-4" />
                                        Amazon Gift Card
                                    </Label>
                                    <p className="text-sm text-muted-foreground">Reward customers with Amazon gift cards</p>
                                </div>
                            </div>
                        </RadioGroup>

                        {rewardType === "coupon" && (
                            <div className="space-y-3 pt-2">
                                <Label htmlFor="coupon-code">Coupon Code</Label>
                                <Input id="coupon-code" placeholder="Enter coupon code (e.g., SUMMER25)" className="w-full" />
                                <p className="text-xs text-muted-foreground">
                                    This code will be shared with customers when they qualify for a reward
                                </p>
                            </div>
                        )}

                        {rewardType === "giftcard" && (
                            <div className="space-y-4 pt-2">
                                <div className="grid gap-2">
                                    <Label className="text-base">Gift Card Setup Method</Label>
                                    <RadioGroup
                                        defaultValue="add-later"
                                        name="gift-card-method"
                                        className="grid gap-3"
                                        value={giftCardMethod}
                                        onValueChange={handleGiftCardMethodChange}
                                    >
                                        <div className="flex items-center space-x-2 rounded-md border p-3">
                                            <RadioGroupItem value="bulk-import" id="bulk-import" />
                                            <Label htmlFor="bulk-import" className="flex-1 cursor-pointer">
                                                Bulk Import Gift Cards
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 rounded-md border p-3">
                                            <RadioGroupItem value="add-later" id="add-later" />
                                            <Label htmlFor="add-later" className="flex-1 cursor-pointer">
                                                Add Gift Cards Later
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="grid gap-2" id="gift-card-options">
                                    <div data-method="bulk-import" className="hidden space-y-3">
                                        <div className="grid gap-2">
                                            <Label htmlFor="gift-card-textarea">Paste Gift Card Codes</Label>
                                            <textarea
                                                id="gift-card-textarea"
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Enter one gift card code per line"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Enter one gift card code per line, or upload a CSV file
                                            </p>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="gift-card-file">Or Upload CSV File</Label>
                                            <Input id="gift-card-file" type="file" accept=".csv,.txt" className="w-full" />
                                        </div>
                                    </div>

                                    <div data-method="add-later" className="hidden space-y-3">
                                        <p className="text-sm text-muted-foreground">
                                            You've chosen to add gift card codes later. You can add them from the reward management dashboard
                                            after setting up the program.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" disabled={!rewardType}>
                            Save Reward Settings
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div>
                {/* Navigation Buttons */}
                <div className="flex justify-end gap-2 pt-4">
                    <Button onClick={() => navigate(`/b/dashboard/campaign-portal/builder/${campaignId}`)} variant="outline">Back</Button>
                    <Button onClick={() => navigate(`/b/dashboard/campaign-portal/settings/${campaignId}`)} className="bg-amber-500 hover:bg-amber-600">Next</Button>
                </div>
            </div>
        </div>
    )
}

