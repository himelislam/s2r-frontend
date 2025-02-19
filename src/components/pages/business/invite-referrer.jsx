import businessApi from "@/api/businessApi";
import campaignApi from "@/api/campaignApi";
import memberApi from "@/api/memberApi";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    const [selectedCampaign, setSelectedCampaign] = useState("");

    const { data: members = [], isLoading, isError, error } = useQuery({
        queryKey: ['getMembersByBusinessId', user?.userId],
        queryFn: () => memberApi.getMembersByBusinessId(user?.userId),
        enabled: !!user?.userId
    })

    const { data: campaigns = [] } = useQuery({
        queryKey: ['getCampaignsByBusinessId', user?.userId],
        queryFn: () => campaignApi.getCampaignsByBusinessId(user?.userId),
        enabled: !!user?.userId,
    })

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

    const inviteReferrer = (e) => {
        e.preventDefault();
        inviteReferrerMutation.mutate({
            businessId: user?.userId,
            email,
            name,
            campaignId: selectedCampaign
        })
    }

    const invitationUrl = `${import.meta.env.VITE_CLIENT_URL}/referrer-signup/${user?.userId}`;
    const handleCopy = () => {
        navigator.clipboard.writeText(invitationUrl)
            .then(() => {
                toast.success("Invitation link copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
                toast.error("Failed to copy the link.");
            });
    };


    return (
        <>
            <div>
                <Dialog open={openInvitationModal} onOpenChange={setOpenInvitationModal}>
                    <DialogTrigger asChild>
                        <Button className="me-5">
                            Invite Referrer
                        </Button>
                    </DialogTrigger>

                    <Button onClick={handleCopy}>Invitation Link</Button>

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
                        <Label>Choose a Campaign</Label>
                        <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a campaign" />
                            </SelectTrigger>
                            <SelectContent>
                                {campaigns.map((campaign) => (
                                    <SelectItem key={campaign._id} value={campaign._id}>
                                        {campaign.campaignName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <DialogFooter>
                            <Button onClick={inviteReferrer} className='mb-6 me-5'>
                                {inviteReferrerMutation.isPending
                                    ? (
                                        <>
                                            Invite <Spinner />
                                        </>
                                    )
                                    : 'Invite'}
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
            </Table>
        </>
    )
}
