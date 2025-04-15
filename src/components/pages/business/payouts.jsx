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

export default function CampaignPortal() {
    const [open, setOpen] = useState(false)
    const [campaignName, setCampaignName] = useState("")
    const [campaignLanguage, setCampaignLanguage] = useState("")
    const user = JSON.parse(localStorage.getItem("user"))
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
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

    const filteredCampaigns = campaigns.filter((campaign) => {
        // Filter by active status
        if (filter === "active" && !campaign.active) return false;
        if (filter === "inactive" && campaign.active) return false;

        // Search by campaign name
        if (searchTerm && !campaign?.campaignName?.toLowerCase()?.includes(searchTerm?.toLowerCase())) return false;

        return true;
    });

    const [rewards, setRewards] = useState([
        {
            id: 1,
            active: true,
            campaign: "Ministry Vineyard",
            rewardName: "Reee",
            recipient: "Person Referring",
            autoIssue: false,
            rewardType: "Standard",
            rewardAmount: "$55.00",
            countDue: 0,
            amountDue: "$0.00",
            countIssued: 0,
            amountIssued: "$0.00",
            issuingMethod: "Issue Yourself",
        },
        {
            id: 2,
            active: true,
            campaign: "2354t",
            rewardName: "Person Referring",
            recipient: "Person Referring",
            autoIssue: false,
            rewardType: "Standard",
            rewardAmount: "Lek22.00",
            countDue: 0,
            amountDue: "Lek0.00",
            countIssued: 0,
            amountIssued: "Lek0.00",
            issuingMethod: "Issue Yourself",
        },
    ])

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
                </div>

                <div className="space-y-4">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 border-y border-gray-200">
                                    <TableHead className="w-[50px] text-gray-600 font-semibold text-xs uppercase tracking-wider py-4">
                                        Active
                                        <ChevronDown className="inline-block ml-1 h-3 w-3 text-gray-400" />
                                    </TableHead>
                                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider py-4">
                                        Campaign
                                        <ChevronDown className="inline-block ml-1 h-3 w-3 text-gray-400" />
                                    </TableHead>
                                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider py-4">
                                        Reward Name
                                        <ChevronDown className="inline-block ml-1 h-3 w-3 text-gray-400" />
                                    </TableHead>
                                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider py-4">
                                        Recipient
                                        <ChevronDown className="inline-block ml-1 h-3 w-3 text-gray-400" />
                                    </TableHead>
                                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider py-4">
                                        Auto Issue
                                        <ChevronDown className="inline-block ml-1 h-3 w-3 text-gray-400" />
                                    </TableHead>
                                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider py-4">
                                        Reward Type
                                        <ChevronDown className="inline-block ml-1 h-3 w-3 text-gray-400" />
                                    </TableHead>
                                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider py-4">
                                        Reward Amount
                                        <ChevronDown className="inline-block ml-1 h-3 w-3 text-gray-400" />
                                    </TableHead>
                                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider py-4 text-center">
                                        Count Due
                                        <ChevronDown className="inline-block ml-1 h-3 w-3 text-gray-400" />
                                    </TableHead>
                                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider py-4">
                                        Amount Due
                                        <ChevronDown className="inline-block ml-1 h-3 w-3 text-gray-400" />
                                    </TableHead>
                                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider py-4 text-center">
                                        Count Issued
                                        <ChevronDown className="inline-block ml-1 h-3 w-3 text-gray-400" />
                                    </TableHead>
                                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider py-4">
                                        Amount Issued
                                        <ChevronDown className="inline-block ml-1 h-3 w-3 text-gray-400" />
                                    </TableHead>
                                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider py-4">
                                        Issuing Method
                                        <ChevronDown className="inline-block ml-1 h-3 w-3 text-gray-400" />
                                    </TableHead>
                                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider py-4 text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rewards.map((reward) => (
                                    <TableRow key={reward.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="py-4">
                                            <div className="flex items-center justify-center">
                                                <Checkbox
                                                    checked={reward.active}
                                                    className="h-5 w-5 rounded-full border-2 border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{reward.campaign}</TableCell>
                                        <TableCell>{reward.rewardName}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-gray-50 text-gray-700 font-normal">
                                                {reward.recipient}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Switch checked={reward.autoIssue} className="data-[state=checked]:bg-blue-500" />
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-gray-50 text-gray-700 font-normal">
                                                {reward.rewardType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium text-gray-900">{reward.rewardAmount}</TableCell>
                                        <TableCell className="text-center">{reward.countDue}</TableCell>
                                        <TableCell className="text-gray-500">{reward.amountDue}</TableCell>
                                        <TableCell className="text-center">{reward.countIssued}</TableCell>
                                        <TableCell className="text-gray-500">{reward.amountIssued}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-gray-50 text-gray-700 font-normal">
                                                {reward.issuingMethod}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-gray-100">
                                                        <MoreVertical className="h-5 w-5 text-gray-500" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-56 rounded-lg p-1 shadow-lg border border-gray-200"
                                                >
                                                    <DropdownMenuItem className="rounded-md cursor-pointer flex items-center gap-2 py-2 px-3 hover:bg-gray-100">
                                                        Preview
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-md cursor-pointer flex items-center gap-2 py-2 px-3 hover:bg-gray-100">
                                                        Edit Email Notification
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-md cursor-pointer flex items-center gap-2 py-2 px-3 hover:bg-gray-100">
                                                        Edit Reward Name
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-md cursor-pointer flex items-center gap-2 py-2 px-3 text-red-500 hover:bg-red-50 hover:text-red-600">
                                                        Deactivate
                                                    </DropdownMenuItem>
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



// "use client"

// import { useState } from "react"
// import { Search, ChevronDown, MoreVertical, Filter } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"

// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Checkbox } from "@/components/ui/checkbox"
// 
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent } from "@/components/ui/card"

// export default function RewardsManagement() {
    

//     return (
//         <Card className="w-full border-none shadow-lg rounded-xl overflow-hidden">
//             <CardContent className="p-0">
//                 <div className="flex flex-col">

//                     {/* Table */}
                    
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }

