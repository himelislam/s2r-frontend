import businessApi from '@/api/businessApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import refereeApi from '@/api/refereeApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import Spinner from '@/components/spinner';
import campaignApi from '@/api/campaignApi';

export default function RefereeForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState();
    const [date, setDate] = useState(Date)
    const { businessId, campaignId, qrId } = useParams();
    const user = JSON.parse(localStorage.getItem('user'))

    const { data: business = [] } = useQuery({
        queryKey: ['getBusinessById', businessId],
        queryFn: () => businessApi.getBusinessById(businessId),
        enabled: !!businessId
    })

    const foundQrCode = business?.qrCodes?.find((qrCode) => qrCode.id == qrId);
    const Referrer = business?.qrCodes?.find((qrCode) => qrCode.id == qrId)?.referrerName;
    const Business = business?.businessName;
    // const Referrer = 'Referrer'
    // const Business = 'Business'

    const createRefereeMutation = useMutation({
        mutationFn: refereeApi.createReferee,
        onSuccess: (data) => {
            console.log(data, 'sucssess in create Referee');
            toast.success('Form Submitted Successfully')
        },
        onError: (err) => {
            console.log(err, 'on create Referee');
            toast.error('Internal Server Error')
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        // Convert date to ISO string
        const formattedDate = date instanceof Date ? date.toISOString() : null;
        createRefereeMutation.mutate({
            name,
            email,
            phone,
            date: formattedDate,
            businessId,
            campaignId,
            referrerId: foundQrCode?.referrerId
        })
    }

    const [updatedContent, setUpdatedContent] = useState(null);
    const { data: campaign = null } = useQuery({
        queryKey: ['getCampaignById', campaignId],
        queryFn: () => campaignApi.getCampaignById({ campaignId }),
        enabled: !!campaignId,
    });

    // Function to replace placeholders
    const replacePlaceholders = (text) => {
            return text
                ?.replace(/{{referrerName}}/g, Referrer)
                ?.replace(/{{businessName}}/g, Business);
    };


    useEffect(() => {
        if (campaign?.refereeJSON) {
            try {
                const refereeData = JSON.parse(campaign.refereeJSON);

                // Replace placeholders safely
                if (refereeData.header?.content)
                    refereeData.header.content = replacePlaceholders(refereeData.header.content);

                if (refereeData.description1?.content)
                    refereeData.description1.content = replacePlaceholders(refereeData.description1.content);

                if (refereeData.description2?.content)
                    refereeData.description2.content = replacePlaceholders(refereeData.description2.content);

                // Store the updated content in state
                setUpdatedContent(refereeData);
            } catch (error) {
                console.error("Error parsing refereeJSON:", error);
            }
        }
    }, [campaign]);

    // Use the updated content or fallback to empty object
    const content = updatedContent || {};

    return (
        <div>
            {/* <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <div className='items-center mb-4'>
                    <img src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg" alt="" className='w-40 h-40 mx-auto' />

                    <h1 className='uppercase text-center text-xl'>{foundQrCode?.referrerName} Recommends {business?.businessName}</h1>
                </div>
                <p className='text-md text-gray-800 dark:text-gray-200 mb-4 text-center'>Looking to buy a car? Book a test drive with {business?.businessName}</p>
                <p className='text-md text-gray-800 dark:text-gray-200 mb-4 text-center'>Since you're friend of {foundQrCode?.referrerName} you get an extended warranty on your purchase for free.</p>

                <div>
                    <img src="https://dcdko16buub2z.cloudfront.net/images/XrwbjBN0860gkf4G.gif" alt="" className='w-full p-2' />
                </div>
                <Card className="mx-auto max-w-md">
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4 mt-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder=""
                                        required
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Phone</Label>
                                    <Input
                                        id="number"
                                        type="number"
                                        placeholder=""
                                        required
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>

                                <Label htmlFor="email">Preferred Contact Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[330px] justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>

                                <Button type="submit" className="w-full" disabled={createRefereeMutation.isPending}>
                                    {createRefereeMutation.isPending
                                        ? (
                                            <>
                                                Submit <Spinner />
                                            </>
                                        )
                                        : 'Submit'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div> */}




            <div>
                <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                    <div className="items-center mb-4">
                        <img
                            src={content?.logo?.content}
                            style={content?.logo?.styles}
                            alt=""
                            className="w-40 h-40 mx-auto"
                            onClick={() => setSelectedElement('logo')}
                        />

                        <div
                            value={content?.header?.content}
                            className="text-center text-xl "
                            style={content?.header?.styles}
                        >
                            {content?.header?.content}
                        </div>
                    </div>

                    <div
                        value={content?.description1?.content}
                        className="text-md text-gray-800 text-center"
                        style={content?.description1?.styles}
                    >
                        {content?.description1?.content}
                    </div>

                    <div
                        value={content?.description2?.content}
                        className="text-md text-gray-800 dark:text-gray-200 mb-4 text-center"
                        style={content?.description2?.styles}
                    >
                        {content?.description2?.content}
                    </div>

                    <Card className="mx-auto max-w-md cursor-pointer">
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-4 mt-4">
                                    {content?.form?.fields?.map((field) => (
                                        <div key={field.id} className="grid gap-2">
                                            <Label htmlFor={field.id} style={field.styles}>
                                                {field.label}
                                            </Label>
                                            <Input
                                                id={field.id}
                                                type={field.type}
                                                placeholder={field.placeholder}
                                                required={field.required}
                                                style={field.styles}

                                            />
                                        </div>
                                    ))}
                                    {/* <Button type="submit" className="w-full" disabled={createRefereeMutation.isPending}>
                                        {createRefereeMutation.isPending
                                            ? (
                                                <>
                                                    Submit <Spinner />
                                                </>
                                            )
                                            : 'Submit'}
                                    </Button> */}

                                    <Button type="submit" className="w-full" disabled={createRefereeMutation.isPending}>
                                    {createRefereeMutation.isPending
                                        ? (
                                            <>
                                                Submit <Spinner />
                                            </>
                                        )
                                        : 'Submit'}
                                </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
