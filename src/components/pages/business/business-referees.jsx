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
import { useQuery } from '@tanstack/react-query'
import refereeApi from "@/api/refereeApi"


const user = JSON.parse(localStorage.getItem("user"))

export default function BusinessReferees() {


  const { data: referees = [], isLoading, isError, error } = useQuery({
    queryKey: ['getRefereeByBusinessId', user?.userId],
    queryFn: () => refereeApi.getRefereeBusinessById(user?.userId),
    enabled: !!user?.userId,
  })

  return (
    <Table>
      {/* <TableCaption>A list of referrer.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Referrer Name</TableHead>
          <TableHead className="">Available Time</TableHead>
          <TableHead className="">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {referees?.map((referee, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{referee?.name}</TableCell>
            <TableCell>{referee?.email}</TableCell>
            <TableCell >{referee?.phone}</TableCell>
            <TableCell >{referee?.referrerName}</TableCell>
            {/* <TableCell >{new Date(referee?.date)}</TableCell> */}
            <TableCell >{referee?.date
              ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(referee.date))
              : 'N/A'}</TableCell>
            <TableCell >{referee?.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
    </Table>
  )
}
