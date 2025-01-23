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
    }
    return (
        <div>
            <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <div className='items-center mb-4'>
                    <img src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg" alt="" className='w-40 h-40 mx-auto' />

                    <h1 className='uppercase text-center text-xl'>{foundQrCode?.referrerName} Recommends {business?.businessName}</h1>
                </div>
                <p className='text-md text-gray-800 dark:text-gray-200 mb-4 text-center'>Looking to buy a car? Book a test drive with {business?.businessName}</p>
                <p className='text-md text-gray-800 dark:text-gray-200 mb-4 text-center'>Since you're friend of {foundQrCode?.referrerName} you get an extended warranty on your purchase for free.</p>

                <div>
                    <img src="https://dcdko16buub2z.cloudfront.net/images/XrwbjBN0860gkf4G.gif" alt="" className='w-full p-4' />
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
            </div>
        </div>
    )
}
