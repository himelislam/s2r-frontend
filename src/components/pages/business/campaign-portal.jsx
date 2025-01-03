import campaignApi from "@/api/campaignApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Plus, Search } from "lucide-react"
import React, { useState } from "react"
import CampaignItem from "./campaign-item"
import { Outlet, useNavigate } from "react-router-dom"
import Spinner from "@/components/spinner"
import { toast } from "react-toastify"

export default function CampaignPortal() {
    const [open, setOpen] = useState(false)
    const [campaignName, setCampaignName] = useState("")
    const [campaignLanguage, setCampaignLanguage] = useState("")
    const user = JSON.parse(localStorage.getItem("user"))
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const queryClient = useQueryClient();
    const navigate = useNavigate()


    const createCampaignMutation = useMutation({
        mutationFn: campaignApi.createCampaign,
        onSuccess: () => {
            toast.success("Campaign created successfully")
            setOpen(false)
            queryClient.invalidateQueries('getCampaignsByBusinessId')
            navigate('/b/dashboard/campaign-portal/builder')
        },
        onError: (error) => {
            console.error("An error occurred:", error)
        }
    })

    const handleStartCampaign = () => {
        createCampaignMutation.mutate({
            campaignName,
            campaignLanguage,
            businessId: user.userId
        })
    }

    const { data: campaigns = [], isLoading, isError, error } = useQuery({
        queryKey: ['getCampaignsByBusinessId', user?.userId],
        queryFn: () => campaignApi.getCampaignsByBusinessId(user?.userId),
        enabled: !!user?.userId
    })

    const filteredCampaigns = campaigns.filter((campaign) => {
        // Filter by active status
        if (filter === "active" && !campaign.active) return false;
        if (filter === "inactive" && campaign.active) return false;

        // Search by campaign name
        if (searchTerm && !campaign?.campaignName?.toLowerCase()?.includes(searchTerm?.toLowerCase())) return false;

        return true;
    });

    return (
        <div>
            <div className="container mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-[240px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search"
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select defaultValue="active" onValueChange={(value) => setFilter(value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter campaigns" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active Campaigns</SelectItem>
                                <SelectItem value="inactive">Inactive Campaigns</SelectItem>
                                <SelectItem value="all">All Campaigns</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* create new campaign button */}
                    <div>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button>Create New Campaign</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Campaign</DialogTitle>
                                    <DialogDescription>
                                        Enter the name and language for your new campaign.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={campaignName}
                                            onChange={(e) => setCampaignName(e.target.value)}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="language" className="text-right">
                                            Language
                                        </Label>
                                        <Select
                                            value={campaignLanguage}
                                            onValueChange={(value) => setCampaignLanguage(value)}
                                            defaultValue="en"
                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select a language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en" selected>English</SelectItem>
                                                <SelectItem value="es">Spanish</SelectItem>
                                                <SelectItem value="fr">French</SelectItem>
                                                <SelectItem value="de">German</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleStartCampaign} disabled={createCampaignMutation.isPending}>
                                        {createCampaignMutation.isPending
                                            ? (
                                                <>
                                                    Start Campaign <Spinner />
                                                </>
                                            )
                                            : 'Start Campaign'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredCampaigns.map((campaign) => (
                        <CampaignItem key={campaign.id} campaign={campaign} />
                    ))}
                    {filteredCampaigns.length === 0 && <p>No campaigns found.</p>}
                </div>
            </div>
        </div>
    )
}
