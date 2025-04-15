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
import { date } from 'zod';

import { Helmet } from 'react-helmet';

export default function RefereeForm() {
    const [formData, setFormData] = useState({});
    const { businessId, campaignId, qrId } = useParams();
    const user = JSON.parse(localStorage.getItem('user'))
    const [updatedContent, setUpdatedContent] = useState(null);
    const content = updatedContent || {};

    const { data: business = [] } = useQuery({
        queryKey: ['getBusinessById', businessId],
        queryFn: () => businessApi.getBusinessById(businessId),
        enabled: !!businessId
    })

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

        const { referrerName, businessName } = getReferrerInfo(business, qrId);
        const { referrerId } = business.qrCodes?.find(qrCode => qrCode.id == qrId) || {};
        // Convert date to ISO string
        // const formattedDate = date instanceof Date ? date.toISOString() : null;

        // Convert date fields to ISO strings
        const submissionData = Object.keys(formData).reduce((acc, key) => {
            acc[key] = formData[key] instanceof Date
                ? formData[key].toISOString()
                : formData[key];
            return acc;
        }, {});

        createRefereeMutation.mutate({
            ...submissionData,
            businessId,
            campaignId,
            referrerId,
        })
    }


    const { data: campaign = null } = useQuery({
        queryKey: ['getCampaignById', campaignId],
        queryFn: () => campaignApi.getCampaignById({ campaignId }),
        enabled: !!campaignId,
    });

    // Initialize form data based on JSON fields
    useEffect(() => {
        if (content?.form?.fields) {
            const initialData = {};
            content.form.fields.forEach(field => {
                initialData[field.id] = '';
            });
            setFormData(initialData);
        }
    }, [content]);

    const handleChange = (fieldId, value) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }));
    };

    const getReferrerInfo = (business, qrId) => {
        if (!business || !qrId) return { referrerName: '', businessName: '' };

        const foundQrCode = business.qrCodes?.find(qrCode => qrCode.id == qrId);
        return {
            referrerName: foundQrCode?.referrerName || '',
            businessName: business.businessName || ''
        };
    };

    useEffect(() => {
        if (campaign?.refereeJSON && business) {
            try {
                const { referrerName, businessName } = getReferrerInfo(business, qrId);

                const replacePlaceholders = (text) => {
                    return text
                        ?.replace(/{{referrerName}}/g, referrerName)
                        ?.replace(/{{businessName}}/g, businessName);
                };

                const refereeData = JSON.parse(campaign.refereeJSON);

                // Clone the data to avoid mutating original
                const updatedData = {
                    ...refereeData,
                    header: { ...refereeData.header },
                    description1: { ...refereeData.description1 },
                    description2: { ...refereeData.description2 }
                };

                if (updatedData.header?.content) {
                    updatedData.header.content = replacePlaceholders(updatedData.header.content);
                }

                if (updatedData.description1?.content) {
                    updatedData.description1.content = replacePlaceholders(updatedData.description1.content);
                }

                if (updatedData.description2?.content) {
                    updatedData.description2.content = replacePlaceholders(updatedData.description2.content);
                }

                setUpdatedContent(updatedData);
            } catch (error) {
                console.error("Error parsing refereeJSON:", error);
            }
        }
    }, [campaign, business, qrId]);



    return (
        <div>
            <Helmet>
                <title>{campaign?.settings?.meta?.title}</title>
                <meta name="description" content={campaign?.settings?.meta?.description} />
                <link rel="icon" href={campaign?.settings?.campaignFavicon} />
                {/* <link rel="icon" href={`${campaign?.settings?.campaignFavicon}?v=${Date.now()}`} /> */}
            </Helmet>
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
                                <div className='grid gap-4 mt-4'>
                                    {content?.form?.fields?.map(field => (
                                        <div key={field.id} className="grid gap-2">
                                            <Label htmlFor={field.id} style={field.styles}>{field.label}</Label>
                                            {field.type === 'date' ? (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !formData[field.id] && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {formData[field.id] ? (
                                                                format(formData[field.id], "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={formData[field.id]}
                                                            onSelect={(date) => handleChange(field.id, date)}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            ) : (
                                                <Input
                                                    id={field.id}
                                                    type={field.type}
                                                    value={formData[field.id] || ''}
                                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                                    required={field.required}
                                                    placeholder={field.placeholder}
                                                    style={field.styles}
                                                />
                                            )}
                                        </div>
                                    ))}
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
