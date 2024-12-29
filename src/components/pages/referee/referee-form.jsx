import businessApi from '@/api/businessApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
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

export default function RefereeForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState();
    const [date, setDate] = useState(Date)
    const { businessId, qrId } = useParams();
    const user = JSON.parse(localStorage.getItem('user'))

    const { data: business = [] } = useQuery({
        queryKey: ['getBusinessById', businessId],
        queryFn: () => businessApi.getBusinessById(businessId),
        enabled: !!businessId
    })
    const foundQrCode = business?.qrCodes?.find((qrCode) => qrCode.id == qrId);

    // const { data: referrer = [] } = useQuery({
    //     queryKey: ['getReferrerById', referrerId],
    //     queryFn: () => referrerApi.getReferrerById(referrerId),
    //     enabled: !!referrerId
    // })

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
            referrerId: foundQrCode?.referrerId
        })

        console.log(name, email, phone, date, "form data");
    }
    return (
        <div>
            <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
                    Unlock Exclusive Discounts!
                </h1>
                <p className='text-md text-gray-800 dark:text-gray-200 mb-4 text-center'>Welcome! We’re excited to share an exclusive opportunity for you to grab amazing deals at {business?.businessName}. Thanks to your referrer, you now have access to our special discounts</p>


                <h2 className='text-center'>Referrer Name: {foundQrCode?.referrerName}</h2>

                <Card className="mx-auto max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Grab Your Discount Now</CardTitle>
                        <CardDescription>
                            Fill out the form below to register and secure your discount. Our team will reach out to finalize your access to these exclusive deals.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4">
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
            </div>
        </div>
    )
}
