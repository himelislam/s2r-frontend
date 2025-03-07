import campaignApi from '@/api/campaignApi';
import { useMutation } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

export default function CampaignIntegration() {
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
    return (
        <div>
            <div className='flex-1 flex flex-col'>
                <h1 className="text-xl font-bold mb-2 ps-4">{campaign?.campaignName}</h1>
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
                    </div>
                </div>
            </div>
            <div>
                <h1>Integration</h1>
            </div>
        </div>
    )
}
