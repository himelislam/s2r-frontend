import campaignApi from '@/api/campaignApi';
import { Loader } from '@/components/pages/loader';
import { useMutation } from '@tanstack/react-query';
import { ChevronRight, Cog, MonitorSmartphone, Upload, Percent, Hand, FileCode, Code, Zap, Tally3 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function CampaignIntegration() {
    const { campaignId } = useParams();
    const [campaign, setCampaign] = useState(null);
    const navigate = useNavigate();
    const [selectedIntegration, setSelectedIntegration] = useState(null)

    const integrations = [
        { id: "integrations", name: "Integrations", icon: <MonitorSmartphone className="h-6 w-6" /> },
        { id: "upload", name: "Upload", icon: <Upload className="h-6 w-6" /> },
        {
            id: "zapier",
            name: "Zapier",
            icon: <Zap className='h-6 w-6' />,
        },
        {
            id: "make",
            name: "Make.com",
            icon: <Tally3 className='h-6 w-6' />,
        },
        { id: "webhooks", name: "Webhooks", icon: <Cog className="h-6 w-6" /> },
        { id: "javascript", name: "Javascript", icon: <Code className="h-6 w-6" /> },
        { id: "api", name: "Api", icon: <FileCode className="h-6 w-6" /> },
        { id: "manual", name: "Manual", icon: <Hand className="h-6 w-6" /> },
        { id: "coupons", name: "Coupons", icon: <Percent className="h-6 w-6" /> },
    ]

    const getModalContent = () => {
        if (!selectedIntegration) return null

        const integrationName = integrations.find((i) => i.id === selectedIntegration)?.name.toLowerCase() || ""

        return (
            <Card className="max-w-lg mx-auto mt-8">
                <CardContent className="pt-6 text-center">
                    <h2 className="text-xl font-semibold mb-2">
                        To qualify users{" "}
                        {integrationName === "upload"
                            ? "by upload"
                            : integrationName === "manual"
                                ? "manually"
                                : `via ${integrationName}`}{" "}
                        you'll need to create an account
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        {/* Create your account below, you'll get 15 days to try Referral Factory for free. */}
                    </p>
                    <Button className="bg-blue-500 hover:bg-blue-600">Start 15 Day Trial</Button>
                </CardContent>
            </Card>
        )
    }

    const handleIntegrationClick = (id) => {
        setSelectedIntegration(id)
    }

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
                            className="text-sm text-muted-foreground cursor-pointer hover:underline"
                            onClick={() => navigate(`/b/dashboard/campaign-portal/email-builder/${campaignId}`)}
                        >
                            Email
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />

                        <div
                            className="text-sm text-orange-500 cursor-pointer hover:underline"
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
                <div className="min-h-screen bg-slate-50 p-4">
                    {/* Integration Options */}
                    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
                        {integrations.map((integration) => (
                            <div
                                key={integration.id}
                                className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-colors ${selectedIntegration === integration.id ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-50"
                                    }`}
                                onClick={() => handleIntegrationClick(integration.id)}
                            >
                                <div className="flex items-center justify-center h-12 w-12 mb-2">{integration.icon}</div>
                                <span className="text-sm font-medium">{integration.name}</span>
                            </div>
                        ))}
                    </div>

                    {/* Modal Content */}
                    {selectedIntegration && getModalContent()}

                    {/* Navigation Buttons */}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button onClick={() => navigate(`/b/dashboard/campaign-portal/email-builder/${campaignId}`)} variant="outline">Back</Button>
                        <Button onClick={() => navigate(`/b/dashboard/campaign-portal/promotes/${campaignId}`)} className="bg-amber-500 hover:bg-amber-600">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
