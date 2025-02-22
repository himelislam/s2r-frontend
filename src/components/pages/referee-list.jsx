
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import refereeApi from "@/api/refereeApi"
import { AlertCircle } from "lucide-react"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function RefereeList() {
  const { refereerId } = useParams()
  const {
    data: referees = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getRefereeList"],
    queryFn: () => refereeApi.getRefeeeList(refereerId),
  })
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Referee List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              [...Array(3)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-6 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[200px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[120px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[80px]" />
                  </TableCell>
                </TableRow>
              ))
            ) : referees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No referees found
                </TableCell>
              </TableRow>
            ) : (
              referees.map((referee) => (
                <TableRow key={referee.id}>
                  <TableCell className="font-medium">{referee.name}</TableCell>
                  <TableCell>{referee.email}</TableCell>
                  <TableCell>{referee.phone}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        referee.status === "active"
                          ? "success"
                          : referee.status === "pending"
                            ? "warning"
                            : "destructive"
                      }
                    >
                      {referee.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

