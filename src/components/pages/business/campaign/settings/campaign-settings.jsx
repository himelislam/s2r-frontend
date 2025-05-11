import campaignApi from '@/api/campaignApi';
import { Loader } from '@/components/pages/loader';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation } from '@tanstack/react-query';
import { CalendarIcon, ChevronDown, ChevronRight, ChevronUp, Info, Link2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

export default function CampaignSettings() {
    const { campaignId } = useParams();
    const [campaign, setCampaign] = useState(null);
    const navigate = useNavigate();

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [language, setLanguage] = useState("English");
    const [useDefaultDomain, setUseDefaultDomain] = useState(true);
    const [customDomain, setCustomDomain] = useState("");
    const [senderName, setSenderName] = useState("");
    const [maxReferrals, setMaxReferrals] = useState(null);
    const [maxRewardsPerUser, setMaxRewardsPerUser] = useState(null);
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [pausedCampaignText, setPausedCampaignText] = useState("This campaign is currently paused.");
    const [campaignFavicon, setCampaignFavicon] = useState("");
    const [termsAndConditions, setTermsAndConditions] = useState("");
    const [privacyPolicy, setPrivacyPolicy] = useState("");

    const [openSections, setOpenSections] = useState({
        senderName: false,
        referralLimits: false,
        metaTitle: false,
        defaultText: false,
        campaignFavicon: false,
        termsConditions: false,
        privacyPolicy: false,
    });

    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const getCampaignbyIdMutation = useMutation({
        mutationFn: campaignApi.getCampaignById,
        onSuccess: (data) => {
            setCampaign(data);
            // Initialize state with campaign data
            if (data.settings) {
                setStartDate(data.settings.startDate ? new Date(data.settings.startDate) : null);
                setEndDate(data.settings.endDate ? new Date(data.settings.endDate) : null);
                setLanguage(data.settings.language || "English");
                setUseDefaultDomain(data.settings.domain?.useDefaultDomain ?? true);
                setCustomDomain(data.settings.domain?.customDomain || "");
                setSenderName(data.settings.senderName || "");
                setMaxReferrals(data.settings.referralLimits?.maxReferrals || null);
                setMaxRewardsPerUser(data.settings.referralLimits?.maxRewardsPerUser || null);
                setMetaTitle(data.settings.meta?.title || "");
                setMetaDescription(data.settings.meta?.description || "");
                setPausedCampaignText(data.settings.pausedCampaignText || "This campaign is currently paused.");
                setCampaignFavicon(data.settings.campaignFavicon || "");
                setTermsAndConditions(data.settings.legal?.termsAndConditions || "");
                setPrivacyPolicy(data.settings.legal?.privacyPolicy || "");
            }
        },
        onError: (err) => {
            console.log(err, "get Err");
        },
    });



    useEffect(() => {
        getCampaignbyIdMutation.mutate({ campaignId });
    }, []);

    const handleSaveSettings = async () => {
        const updatedSettings = {
            startDate,
            endDate,
            language,
            domain: {
                useDefaultDomain,
                defaultDomain: "referral-factory.com",
                customDomain,
            },
            senderName,
            referralLimits: {
                maxReferrals,
                maxRewardsPerUser,
            },
            meta: {
                title: metaTitle,
                description: metaDescription,
            },
            pausedCampaignText,
            campaignFavicon,
            legal: {
                termsAndConditions,
                privacyPolicy,
            },
        };

        updateCampaignSettingsMutation.mutate({
            campaignId: campaignId,
            settings: updatedSettings,
        });
    };

    const updateCampaignSettingsMutation = useMutation({
        mutationFn: campaignApi.updateCampaignSettings,
        onSuccess: (data) => {
            console.log(data, "update reward data");
            toast.success("Settings saved successfully");
        },
        onError: (err) => {
            console.log(err, "update reward err");
        },
    });

    if (getCampaignbyIdMutation.isPending) {
        return <Loader />;
    }

    return (
        <div>
            <div className="flex-1 flex flex-col">
                <h1 className="text-xl font-bold mb-2">{campaign?.campaignName}</h1>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <div
                            className="text-sm text-muted-foreground font-medium cursor-pointer hover:underline"
                            onClick={() => navigate(`/b/dashboard/campaign-portal/builder/${campaignId}`)}
                        >
                            Campaign
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <div
                            className="text-sm text-muted-foreground font-medium cursor-pointer hover:underline"
                            onClick={() => navigate(`/b/dashboard/campaign-portal/reward/${campaignId}`)}
                        >
                            Reward
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <div
                            className="text-sm text-orange-500 cursor-pointer hover:underline"
                            onClick={() => navigate(`/b/dashboard/campaign-portal/settings/${campaignId}`)}
                        >
                            Settings
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <div
                            className="text-sm text-muted-foreground cursor-pointer hover:underline"
                            onClick={() => navigate(`/b/dashboard/campaign-portal/email-builder/${campaignId}`)}
                        >
                            Email
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <div
                            className="text-sm text-muted-foreground cursor-pointer hover:underline"
                            onClick={() => navigate(`/b/dashboard/campaign-portal/integration/${campaignId}`)}
                        >
                            Integration
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <div
                            className="text-sm text-muted-foreground cursor-pointer hover:underline"
                            onClick={() => navigate(`/b/dashboard/campaign-portal/promotes/${campaignId}`)}
                        >
                            Promotes
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="max-w-6xl mx-auto p-4 space-y-4 bg-slate-50 min-h-screen">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Duration and Language */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-lg font-medium mb-6">Duration and Language</h2>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600">Start Date</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start text-left font-normal bg-gray-50">
                                                    {startDate ? format(startDate, "PPP") : "Start Date"}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600">End Date</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start text-left font-normal bg-gray-50">
                                                    {endDate ? format(endDate, "PPP") : "End Date"}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600">Language</label>
                                    <Select value={language} onValueChange={setLanguage}>
                                        <SelectTrigger className="w-full bg-gray-50">
                                            <SelectValue placeholder="English" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="English">English</SelectItem>
                                            <SelectItem value="Spanish">Spanish</SelectItem>
                                            <SelectItem value="French">French</SelectItem>
                                            <SelectItem value="German">German</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Domain Used For Links */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-lg font-medium mb-6">Domain Used For Links</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-medium">Default Domain (Used For Links)</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        By default your links will be generated on a subdomain of Attach-N-Hatch.
                                    </p>
                                    <div className="flex items-center gap-2 mt-4">
                                        <Input value="demo" className="max-w-[200px] bg-gray-50" />
                                        <div className="bg-gray-200 text-gray-600 px-3 py-2 rounded">.attachnhatch.com</div>
                                    </div>
                                </div>
                                <div className="bg-blue-600 text-white p-4 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Generate referral links using your own domain</p>
                                            <Button variant="outline" className="mt-4 bg-white text-blue-600 hover:bg-blue-50">
                                                Create Account
                                            </Button>
                                        </div>
                                        <Link2 className="h-10 w-10 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Advanced Settings */}
                    <div className="space-y-4">
                        {/* Sender Name */}
                        <Collapsible
                            open={openSections.senderName}
                            onOpenChange={() => toggleSection("senderName")}
                            className="bg-white rounded-lg shadow-sm overflow-hidden"
                        >
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-6">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-medium">Sender Name (For Email Notifications)</h2>
                                    <Info className="h-5 w-5 text-gray-400" />
                                </div>
                                {openSections.senderName ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-6 pb-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600">Sender Name</label>
                                        <Input
                                            value={senderName}
                                            onChange={(e) => setSenderName(e.target.value)}
                                            placeholder="Enter sender name"
                                            className="bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Referral Limits */}
                        <Collapsible
                            open={openSections.referralLimits}
                            onOpenChange={() => toggleSection("referralLimits")}
                            className="bg-white rounded-lg shadow-sm overflow-hidden"
                        >
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-6">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-medium">Referral Limits</h2>
                                    <Info className="h-5 w-5 text-gray-400" />
                                </div>
                                {openSections.referralLimits ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-6 pb-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600">Max Referrals</label>
                                        <Input
                                            type="number"
                                            value={maxReferrals || ""}
                                            onChange={(e) => setMaxReferrals(e.target.value ? Number(e.target.value) : null)}
                                            placeholder="Enter max referrals"
                                            className="bg-gray-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600">Max Rewards Per User</label>
                                        <Input
                                            type="number"
                                            value={maxRewardsPerUser || ""}
                                            onChange={(e) => setMaxRewardsPerUser(e.target.value ? Number(e.target.value) : null)}
                                            placeholder="Enter max rewards per user"
                                            className="bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Meta Title and Description */}
                        <Collapsible
                            open={openSections.metaTitle}
                            onOpenChange={() => toggleSection("metaTitle")}
                            className="bg-white rounded-lg shadow-sm overflow-hidden"
                        >
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-6">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-medium">Meta Title and Description</h2>
                                    <Info className="h-5 w-5 text-gray-400" />
                                </div>
                                {openSections.metaTitle ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-6 pb-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600">Meta Title</label>
                                        <Input
                                            value={metaTitle}
                                            onChange={(e) => setMetaTitle(e.target.value)}
                                            placeholder="Enter meta title"
                                            className="bg-gray-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600">Meta Description</label>
                                        <Input
                                            value={metaDescription}
                                            onChange={(e) => setMetaDescription(e.target.value)}
                                            placeholder="Enter meta description"
                                            className="bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Default Text For Paused Campaign */}
                        <Collapsible
                            open={openSections.defaultText}
                            onOpenChange={() => toggleSection("defaultText")}
                            className="bg-white rounded-lg shadow-sm overflow-hidden"
                        >
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-6">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-medium">Default Text For Paused Campaign</h2>
                                    <Info className="h-5 w-5 text-gray-400" />
                                </div>
                                {openSections.defaultText ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-6 pb-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600">Paused Campaign Text</label>
                                        <Input
                                            value={pausedCampaignText}
                                            onChange={(e) => setPausedCampaignText(e.target.value)}
                                            placeholder="Enter paused campaign text"
                                            className="bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Campaign Favicon */}
                        <Collapsible
                            open={openSections.campaignFavicon}
                            onOpenChange={() => toggleSection("campaignFavicon")}
                            className="bg-white rounded-lg shadow-sm overflow-hidden"
                        >
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-6">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-medium">Campaign Favicon</h2>
                                    <Info className="h-5 w-5 text-gray-400" />
                                </div>
                                {openSections.campaignFavicon ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-6 pb-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600">Favicon URL</label>
                                        <Input
                                            value={campaignFavicon}
                                            onChange={(e) => setCampaignFavicon(e.target.value)}
                                            placeholder="Enter favicon URL"
                                            className="bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Terms and Conditions */}
                        <Collapsible
                            open={openSections.termsConditions}
                            onOpenChange={() => toggleSection("termsConditions")}
                            className="bg-white rounded-lg shadow-sm overflow-hidden"
                        >
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-6">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-medium">Terms and Conditions</h2>
                                    <Info className="h-5 w-5 text-gray-400" />
                                </div>
                                {openSections.termsConditions ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-6 pb-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600">Terms and Conditions</label>
                                        <Input
                                            value={termsAndConditions}
                                            onChange={(e) => setTermsAndConditions(e.target.value)}
                                            placeholder="Enter terms and conditions"
                                            className="bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Privacy Policy */}
                        <Collapsible
                            open={openSections.privacyPolicy}
                            onOpenChange={() => toggleSection("privacyPolicy")}
                            className="bg-white rounded-lg shadow-sm overflow-hidden"
                        >
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-6">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-medium">Privacy Policy</h2>
                                    <Info className="h-5 w-5 text-gray-400" />
                                </div>
                                {openSections.privacyPolicy ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-6 pb-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600">Privacy Policy</label>
                                        <Input
                                            value={privacyPolicy}
                                            onChange={(e) => setPrivacyPolicy(e.target.value)}
                                            placeholder="Enter privacy policy"
                                            className="bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
                            Save Settings
                        </Button>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button onClick={() => navigate(`/b/dashboard/campaign-portal/reward/${campaignId}`)} variant="outline">Back</Button>
                        <Button onClick={() => navigate(`/b/dashboard/campaign-portal/email-builder/${campaignId}`)} className="bg-amber-500 hover:bg-amber-600">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}