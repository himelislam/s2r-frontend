import businessApi from "@/api/businessApi";
import memberApi from "@/api/memberApi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react"
import { toast } from "react-toastify";

export default function InviteReferrer() {
    const referees = [];
    const [openInvitationModal, setOpenInvitationModal] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const queryClient = useQueryClient();

    const user = JSON.parse(localStorage.getItem('user'))

    const inviteReferrerMutation = useMutation({
        mutationFn: businessApi.inviteReferrer,
        onSuccess: (data) => {
            console.log(data);
            queryClient.invalidateQueries(['getMembersByBusinessId', user?.userId])
            setOpenInvitationModal(false);
        },
        onError: (err) => {
            console.log(err);
            toast.error(err?.response?.data?.message)
        }
    })

    const { data: members = [], isLoading, isError, error} = useQuery({
        queryKey: ['getMembersByBusinessId', user?.userId],
        queryFn: () => memberApi.getMembersByBusinessId(user?.userId),
        enabled: !!user?.userId
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
            <Dialog open={openInvitationModal} onOpenChange={setOpenInvitationModal}>
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
                    {members?.map((member, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{member?.name}</TableCell>
                            <TableCell>{member?.email}</TableCell>
                            {/* <TableCell >{member?.phone}</TableCell> */}
                            <TableCell >{member?.status}</TableCell>
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
