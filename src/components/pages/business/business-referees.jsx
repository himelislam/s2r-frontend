import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import referrerApi from '@/api/referrerApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import refereeApi from "@/api/refereeApi"
import { MoreVertical, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"


const user = JSON.parse(localStorage.getItem("user"))

export default function BusinessReferees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: referees = [], isLoading, isError, error } = useQuery({
    queryKey: ['getRefereeByBusinessId', user?.userId],
    queryFn: () => refereeApi.getRefereeBusinessById(user?.userId),
    enabled: !!user?.userId,
  })

  const updateRefereeStatusMutation = useMutation({
    mutationFn: refereeApi.updateRefereeStatus,
    onSuccess: (data) => {
      toast.success("Referee status updated successfully")
      queryClient.invalidateQueries('getRefereeByBusinessId')
    },
    onError: (error) => {
      console.error("An error occurred:", error)
    }
  })

  const handleUpdateRefereeStatus = (refereeId, status) => {
    updateRefereeStatusMutation.mutate({
      refereeId,
      status
    })
  }

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
                  {/* <TableHead className="text-gray-600 font-medium py-3">Active</TableHead> */}
                  <TableHead className="text-gray-600 font-medium py-3">Campaign</TableHead>
                  <TableHead className="text-gray-600 font-medium py-3">Email</TableHead>
                  <TableHead className="text-gray-600 font-medium py-3">Name</TableHead>
                  <TableHead className="text-gray-600 font-medium py-3">Phone</TableHead>
                  <TableHead className="text-gray-600 font-medium py-3">Referrer Name</TableHead>
                  <TableHead className="text-gray-600 font-medium py-3">Available Time</TableHead>
                  <TableHead className="text-gray-600 font-medium py-3">Status</TableHead>
                  <TableHead className="text-right text-gray-600 font-medium py-3">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referees?.map((referee) => (
                  <TableRow key={referee?.id} className="border-t border-gray-100">
                    
                    <TableCell className="py-3">{referee?.campaignId}</TableCell>
                    <TableCell className="py-3">{referee.email}</TableCell>
                    <TableCell className="py-3">{referee.name}</TableCell>
                    <TableCell className="py-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">{referee?.phone}</span>
                    </TableCell>
                    <TableCell className="py-3">{referee.referrerId}</TableCell>
                    <TableCell className="py-3">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">{referee?.date}</span>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">{referee?.status}</span>
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
                          <DropdownMenuItem onClick={()=> handleUpdateRefereeStatus(referee._id, 'Active')}>Approve</DropdownMenuItem>
                          <DropdownMenuItem onClick={()=> handleUpdateRefereeStatus(referee._id, 'Pending')}>Pending</DropdownMenuItem>
                          <DropdownMenuItem onClick={()=> handleUpdateRefereeStatus(referee._id, 'Cancel')} className="text-red-500">Cancel</DropdownMenuItem>
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
