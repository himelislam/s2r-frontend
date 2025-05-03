import campaignApi from "@/api/campaignApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Switch } from "@/components/ui/switch"
import { Plus, Search, ChevronDown, MoreVertical, Filter } from "lucide-react"
import React, { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import Spinner from "@/components/spinner"
import { toast } from "react-toastify"
import useEditableContent from "@/hooks/useEditableContent"
import CampaignItem from "./campaign/campaign-item"
import refereeApi from "@/api/refereeApi"

export default function CampaignPortal() {
    const [open, setOpen] = useState(false)
    const [campaignName, setCampaignName] = useState("")
    const [campaignLanguage, setCampaignLanguage] = useState("")
    const user = JSON.parse(localStorage.getItem("user"))
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        status: "all",
        campaignName: "",
        rewardType: "all",
        nameSearch: ""
    });
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    const { getContentAsJSON } = useEditableContent();

    const createCampaignMutation = useMutation({
        mutationFn: campaignApi.createCampaign,
        onSuccess: (data) => {
            toast.success("Campaign created successfully")
            setOpen(false)
            queryClient.invalidateQueries('getCampaignsByBusinessId')
            navigate(`/b/dashboard/campaign-portal/builder/${data._id}`, { state: { campaign: data } })
        },
        onError: (error) => {
            console.error("An error occurred:", error)
        }
    })

    const handleStartCampaign = () => {
        const jsonContent = getContentAsJSON();
        createCampaignMutation.mutate({
            campaignName,
            campaignLanguage,
            businessId: user.userId,
            refereeJSON: jsonContent,
        })
    }

    const { data: campaigns = [], isLoading, isError, error } = useQuery({
        queryKey: ['getCampaignsByBusinessId', user?.userId],
        queryFn: () => campaignApi.getCampaignsByBusinessId(user?.userId),
        enabled: !!user?.userId
    })

    const { data: referees = [], isLoadings, isErrors, errors } = useQuery({
        queryKey: ['getRefereeWithCampaignDetails', user?.userId],
        queryFn: () => refereeApi.getRefereeWithCampaignDetails(user?.userId),
        enabled: !!user?.userId,
    })

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredReferees = referees?.filter(reward => {
        // Filter by status
        if (filters.status !== "all" && reward.status !== filters.status) return false;

        // Filter by campaign name
        if (filters.campaignName && filters.campaignName !== "all-campaigns" && 
            !reward.campaignName?.toLowerCase().includes(filters.campaignName.toLowerCase())) {
            return false;
        }

        // Filter by reward type
        if (filters.rewardType !== "all" && reward?.reward?.rewardType !== filters.rewardType) {
            return false;
        }

        // Search by name
        if (filters.nameSearch && !reward.name?.toLowerCase().includes(filters.nameSearch.toLowerCase())) {
            return false;
        }

        // Search by general search term
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            if (
                !reward.campaignName?.toLowerCase().includes(searchLower) &&
                !reward.name?.toLowerCase().includes(searchLower) &&
                !reward.email?.toLowerCase().includes(searchLower)
            ) {
                return false;
            }
        }

        return true;
    });

    // Get unique campaign names and reward types for filter options
    const uniqueCampaignNames = [...new Set(referees?.map(ref => ref.campaignName))].filter(Boolean);
    const uniqueRewardTypes = [...new Set(referees?.map(ref => ref?.reward?.rewardType))].filter(Boolean);


    const handleSendReward = (reward) => {
        const rewardType = reward?.reward?.rewardType;
        const method = reward?.reward?.method;
        const hasCode = !!reward?.reward?.code;
    
        if (rewardType === "Coupon" || rewardType === "GiftCard") {
            if (method === "add-later") {
                if (!hasCode) {
                    // Show popup to enter the coupon or gift card code
                    // Example: setShowCodePopup(true); and setSelectedReward(reward);
                    console.log(hasCode, "hasCOde")
                } else {
                    // Call backend to send reward with existing code
                    // Example: sendRewardToBackend(reward);
                    console.log(hasCode, "dddd")
                }
            } else {
                // For other methods, directly send the reward
                // Example: sendRewardToBackend(reward);
                console.log(hasCode, "hasCOde2")
            }
        } else {
            toast.error("Unsupported reward type or method.");
        }
    };
    

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

                        {/* Status Filter */}
                        <Select
                            value={filters.status}
                            onValueChange={(value) => handleFilterChange("status", value)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Campaign Name Filter */}
                        <Select
                            value={filters.campaignName}
                            onValueChange={(value) => handleFilterChange("campaignName", value)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by campaign" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-campaigns">All Campaigns</SelectItem>
                                {uniqueCampaignNames.map(name => (
                                    <SelectItem key={name} value={name}>{name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Reward Type Filter */}
                        <Select
                            value={filters.rewardType}
                            onValueChange={(value) => handleFilterChange("rewardType", value)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by reward type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Reward Types</SelectItem>
                                {uniqueRewardTypes.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Name Search */}
                        <div className="relative w-[180px]">
                            <Input
                                placeholder="Search by name"
                                value={filters.nameSearch}
                                onChange={(e) => handleFilterChange("nameSearch", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="text-gray-600 font-medium py-3">Active</TableHead>
                                    <TableHead className="text-gray-600 font-medium py-3">Campaign</TableHead>
                                    <TableHead className="text-gray-600 font-medium py-3">Referrer Name</TableHead>
                                    <TableHead className="text-gray-600 font-medium py-3">Referrer Email</TableHead>
                                    <TableHead className="text-gray-600 font-medium py-3">Referee Name</TableHead>
                                    <TableHead className="text-gray-600 font-medium py-3">Reward Type</TableHead>
                                    <TableHead className="text-gray-600 font-medium py-3">Reward Amount</TableHead>
                                    <TableHead className="text-gray-600 font-medium py-3">Coupon</TableHead>
                                    <TableHead className="text-gray-600 font-medium py-3">Issuing Method</TableHead>
                                    <TableHead className="text-gray-600 font-medium py-3">Qr Id</TableHead>
                                    <TableHead className="text-right text-gray-600 font-medium py-3">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredReferees?.map((reward) => (
                                    <TableRow key={reward.id} className="border-t border-gray-100">
                                        <TableCell className="py-3">
                                            <div className="flex items-center justify-center">
                                                <Checkbox
                                                    checked={reward?.campaignStatus}
                                                    className="h-5 w-5 rounded-full border-2 border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3">{reward.campaignName}</TableCell>
                                        <TableCell className="py-3">{reward.referrerName}</TableCell>
                                        <TableCell className="py-3">{reward.referrerEmail}</TableCell>
                                        <TableCell className="py-3">{reward.name}</TableCell>
                                        <TableCell className="py-3">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">{reward?.reward?.rewardType}</span>
                                        </TableCell>
                                        <TableCell className="py-3">{reward?.reward?.amount}</TableCell>
                                        <TableCell className="py-3">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">{reward?.reward?.rewardType == 'COUPON' ? reward?.reward?.code : 'None'}</span>
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">{reward?.reward?.method ? reward?.reward?.method: 'Added'}</span>
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">{reward?.qrCodeId}</span>
                                        </TableCell>
                                        <TableCell className="py-3 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                        <span className="sr-only">Open menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-[200px]">
                                                    <DropdownMenuItem onClick={()=> handleSendReward()} >Send reward</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-500">Cancel Reward</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}
