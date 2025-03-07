import campaignApi from '@/api/campaignApi';
import { Loader } from '@/components/pages/loader';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function EmailBuilder() {
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
              className="text-sm  text-orange-500 cursor-pointer hover:underline"
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
        <h1>Email Builder</h1>
      </div>
      <div>
        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={() => navigate(`/b/dashboard/campaign-portal/settings/${campaignId}`)} variant="outline">Back</Button>
          <Button onClick={() => navigate(`/b/dashboard/campaign-portal/integration/${campaignId}`)} className="bg-amber-500 hover:bg-amber-600">Next</Button>
        </div>
      </div>
    </div>
  )
}
