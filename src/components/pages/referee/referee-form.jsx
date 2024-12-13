import businessApi from '@/api/businessApi';
import { useQuery } from '@tanstack/react-query';
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
import referrerApi from '@/api/referrerApi';

export default function RefereeForm() {
    const [date, setDate] = useState(Date)
    const { businessId, qrId } = useParams();
    const user = JSON.parse(localStorage.getItem('user'))

    const { data: business = [] } = useQuery({
        queryKey: ['getBusinessById', businessId],
        queryFn: () => businessApi.getBusinessById(businessId),
        enabled: !!businessId
    })

    // const { data: referrer = [] } = useQuery({
    //     queryKey: ['getReferrerById', referrerId],
    //     queryFn: () => referrerApi.getReferrerById(referrerId),
    //     enabled: !!referrerId
    // })

    const handleSubmit = () => {

    }
    const foundQrCode = business?.qrCodes?.find((qrCode) => qrCode.id == qrId);
    return (
        <div>
2
            <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Referral Form
                </h1>
                <h3>Business Name: {business?.businessName}</h3>
                <h3>Business Email: {business?.email}</h3>

                <h2>Referrer Name: {foundQrCode?.referrerName}</h2>
                <h2>Referrer ID: {foundQrCode?.referrerId}</h2>
                <h2>Referrer Status: {foundQrCode?.status}</h2>
                            
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* First and Last Name */}
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                        />
                    </div>

                    {/* Email Address */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                        />
                    </div>

                    {/* Name of Referrer */}
                    <div>
                        <label htmlFor="referrer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Name of Referrer
                        </label>
                        <input
                            type="text"
                            name="referrer"
                            id="referrer"
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>

                    {/* Link to Website */}
                    <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Link to Website Providing Current Specials and Savings
                        </label>
                        <input
                            type="url"
                            name="website"
                            id="website"
                            placeholder="https://example.com"
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                        />
                    </div>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[280px] justify-start text-left font-normal",
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

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
