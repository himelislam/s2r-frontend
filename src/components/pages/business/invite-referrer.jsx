import businessApi from "@/api/businessApi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react"

export default function InviteReferrer() {
    const referees = [];
    const [openGenerateModal, setOpenGenerateModal] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    const user = JSON.parse(localStorage.getItem('user'))

    const inviteReferrerMutation = useMutation({
        mutationFn: businessApi.inviteReferrer,
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (err) => {
            console.log(err);
        }
    })

    const inviteReferrer = (e) => {
        e.preventDefault();
        inviteReferrerMutation.mutate({
            businessId: user?.userId,
            email,
            name
        })
    }
    return (
        <>
            <div>
            <Dialog open={openGenerateModal} onOpenChange={setOpenGenerateModal}>
                    <DialogTrigger asChild>
                        <Button className="me-5">
                            Invite Referrer
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogTitle>Invite Referrer</DialogTitle>
                        <DialogDescription>Please input the email and name of the referrer.</DialogDescription>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Label>Name</Label>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <DialogFooter>
                            <Button onClick={inviteReferrer}  className='mb-6 me-5'>
                                Invite
                            </Button>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <Table>
                {/* <TableCaption>A list of referrer.</TableCaption> */}
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
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
        </>
    )
}
