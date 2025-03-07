import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link, Cloud, LogOut, LogIn, Mail, Users, Facebook, Twitter, Linkedin, ChevronRight } from "lucide-react"
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import campaignApi from '@/api/campaignApi'
import { Loader } from '@/components/pages/loader'

export default function CampaignPromotes() {
    const { campaignId } = useParams();
    const [campaign, setCampaign] = useState(null);
    const navigate = useNavigate()

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
                                className="text-sm text-muted-foreground font-medium cursor-pointer hover:underline"
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
                                className="text-sm text-muted-foreground  cursor-pointer hover:underline"
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
                                className="text-sm text-orange-500 cursor-pointer hover:underline"
                                onClick={() => navigate(`/b/dashboard/campaign-portal/promotes/${campaignId}`)}
                            >
                                Promotes
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="w-full max-w-7xl mx-auto p-6 bg-slate-50 rounded-lg">
                    {/* Top Navigation */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                        <Button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600">
                            <Link className="h-5 w-5" />
                            <span>Get Your Join Link</span>
                        </Button>

                        {/* <Button variant="outline" className="flex items-center gap-2">
                            <Cloud className="h-5 w-5" />
                            <span>Sync Your Contacts</span>
                        </Button>

                        <Button variant="outline" className="flex items-center gap-2">
                            <LogOut className="h-5 w-5" />
                            <span>Logged out widgets</span>
                        </Button>

                        <Button variant="outline" className="flex items-center gap-2">
                            <LogIn className="h-5 w-5" />
                            <span>Logged in widgets</span>
                        </Button>

                        <Button variant="outline" className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            <span>Send An Email</span>
                        </Button>

                        <Button variant="outline" className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            <span>Find Affiliates</span>
                        </Button> */}
                    </div>

                    {/* Main Content */}
                    <div className="grid md:grid-cols-5 gap-6">
                        <div className="md:col-span-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">This Is Your Campaign Link</CardTitle>
                                    <CardDescription className="text-base">
                                        This is where anyone can sign up to join your referral program. Share this link with your customers,
                                        fans, affiliates and network and start generating referrals today
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col space-y-6">
                                        <div className="flex space-x-2">
                                            <Input value="https://demo.referral-factory.com/cxV5LmTQ" readOnly className="flex-1" />
                                            <Button className="bg-blue-500 hover:bg-blue-600">Copy</Button>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium mb-2">Share Your Campaign On Social</h3>
                                            <p className="text-muted-foreground mb-4">
                                                Share your referral campaign on social, so users can join and start referring!
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                <Button size="icon" className="bg-[#3b5998] hover:bg-[#3b5998]/90">
                                                    <Facebook className="h-5 w-5" />
                                                    <span className="sr-only">Facebook</span>
                                                </Button>
                                                <Button size="icon" className="bg-[#25D366] hover:bg-[#25D366]/90">
                                                    <span className="font-bold text-white">W</span>
                                                    <span className="sr-only">WhatsApp</span>
                                                </Button>
                                                <Button size="icon" className="bg-black hover:bg-black/90">
                                                    <Twitter className="h-5 w-5" />
                                                    <span className="sr-only">Twitter/X</span>
                                                </Button>
                                                <Button size="icon" className="bg-[#00c300] hover:bg-[#00c300]/90">
                                                    <span className="font-bold text-white">L</span>
                                                    <span className="sr-only">Line</span>
                                                </Button>
                                                <Button size="icon" className="bg-[#0084ff] hover:bg-[#0084ff]/90">
                                                    <span className="font-bold text-white">M</span>
                                                    <span className="sr-only">Messenger</span>
                                                </Button>
                                                <Button size="icon" className="bg-[#D44638] hover:bg-[#D44638]/90">
                                                    <Mail className="h-5 w-5" />
                                                    <span className="sr-only">Email</span>
                                                </Button>
                                                <Button size="icon" className="bg-[#0077b5] hover:bg-[#0077b5]/90">
                                                    <Linkedin className="h-5 w-5" />
                                                    <span className="sr-only">LinkedIn</span>
                                                </Button>
                                                <Button size="icon" className="bg-[#00c300] hover:bg-[#00c300]/90">
                                                    <span className="font-bold text-white">L</span>
                                                    <span className="sr-only">Line</span>
                                                </Button>
                                                <Button size="icon" className="bg-[#7BB32E] hover:bg-[#7BB32E]/90">
                                                    <span className="font-bold text-white">W</span>
                                                    <span className="sr-only">WeChat</span>
                                                </Button>
                                                <Button size="icon" className="bg-[#0088cc] hover:bg-[#0088cc]/90">
                                                    <span className="font-bold text-white">T</span>
                                                    <span className="sr-only">Telegram</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* <div className="md:col-span-2">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-6">
                                        <div className="bg-gray-200 w-40 h-40 rounded-lg flex items-center justify-center">
                                            <div className="w-36 h-36 bg-gray-300 rounded-lg blur-sm"></div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-base">
                                                    Download the QR code for your campaign. When users scan this code, they will be able to register
                                                    to get referral links.
                                                </p>
                                            </div>
                                            <Button className="bg-blue-500 hover:bg-blue-600 w-full">Start 15 Day Trial To Unlock</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
