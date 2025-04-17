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
          email: "john@example.com",
          name: "Reee",
          rewardType: "Standard",
          rewardAmount: "$55.00",
          coupon: "WELCOME20",
          issuingMethod: "Issue Yourself",
        },
        {
          id: 2,
          active: true,
          campaign: "2354t",
          email: "jane@example.com",
          name: "Person Referring",
          rewardType: "Standard",
          rewardAmount: "Lek22.00",
          coupon: "SUMMER10",
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
                    <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="text-gray-600 font-medium py-3">Active</TableHead>
                                    <TableHead className="text-gray-600 font-medium py-3">Campaign</TableHead>
                                    <TableHead className="text-gray-600 font-medium py-3">Email</TableHead>
                                    <TableHead className="text-gray-600 font-medium py-3">Name</TableHead>
                                    <TableHead className="text-gray-600 font-medium py-3">Reward Type</TableHead>
                                    <TableHead className="text-gray-600 font-medium py-3">Reward Amount</TableHead>
                                    <TableHead className="text-gray-600 font-medium py-3">Coupon</TableHead>
                                    <TableHead className="text-gray-600 font-medium py-3">Issuing Method</TableHead>
                                    <TableHead className="text-right text-gray-600 font-medium py-3">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rewards.map((reward) => (
                                    <TableRow key={reward.id} className="border-t border-gray-100">
                                        <TableCell className="py-3">
                                            <div className="flex items-center justify-center">
                                                <Checkbox
                                                    checked={reward.active}
                                                    // checked={false}
                                                    className="h-5 w-5 rounded-full border-2 border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3">{reward.campaign}</TableCell>
                                        <TableCell className="py-3">{reward.email}</TableCell>
                                        <TableCell className="py-3">{reward.name}</TableCell>
                                        <TableCell className="py-3">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">{reward.rewardType}</span>
                                        </TableCell>
                                        <TableCell className="py-3">{reward.rewardAmount}</TableCell>
                                        <TableCell className="py-3">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">{reward.coupon}</span>
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">{reward.issuingMethod}</span>
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
                                                    <DropdownMenuItem>Preview</DropdownMenuItem>
                                                    <DropdownMenuItem>Edit Email Notification</DropdownMenuItem>
                                                    <DropdownMenuItem>Edit Reward Name</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-500">Deactivate</DropdownMenuItem>
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

