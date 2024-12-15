import React from 'react'

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
import { useQuery } from '@tanstack/react-query'
import refereeApi from '@/api/refereeApi'


export default function ReferrerReferees() {
  const user = JSON.parse(localStorage.getItem("user"))

  const { data: referees = [], isLoading, isError, error } = useQuery({
    queryKey: ['getRefereeByReferrerId', user?.userId],
    queryFn: () => refereeApi.getRefereeByReferrerId(user?.userId),
    enabled: !!user?.userId,
  })


  return (
    <Table>
      {/* <TableCaption>A list of referrer.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {referees?.map((referee, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{index+1}</TableCell>
            <TableCell>{referee?.name}</TableCell>
            <TableCell>{referee?.email}</TableCell>
            <TableCell>{referee?.phone}</TableCell>
            <TableCell>{referee?.status}</TableCell>
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
