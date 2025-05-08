import businessApi from '@/api/businessApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import refereeApi from '@/api/refereeApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import Spinner from '@/components/spinner';
import campaignApi from '@/api/campaignApi';
import { Helmet } from 'react-helmet';
import useMediaQuery  from '@/hooks/use-media-query';

export default function RefereeForm() {
    const [formData, setFormData] = useState({});
    const { businessId, campaignId, qrId } = useParams();
    const [submitted, setSubmitted] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const [updatedContent, setUpdatedContent] = useState(null);
    const content = updatedContent || {};
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const isTablet = useMediaQuery('(min-width: 768px)');

    const { data: business = [] } = useQuery({
        queryKey: ['getBusinessById', businessId],
        queryFn: () => businessApi.getBusinessById(businessId),
        enabled: !!businessId
    });

    const createRefereeMutation = useMutation({
        mutationFn: refereeApi.createReferee,
        onSuccess: (data) => {
            console.log(data, 'success in create Referee');
            setSubmitted(true);
            toast.success('Form Submitted Successfully');
        },
        onError: (err) => {
            console.log(err, 'on create Referee');
            toast.error('Internal Server Error');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const { referrerId } = business.qrCodes?.find(qrCode => qrCode.id == qrId) || {};
        
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
        });
    };

    const { data: campaign = null } = useQuery({
        queryKey: ['getCampaignById', campaignId],
        queryFn: () => campaignApi.getCampaignById({ campaignId }),
        enabled: !!campaignId,
    });

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

    const getDeviceStyles = (styles) => {
        if (isDesktop) return styles.desktop;
        if (isTablet) return styles.tablet;
        return styles.mobile;
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

                const updatedData = {
                    ...refereeData,
                    header: { ...refereeData.header },
                    description1: { ...refereeData.description1 },
                    description2: { ...refereeData.description2 },
                    thankYouPage: { ...refereeData.thankYouPage }
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

                if (updatedData.thankYouPage?.content) {
                    updatedData.thankYouPage.content = replacePlaceholders(updatedData.thankYouPage.content);
                }

                setUpdatedContent(updatedData);
            } catch (error) {
                console.error("Error parsing refereeJSON:", error);
            }
        }
    }, [campaign, business, qrId]);

    if (submitted) {
        return (
            <div 
                className="min-h-screen flex items-center justify-center p-4"
                style={{
                    background: content.thankYouPage?.background?.color || '#ffffff',
                    backgroundImage: content.thankYouPage?.background?.image 
                        ? `url(${content.thankYouPage.background.image})` 
                        : 'none',
                    backgroundRepeat: content.thankYouPage?.background?.repeat || 'no-repeat',
                    backgroundSize: content.thankYouPage?.background?.size || 'cover',
                    backgroundPosition: content.thankYouPage?.background?.position || 'center',
                    ...getDeviceStyles(content.thankYouPage?.background?.styles || {})
                }}
            >
                <Helmet>
                    <title>{campaign?.settings?.meta?.title || 'Thank You'}</title>
                    <meta name="description" content={campaign?.settings?.meta?.description} />
                    <link rel="icon" href={campaign?.settings?.campaignFavicon} />
                </Helmet>
                
                <div className="max-w-4xl mx-auto bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
                    <h1 
                        className="text-3xl font-bold mb-6"
                        style={getDeviceStyles(content.thankYouPage?.styles || {})}
                    >
                        {content.thankYouPage?.content}
                    </h1>
                    <Button 
                        onClick={() => window.location.reload()} 
                        className="mt-6"
                    >
                        Submit Another Response
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div 
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                background: content.background?.color || '#ffffff',
                backgroundImage: content.background?.image 
                    ? `url(${content.background.image})` 
                    : 'none',
                backgroundRepeat: content.background?.repeat || 'no-repeat',
                backgroundSize: content.background?.size || 'cover',
                backgroundPosition: content.background?.position || 'center',
                ...getDeviceStyles(content.background?.styles || {})
            }}
        >
            <Helmet>
                <title>{campaign?.settings?.meta?.title}</title>
                <meta name="description" content={campaign?.settings?.meta?.description} />
                <link rel="icon" href={campaign?.settings?.campaignFavicon} />
            </Helmet>

            <div className="w-full max-w-2xl">
                <div className="bg-white bg-opacity-90 dark:bg-gray-900 p-6 rounded-lg shadow-md">
                    <div className="items-center mb-4">
                        {content.logo?.content && (
                            <img
                                src={content.logo.content}
                                alt="Campaign Logo"
                                className="mx-auto"
                                style={getDeviceStyles(content.logo.styles || {})}
                            />
                        )}

                        {content.header?.content && (
                            <h1 
                                className="text-center"
                                style={getDeviceStyles(content.header.styles || {})}
                            >
                                {content.header.content}
                            </h1>
                        )}
                    </div>

                    {content.description1?.content && (
                        <p 
                            className="text-center"
                            style={getDeviceStyles(content.description1.styles || {})}
                        >
                            {content.description1.content}
                        </p>
                    )}

                    {content.description2?.content && (
                        <p 
                            className="text-center mb-6"
                            style={getDeviceStyles(content.description2.styles || {})}
                        >
                            {content.description2.content}
                        </p>
                    )}

                    <Card className="mx-auto cursor-pointer">
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit}>
                                <div className='grid gap-4'>
                                    {content?.form?.fields?.map(field => (
                                        <div key={field.id} className="grid gap-2">
                                            <Label htmlFor={field.id} style={getDeviceStyles(field.styles || {})}>
                                                {field.label}
                                            </Label>
                                            {field.type === 'date' ? (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !formData[field.id] && "text-muted-foreground"
                                                            )}
                                                            style={getDeviceStyles(field.styles || {})}
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
                                                    style={getDeviceStyles(field.styles || {})}
                                                />
                                            )}
                                        </div>
                                    ))}
                                    <Button 
                                        type="submit" 
                                        className="w-full mt-4"
                                        disabled={createRefereeMutation.isPending}
                                    >
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
    );
}