import campaignApi from '@/api/campaignApi'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BarChart2, Eye, Gift, Megaphone, MoreVertical, PenSquare, Share2, UserCheck, UserPlus, Users, Link } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function CampaignItem({ campaign }) {
    const queryClient = useQueryClient();
    const navigate = useNavigate()


    const updateCampaignActiveStatusMutation = useMutation({
        mutationFn: (newStatus) => campaignApi.updateCampaignActiveStatus(campaign._id, newStatus),
        onSuccess: (data) => {
            console.log('Campaign status updated successfully:', data);
            toast.success('Campaign status updated successfully');
            queryClient.invalidateQueries('getCampaignsByBusinessId');
        },
        onError: (error) => {
            console.error('Error updating campaign status:', error);
        },
    });

    const handleCampaignActive = async () => {
        // Update campaign active status
        const newStatus = !campaign.active;
        updateCampaignActiveStatusMutation.mutate(newStatus);
    }

    const handleEditCampaign = (id) => {
        // Navigate to edit campaign page
        navigate(`/b/dashboard/campaign-portal/builder`, { state: { campaign } });
    }

    return (
        <>
            <Collapsible key={campaign._id} className="rounded-lg border">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4">
                    <div className="flex items-center gap-4">
                        <Switch checked={campaign.active} onClick={(e)=> {handleCampaignActive(), e.stopPropagation()}} />
                        <span className="font-medium">{campaign.campaignName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2" onClick={
                            (e)=> {
                            e.stopPropagation();
                            handleEditCampaign() 
                            }
                            }>
                            <PenSquare className="h-4 w-4" />
                            Edit Campaign
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={(e)=> {e.stopPropagation()}}>
                            <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={(e)=> {e.stopPropagation()}}>
                            <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                <DropdownMenuItem>Archive</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="p-4 pt-0">
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            <Card>
                                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                    <Link className="h-6 w-6 text-blue-500 mb-2" />
                                    <h3 className="font-medium">Join Link</h3>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                    <Megaphone className="h-6 w-6 text-blue-500 mb-2" />
                                    <h3 className="font-medium">Promote Tools</h3>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                    <Gift className="h-6 w-6 text-blue-500 mb-2" />
                                    <h3 className="font-medium">Rewards Due</h3>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                    <Users className="h-6 w-6 text-blue-500 mb-2" />
                                    <h3 className="font-medium">Users Tracking Link</h3>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                    <BarChart2 className="h-6 w-6 text-blue-500 mb-2" />
                                    <span className="text-2xl font-bold mb-1">{campaign.stats.totalReach}</span>
                                    <span className="text-sm text-muted-foreground">Total Reach</span>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                    <Users className="h-6 w-6 text-blue-500 mb-2" />
                                    <span className="text-2xl font-bold mb-1">{campaign.stats.totalUsers}</span>
                                    <span className="text-sm text-muted-foreground">Total Users</span>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                    <UserPlus className="h-6 w-6 text-blue-500 mb-2" />
                                    <span className="text-2xl font-bold mb-1">{campaign.stats.totalReferrals}</span>
                                    <span className="text-sm text-muted-foreground">Total Referrals</span>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                    <UserCheck className="h-6 w-6 text-blue-500 mb-2" />
                                    <span className="text-2xl font-bold mb-1">{campaign.stats.convertedReferrals}</span>
                                    <span className="text-sm text-muted-foreground">Converted Referrals</span>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="mt-4 text-center text-sm text-muted-foreground">
                            To see all the users in this campaign, <a href="#" className="text-blue-500 hover:underline">go here</a>.
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </>
    )
}
