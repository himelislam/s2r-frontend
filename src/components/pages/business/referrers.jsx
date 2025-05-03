import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
  TableHead
} from "@/components/ui/table"
import referrerApi from '@/api/referrerApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import refereeApi from "@/api/refereeApi"
import { MoreVertical, Search, Calendar, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { formatDate, parseISO, isAfter } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarPicker } from "@/components/ui/calendar"


const user = JSON.parse(localStorage.getItem("user"))

export default function BusinessReferees() {
  // const [searchTerm, setSearchTerm] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  // const [filter, setFilter] = useState("all");
  const [campaignStatusFilter, setCampaignStatusFilter] = useState("all");
  const [campaignNameFilter, setCampaignNameFilter] = useState("all");
  // const [dateFilter, setDateFilter] = useState(null);
  const queryClient = useQueryClient();

  const { data: referrers = [], isLoading, isError, error } = useQuery({
    queryKey: ['getReferrersByBusinessId', user?.userId],
    queryFn: () => referrerApi.getReferrersByBusinessId(user?.userId),
    enabled: !!user?.userId,
  })

  // Get unique campaign names for filter dropdown
  const campaignNames = useMemo(() => {
    const names = new Set();
    referrers.forEach(referrer => names.add(referrer.campaignName));
    return Array.from(names);
  }, [referrers]);

  // const updateRefereeStatusMutation = useMutation({
  //   mutationFn: refereeApi.updateRefereeStatus,
  //   onSuccess: (data) => {
  //     toast.success("Referee status updated successfully")
  //     queryClient.invalidateQueries('getRefereeByBusinessId')
  //   },
  //   onError: (error) => {
  //     console.error("An error occurred:", error)
  //   }
  // })

  // const handleUpdateRefereeStatus = (refereeId, status) => {
  //   updateRefereeStatusMutation.mutate({
  //     refereeId,
  //     status
  //   })
  // }

  // Filter referees based on all filter criteria
  const filteredReferrers = useMemo(() => {
    return referrers.filter(referrer => {
      // Name search filter
      const matchesName = nameSearch === "" || 
        (referrer.name && referrer.name.toLowerCase().includes(nameSearch.toLowerCase()));
      
      // Status filter
      // const matchesStatus = filter === "all" || referrer.campaignStatus === filter;

      const matchesCampaignStatus = campaignStatusFilter === "all" || 
      (referrer.campaignStatus !== undefined && 
        referrer.campaignStatus.toString() === campaignStatusFilter);
      
      // Campaign name filter
      const matchesCampaignName = campaignNameFilter === "all" || 
      referrer.campaignName === campaignNameFilter;
      
      // Date filter (sooner than selected date)
      // const matchesDate = !dateFilter || 
      //   (referrer.date && isAfter(parseISO(referrer.date), dateFilter));
      
      return matchesName && 
             matchesCampaignStatus && matchesCampaignName;
    });
  }, [referrers, nameSearch, campaignStatusFilter, campaignNameFilter]);

  return (
    <div>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4 flex-1 flex-wrap">
            
            {/* Name Search */}
            <div className="relative w-[200px]">
              <Input
                placeholder="Search by name"
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
              />
            </div>

            {/* Campaign Status Filter */}
            <Select defaultValue="all" onValueChange={(value) => setCampaignStatusFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Campaign Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active Campaigns</SelectItem>
                <SelectItem value="false">Inactive Campaigns</SelectItem>
                <SelectItem value="all">All Statuses</SelectItem>
              </SelectContent>
            </Select>

            {/* Campaign Name Filter */}
            <Select defaultValue="all" onValueChange={(value) => setCampaignNameFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                {campaignNames.map(name => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Filter */}
            {/* <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[180px] justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateFilter ? formatDate(dateFilter, "PPP") : "Filter by date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarPicker
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  initialFocus
                />
                <div className="p-2 border-t">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setDateFilter(null)}
                  >
                    Clear date filter
                  </Button>
                </div>
              </PopoverContent>
            </Popover> */}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-gray-600 font-medium py-3">Campaign</TableHead>
                  <TableHead className="text-gray-600 font-medium py-3">Email</TableHead>
                  <TableHead className="text-gray-600 font-medium py-3">Name</TableHead>
                  <TableHead className="text-gray-600 font-medium py-3">Phone</TableHead>
                  <TableHead className="text-gray-600 font-medium py-3">Status</TableHead>
                  <TableHead className="text-right text-gray-600 font-medium py-3">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReferrers?.map((referrer) => (
                  <TableRow key={referrer?.id} className="border-t border-gray-100">
                    <TableCell className="py-3">{referrer?.campaignName}</TableCell>
                    <TableCell className="py-3">{referrer?.email}</TableCell>
                    <TableCell className="py-3">{referrer?.name}</TableCell>
                    <TableCell className="py-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">{referrer?.phone ? referrer?.phone : 'N/A'}</span>
                    </TableCell>
                    
                    <TableCell className="py-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">{referrer?.campaignStatus ? 'Active' : 'Disabled'}</span>
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
                          <DropdownMenuItem onClick={()=> handleUpdateRefereeStatus(referrer._id, 'Active')}>Approve</DropdownMenuItem>
                          <DropdownMenuItem onClick={()=> handleUpdateRefereeStatus(referrer._id, 'Pending')}>Pending</DropdownMenuItem>
                          <DropdownMenuItem onClick={()=> handleUpdateRefereeStatus(referrer._id, 'Cancel')} className="text-red-500">Cancel</DropdownMenuItem>
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
