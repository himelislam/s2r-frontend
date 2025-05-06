import businessApi from "@/api/businessApi";
import campaignApi from "@/api/campaignApi";
import memberApi from "@/api/memberApi";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react"
import { toast } from "react-toastify";

export default function InviteReferrer() {
    const [openInvitationModal, setOpenInvitationModal] = useState(false);
    const [openLinkModal, setOpenLinkModal] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [linkEmail, setLinkEmail] = useState('');
    const [linkName, setLinkName] = useState('');
    const queryClient = useQueryClient();
    const user = JSON.parse(localStorage.getItem('user'))
    const [selectedCampaign, setSelectedCampaign] = useState("");
    const [linkCampaign, setLinkCampaign] = useState("");

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
            queryClient.invalidateQueries(['getMembersByBusinessId', user?.userId])
            setOpenInvitationModal(false);
            toast.success("Referrer invited successfully!");
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to send invitation")
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

    const generateInvitationLink = () => {
        if (!linkCampaign) {
            toast.error("Please select a campaign");
            return "";
        }
        
        const encodedEmail = encodeURIComponent(linkEmail || '');
        const encodedName = encodeURIComponent(linkName || '');
        return `${import.meta.env.VITE_CLIENT_URL}/referrer-signup/${user?.userId}/${linkCampaign}/${encodedEmail}/${encodedName}`;
    };

    const handleCopyLink = () => {
        const link = generateInvitationLink();
        if (!link) return;
        
        navigator.clipboard.writeText(link)
            .then(() => {
                toast.success("Invitation link copied to clipboard!");
                setOpenLinkModal(false);
            })
            .catch(() => {
                toast.error("Failed to copy the link.");
            });
    };

    return (
        <>
            <div className="flex gap-4 mb-6">
                {/* Email Invitation Dialog */}
                <Dialog open={openInvitationModal} onOpenChange={setOpenInvitationModal}>
                    <DialogTrigger asChild>
                        <Button>
                            Invite via Email
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Invite Referrer</DialogTitle>
                            <DialogDescription>Send an invitation directly to the referrer's email.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="campaign">Campaign</Label>
                                    <Select 
                                        value={selectedCampaign} 
                                        onValueChange={setSelectedCampaign}
                                    >
                                        <SelectTrigger id="campaign" className="w-full">
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
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button 
                                onClick={inviteReferrer} 
                                disabled={inviteReferrerMutation.isPending || !email || !name || !selectedCampaign}
                                className="w-full sm:w-auto"
                            >
                                {inviteReferrerMutation.isPending
                                    ? <><Spinner className="mr-2" /> Sending...</>
                                    : 'Send Invitation'}
                            </Button>
                            <DialogClose asChild>
                                <Button variant="outline" className="w-full sm:w-auto">
                                    Cancel
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Link Generation Dialog */}
                <Dialog open={openLinkModal} onOpenChange={setOpenLinkModal}>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            Generate Invitation Link
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create Invitation Link</DialogTitle>
                            <DialogDescription>
                                Generate a shareable link to invite referrers.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <Label htmlFor="link-email">Email (optional)</Label>
                                    <Input
                                        id="link-email"
                                        type="email"
                                        value={linkEmail}
                                        onChange={(e) => setLinkEmail(e.target.value)}
                                        placeholder="Referrer's email"
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="link-name">Name (optional)</Label>
                                    <Input
                                        id="link-name"
                                        type="text"
                                        value={linkName}
                                        onChange={(e) => setLinkName(e.target.value)}
                                        placeholder="Referrer's name"
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="link-campaign">Campaign</Label>
                                    <Select 
                                        value={linkCampaign} 
                                        onValueChange={setLinkCampaign}
                                    >
                                        <SelectTrigger id="link-campaign" className="w-full">
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
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button 
                                onClick={handleCopyLink}
                                disabled={!linkCampaign}
                                className="w-full sm:w-auto"
                            >
                                Copy Link
                            </Button>
                            <DialogClose asChild>
                                <Button variant="outline" className="w-full sm:w-auto">
                                    Close
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {members?.map((member, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell className="truncate max-w-[150px]">{member?.name}</TableCell>
                            <TableCell className="truncate max-w-[200px]">{member?.email}</TableCell>
                            <TableCell>{member?.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}