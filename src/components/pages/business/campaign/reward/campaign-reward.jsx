// import { useState, useEffect } from "react";
// import { ChevronRight, Gift, Tag } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { useNavigate, useParams } from "react-router-dom";
// import { useMutation } from "@tanstack/react-query";
// import { Loader } from "@/components/pages/loader";
// import campaignApi from "@/api/campaignApi";
// import { toast } from "react-toastify";

// export default function RewardSystemForm() {
//     const [rewardType, setRewardType] = useState(undefined); // COUPON, GIFTCARD, or CASH
//     const [code, setCode] = useState(""); // Single code for COUPON
//     const [codes, setCodes] = useState([]); // Array of codes for GIFTCARD
//     const [amount, setAmount] = useState(0); // Amount for GIFTCARD or CASH
//     const [currency, setCurrency] = useState(""); // Currency for GIFTCARD or CASH
//     const [giftCardMethod, setGiftCardMethod] = useState(""); // Bulk import or add later
//     const [bulkImportMethod, setBulkImportMethod] = useState("add-now"); // Add now or upload CSV
//     const [csvFile, setCsvFile] = useState(null); // Uploaded CSV file
//     const navigate = useNavigate();
//     const { campaignId } = useParams();
//     const [campaign, setCampaign] = useState(null);

//     const handleSaveRewardSettings = () => {
//         const rewardData = {
//             rewardType,
//             code: rewardType === "COUPON" ? code : undefined,
//             codes: rewardType === "GIFTCARD" ? codes : undefined,
//             amount: rewardType !== "COUPON" ? amount : undefined,
//             currency: rewardType !== "COUPON" ? currency : undefined,
//             method: rewardType === "GIFTCARD" ? giftCardMethod : undefined,
//         };
//         console.log("Reward Data:", rewardData);

//         updateCampaignRewardMutation.mutate({
//             campaignId: campaignId,
//             reward: rewardData,
//         });
//     };

//     const updateCampaignRewardMutation = useMutation({
//         mutationFn: campaignApi.updateCampaignReward,
//         onSuccess: (data) => {
//             console.log(data, "update reward data");
//             toast.success("Reward settings saved successfully");
//         },
//         onError: (err) => {
//             console.log(err, "update reward err");
//         },
//     });

//     const handleBulkImportMethodChange = (value) => {
//         setBulkImportMethod(value);
//     };

//     const handleTextareaChange = (event) => {
//         setCodes(
//             event.target.value
//                 .split("\n")
//                 .map((line) => line.trim()) // Trim whitespace from each line
//         );
//     };

//     const handleFileChange = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             setCsvFile(file);
//             parseCsvFile(file);
//         }
//     };

//     const parseCsvFile = (file) => {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//             const text = e.target.result;
//             const rows = text.split("\n").map((row) => row.trim()).filter((row) => row.length > 0);
//             const headers = rows[0].split(",");
//             const data = rows.slice(1).map((row) => {
//                 const values = row.split(",");
//                 return headers.reduce((obj, header, index) => {
//                     obj[header] = values[index];
//                     return obj;
//                 }, {});
//             });

//             // Extract codes, amount, and currency from CSV
//             const parsedCodes = data.map((row) => row.Code);
//             const parsedAmount = data[0]?.Amount; // Assuming all rows have the same amount
//             const parsedCurrency = data[0]?.Currency; // Assuming all rows have the same currency

//             setCodes(parsedCodes);
//             setAmount(parsedAmount);
//             setCurrency(parsedCurrency);
//         };
//         reader.readAsText(file);
//     };

//     const handleGiftCardMethodChange = (value) => {
//         setGiftCardMethod(value);
//     };

//     useEffect(() => {
//         if (rewardType === "GIFTCARD") {
//             handleGiftCardMethodChange(giftCardMethod);
//         }
//     }, [rewardType, giftCardMethod]);

//     const getCampaignbyIdMutation = useMutation({
//         mutationFn: campaignApi.getCampaignById,
//         onSuccess: (data) => {
//             setCampaign(data);
//             if (data.reward) {
//                 setRewardType(data.reward.rewardType || undefined);
//                 setCode(data.reward.code || "");
//                 setCodes(data.reward.codes || []);
//                 setAmount(data.reward.amount || 0);
//                 setCurrency(data.reward.currency || "");
//                 setGiftCardMethod(data.reward.method || "add-later");
//             }
//         },
//         onError: (err) => {
//             console.log(err, "get Err");
//         },
//     });

//     useEffect(() => {
//         getCampaignbyIdMutation.mutate({
//             campaignId: campaignId,
//         });
//     }, []);

//     if (getCampaignbyIdMutation.isPending) {
//         return <Loader />;
//     }

//     return (
//         <div className="flex-1 flex flex-col">
//             <h1 className="text-xl font-bold mb-2">{campaign?.campaignName}</h1>
//             <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center space-x-2">
//                     <div
//                         className="text-sm text-muted-foreground font-medium cursor-pointer hover:underline"
//                         onClick={() => navigate(`/b/dashboard/campaign-portal/builder/${campaignId}`)}
//                     >
//                         Campaign
//                     </div>
//                     <ChevronRight className="h-4 w-4 text-muted-foreground" />
//                     <div
//                         className="text-sm text-muted-foreground text-orange-500 font-medium cursor-pointer hover:underline"
//                         onClick={() => navigate(`/b/dashboard/campaign-portal/reward/${campaignId}`)}
//                     >
//                         Reward
//                     </div>
//                     <ChevronRight className="h-4 w-4 text-muted-foreground" />
//                     <div
//                         className="text-sm text-muted-foreground cursor-pointer hover:underline"
//                         onClick={() => navigate(`/b/dashboard/campaign-portal/settings/${campaignId}`)}
//                     >
//                         Settings
//                     </div>
//                     <ChevronRight className="h-4 w-4 text-muted-foreground" />
//                     <div
//                         className="text-sm text-muted-foreground cursor-pointer hover:underline"
//                         onClick={() => navigate(`/b/dashboard/campaign-portal/email-builder/${campaignId}`)}
//                     >
//                         Email
//                     </div>
//                     <ChevronRight className="h-4 w-4 text-muted-foreground" />
//                     <div
//                         className="text-sm text-muted-foreground cursor-pointer hover:underline"
//                         onClick={() => navigate(`/b/dashboard/campaign-portal/integration/${campaignId}`)}
//                     >
//                         Integration
//                     </div>
//                     <ChevronRight className="h-4 w-4 text-muted-foreground" />
//                     <div
//                         className="text-sm text-muted-foreground cursor-pointer hover:underline"
//                         onClick={() => navigate(`/b/dashboard/campaign-portal/promotes/${campaignId}`)}
//                     >
//                         Promotes
//                     </div>
//                 </div>
//             </div>

//             <Card className="w-full max-w-2xl mx-auto">
//                 <CardHeader>
//                     <CardTitle className="text-2xl">Reward System Setup</CardTitle>
//                     <CardDescription>Choose a reward method for your customers</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                     <RadioGroup value={rewardType} onValueChange={setRewardType} className="grid gap-4">
//                         <div className="flex items-start space-x-3 space-y-0">
//                             <RadioGroupItem value="COUPON" id="coupon" className="mt-1" />
//                             <div className="grid gap-1.5 leading-none">
//                                 <Label htmlFor="coupon" className="text-base font-medium flex items-center gap-2">
//                                     <Tag className="h-4 w-4" />
//                                     Coupon Code
//                                 </Label>
//                                 <p className="text-sm text-muted-foreground">
//                                     Offer discount codes that customers can redeem at checkout
//                                 </p>
//                             </div>
//                         </div>
//                         <div className="flex items-start space-x-3 space-y-0">
//                             <RadioGroupItem value="GIFTCARD" id="giftcard" className="mt-1" />
//                             <div className="grid gap-1.5 leading-none">
//                                 <Label htmlFor="giftcard" className="text-base font-medium flex items-center gap-2">
//                                     <Gift className="h-4 w-4" />
//                                     Amazon Gift Card
//                                 </Label>
//                                 <p className="text-sm text-muted-foreground">Reward customers with Amazon gift cards</p>
//                             </div>
//                         </div>
//                     </RadioGroup>

//                     {rewardType === "COUPON" && (
//                         <div className="space-y-3 pt-2">
//                             <Label htmlFor="coupon-code">Coupon Code</Label>
//                             <Input
//                                 id="coupon-code"
//                                 placeholder="Enter coupon code (e.g., SUMMER25)"
//                                 value={code}
//                                 onChange={(e) => setCode(e.target.value)}
//                             />
//                             <p className="text-xs text-muted-foreground">
//                                 This code will be shared with customers when they qualify for a reward
//                             </p>
//                         </div>
//                     )}

//                     {rewardType === "GIFTCARD" && (
//                         <div className="space-y-4 pt-2">
//                             <div className="grid gap-2">
//                                 <Label className="text-base">Gift Card Setup Method</Label>
//                                 <RadioGroup
//                                     // defaultValue="add-later"
//                                     name="gift-card-method"
//                                     className="grid gap-3"
//                                     value={giftCardMethod}
//                                     onValueChange={handleGiftCardMethodChange}
//                                 >
//                                     <div className="flex items-center space-x-2 rounded-md border p-3">
//                                         <RadioGroupItem value="bulk-import" id="bulk-import" />
//                                         <Label htmlFor="bulk-import" className="flex-1 cursor-pointer">
//                                             Bulk Import Gift Cards
//                                         </Label>
//                                     </div>
//                                     <div className="flex items-center space-x-2 rounded-md border p-3">
//                                         <RadioGroupItem value="add-later" id="add-later" />
//                                         <Label htmlFor="add-later" className="flex-1 cursor-pointer">
//                                             Add Gift Cards Later
//                                         </Label>
//                                     </div>
//                                 </RadioGroup>
//                             </div>

//                             {giftCardMethod === "bulk-import" && (
//                                 <div className="space-y-4">
//                                     <div className="grid gap-2">
//                                         <Label className="text-base">Bulk Import Method</Label>
//                                         <RadioGroup
//                                             // defaultValue="add-now"
//                                             name="bulk-import-method"
//                                             className="grid gap-3"
//                                             value={bulkImportMethod}
//                                             onValueChange={handleBulkImportMethodChange}
//                                         >
//                                             <div className="flex items-center space-x-2 rounded-md border p-3">
//                                                 <RadioGroupItem value="add-now" id="add-now" />
//                                                 <Label htmlFor="add-now" className="flex-1 cursor-pointer">
//                                                     Add Now (Paste Codes)
//                                                 </Label>
//                                             </div>
//                                             <div className="flex items-center space-x-2 rounded-md border p-3">
//                                                 <RadioGroupItem value="upload-csv" id="upload-csv" />
//                                                 <Label htmlFor="upload-csv" className="flex-1 cursor-pointer">
//                                                     Upload CSV File
//                                                 </Label>
//                                             </div>
//                                         </RadioGroup>
//                                     </div>

//                                     {bulkImportMethod === "add-now" && (
//                                         <div className="space-y-4">
//                                             <div className="grid grid-cols-2 gap-4">
//                                                 <div className="grid gap-2">
//                                                     <Label htmlFor="currency">Currency</Label>
//                                                     <Input
//                                                         id="currency"
//                                                         type="text"
//                                                         placeholder="Enter currency (e.g., USD)"
//                                                         value={currency}
//                                                         onChange={(e) => setCurrency(e.target.value)}
//                                                     />
//                                                 </div>
//                                                 <div className="grid gap-2">
//                                                     <Label htmlFor="amount">Amount</Label>
//                                                     <Input
//                                                         id="amount"
//                                                         type="number"
//                                                         placeholder="Enter amount (e.g., $50)"
//                                                         value={amount}
//                                                         onChange={(e) => setAmount(Number(e.target.value))}
//                                                     />
//                                                 </div>
//                                             </div>
//                                             <div className="grid gap-2">
//                                                 <Label htmlFor="gift-card-textarea">Paste Gift Card Codes</Label>
//                                                 <textarea
//                                                     id="gift-card-textarea"
//                                                     className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                                                     placeholder="Enter one gift card code per line"
//                                                     value={codes.join("\n")}
//                                                     onChange={handleTextareaChange}
//                                                 />
//                                                 <p className="text-xs text-muted-foreground">
//                                                     Enter one gift card code per line.
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     )}

//                                     {bulkImportMethod === "upload-csv" && (
//                                         <div className="space-y-4">
//                                             <div className="grid gap-2">
//                                                 <Label htmlFor="gift-card-file">Upload CSV File</Label>
//                                                 <Input
//                                                     id="gift-card-file"
//                                                     type="file"
//                                                     accept=".csv"
//                                                     className="w-full"
//                                                     onChange={handleFileChange}
//                                                 />
//                                                 <p className="text-xs text-muted-foreground">
//                                                     Ensure the CSV file includes columns for <strong>Code</strong>, <strong>Amount</strong>, and <strong>Currency</strong>.
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}

//                             {giftCardMethod === "add-later" && (
//                                 <div className="space-y-3">
//                                     <p className="text-sm text-muted-foreground">
//                                         You've chosen to add gift card codes later. You can add them from the reward management dashboard
//                                         after setting up the program.
//                                     </p>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </CardContent>
//                 <CardFooter>
//                     <Button className="w-full" disabled={!rewardType} onClick={handleSaveRewardSettings}>
//                         Save Reward Settings
//                     </Button>
//                 </CardFooter>
//             </Card>

//             <div className="flex justify-end gap-2 pt-6">
//                 <Button onClick={() => navigate(`/b/dashboard/campaign-portal/builder/${campaignId}`)} variant="outline">Back</Button>
//                 <Button onClick={() => navigate(`/b/dashboard/campaign-portal/settings/${campaignId}`)} className="bg-amber-500 hover:bg-amber-600">Next</Button>
//             </div>
//         </div>
//     );
// }


import { useState, useEffect } from "react";
import { ChevronRight, Gift, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "@/components/pages/loader";
import campaignApi from "@/api/campaignApi";
import { toast } from "react-toastify";

export default function RewardSystemForm() {
    const [rewardType, setRewardType] = useState(undefined); // COUPON, GIFTCARD, or CASH
    const [code, setCode] = useState(""); // Single code for COUPON
    const [codes, setCodes] = useState([]); // Array of codes for GIFTCARD
    const [amount, setAmount] = useState(0); // Amount for GIFTCARD or CASH
    const [currency, setCurrency] = useState(""); // Currency for GIFTCARD or CASH
    const [couponMethod, setCouponMethod] = useState(""); // Add now or add later for COUPON
    const [giftCardMethod, setGiftCardMethod] = useState(""); // Bulk import or add later for GIFTCARD
    const [bulkImportMethod, setBulkImportMethod] = useState("add-now"); // Add now or upload CSV
    const [csvFile, setCsvFile] = useState(null); // Uploaded CSV file
    const navigate = useNavigate();
    const { campaignId } = useParams();
    const [campaign, setCampaign] = useState(null);

    const handleSaveRewardSettings = () => {
        const rewardData = {
            rewardType,
            code: rewardType === "COUPON" && couponMethod === "add-now" ? code : undefined,
            codes: rewardType === "GIFTCARD" && giftCardMethod === "bulk-import" ? codes : undefined,
            amount: rewardType !== "COUPON" ? amount : undefined,
            currency: rewardType !== "COUPON" ? currency : undefined,
            method: rewardType === "COUPON" ? couponMethod : 
                   rewardType === "GIFTCARD" ? giftCardMethod : undefined,
        };
        console.log("Reward Data:", rewardData);

        updateCampaignRewardMutation.mutate({
            campaignId: campaignId,
            reward: rewardData,
        });
    };

    const updateCampaignRewardMutation = useMutation({
        mutationFn: campaignApi.updateCampaignReward,
        onSuccess: (data) => {
            console.log(data, "update reward data");
            toast.success("Reward settings saved successfully");
        },
        onError: (err) => {
            console.log(err, "update reward err");
        },
    });

    const handleBulkImportMethodChange = (value) => {
        setBulkImportMethod(value);
    };

    const handleTextareaChange = (event) => {
        setCodes(
            event.target.value
                .split("\n")
                .map((line) => line.trim()) // Trim whitespace from each line
        );
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCsvFile(file);
            parseCsvFile(file);
        }
    };

    const parseCsvFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const rows = text.split("\n").map((row) => row.trim()).filter((row) => row.length > 0);
            const headers = rows[0].split(",");
            const data = rows.slice(1).map((row) => {
                const values = row.split(",");
                return headers.reduce((obj, header, index) => {
                    obj[header] = values[index];
                    return obj;
                }, {});
            });

            // Extract codes, amount, and currency from CSV
            const parsedCodes = data.map((row) => row.Code);
            const parsedAmount = data[0]?.Amount; // Assuming all rows have the same amount
            const parsedCurrency = data[0]?.Currency; // Assuming all rows have the same currency

            setCodes(parsedCodes);
            setAmount(parsedAmount);
            setCurrency(parsedCurrency);
        };
        reader.readAsText(file);
    };

    const handleCouponMethodChange = (value) => {
        setCouponMethod(value);
    };

    const handleGiftCardMethodChange = (value) => {
        setGiftCardMethod(value);
    };

    useEffect(() => {
        if (rewardType === "GIFTCARD") {
            handleGiftCardMethodChange(giftCardMethod);
        } else if (rewardType === "COUPON") {
            handleCouponMethodChange(couponMethod);
        }
    }, [rewardType, giftCardMethod, couponMethod]);

    const getCampaignbyIdMutation = useMutation({
        mutationFn: campaignApi.getCampaignById,
        onSuccess: (data) => {
            setCampaign(data);
            if (data.reward) {
                setRewardType(data.reward.rewardType || undefined);
                setCode(data.reward.code || "");
                setCodes(data.reward.codes || []);
                setAmount(data.reward.amount || 0);
                setCurrency(data.reward.currency || "");
                setCouponMethod(data.reward.method || "add-later");
                setGiftCardMethod(data.reward.method || "add-later");
            }
        },
        onError: (err) => {
            console.log(err, "get Err");
        },
    });

    useEffect(() => {
        getCampaignbyIdMutation.mutate({
            campaignId: campaignId,
        });
    }, []);

    if (getCampaignbyIdMutation.isPending) {
        return <Loader />;
    }

    return (
        <div className="flex-1 flex flex-col">
            <h1 className="text-xl font-bold mb-2">{campaign?.campaignName}</h1>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <div
                        className="text-sm text-muted-foreground font-medium cursor-pointer hover:underline"
                        onClick={() => navigate(`/b/dashboard/campaign-portal/builder/${campaignId}`)}
                    >
                        Campaign
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <div
                        className="text-sm text-muted-foreground text-orange-500 font-medium cursor-pointer hover:underline"
                        onClick={() => navigate(`/b/dashboard/campaign-portal/reward/${campaignId}`)}
                    >
                        Reward
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <div
                        className="text-sm text-muted-foreground cursor-pointer hover:underline"
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

            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Reward System Setup</CardTitle>
                    <CardDescription>Choose a reward method for your customers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <RadioGroup value={rewardType} onValueChange={setRewardType} className="grid gap-4">
                        <div className="flex items-start space-x-3 space-y-0">
                            <RadioGroupItem value="COUPON" id="coupon" className="mt-1" />
                            <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="coupon" className="text-base font-medium flex items-center gap-2">
                                    <Tag className="h-4 w-4" />
                                    Coupon Code
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Offer discount codes that customers can redeem at checkout
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 space-y-0">
                            <RadioGroupItem value="GIFTCARD" id="giftcard" className="mt-1" />
                            <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="giftcard" className="text-base font-medium flex items-center gap-2">
                                    <Gift className="h-4 w-4" />
                                    Amazon Gift Card
                                </Label>
                                <p className="text-sm text-muted-foreground">Reward customers with Amazon gift cards</p>
                            </div>
                        </div>
                    </RadioGroup>

                    {rewardType === "COUPON" && (
                        <div className="space-y-4 pt-2">
                            <div className="grid gap-2">
                                <Label className="text-base">Coupon Setup Method</Label>
                                <RadioGroup
                                    value={couponMethod}
                                    onValueChange={handleCouponMethodChange}
                                    className="grid gap-3"
                                >
                                    <div className="flex items-center space-x-2 rounded-md border p-3">
                                        <RadioGroupItem value="add-now" id="coupon-add-now" />
                                        <Label htmlFor="coupon-add-now" className="flex-1 cursor-pointer">
                                            Add Coupon Code Now
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 rounded-md border p-3">
                                        <RadioGroupItem value="add-later" id="coupon-add-later" />
                                        <Label htmlFor="coupon-add-later" className="flex-1 cursor-pointer">
                                            Add Coupon Code Later
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {couponMethod === "add-now" && (
                                <div className="space-y-3">
                                    <Label htmlFor="coupon-code">Coupon Code</Label>
                                    <Input
                                        id="coupon-code"
                                        placeholder="Enter coupon code (e.g., SUMMER25)"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        This code will be shared with customers when they qualify for a reward
                                    </p>
                                </div>
                            )}

                            {couponMethod === "add-later" && (
                                <div className="space-y-3">
                                    <p className="text-sm text-muted-foreground">
                                        You've chosen to add coupon codes later. You can add them from the reward management dashboard
                                        after setting up the program.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {rewardType === "GIFTCARD" && (
                        <div className="space-y-4 pt-2">
                            <div className="grid gap-2">
                                <Label className="text-base">Gift Card Setup Method</Label>
                                <RadioGroup
                                    value={giftCardMethod}
                                    onValueChange={handleGiftCardMethodChange}
                                    className="grid gap-3"
                                >
                                    <div className="flex items-center space-x-2 rounded-md border p-3">
                                        <RadioGroupItem value="bulk-import" id="bulk-import" />
                                        <Label htmlFor="bulk-import" className="flex-1 cursor-pointer">
                                            Bulk Import Gift Cards
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 rounded-md border p-3">
                                        <RadioGroupItem value="add-later" id="add-later" />
                                        <Label htmlFor="add-later" className="flex-1 cursor-pointer">
                                            Add Gift Cards Later
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {giftCardMethod === "bulk-import" && (
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label className="text-base">Bulk Import Method</Label>
                                        <RadioGroup
                                            value={bulkImportMethod}
                                            onValueChange={handleBulkImportMethodChange}
                                            className="grid gap-3"
                                        >
                                            <div className="flex items-center space-x-2 rounded-md border p-3">
                                                <RadioGroupItem value="add-now" id="add-now" />
                                                <Label htmlFor="add-now" className="flex-1 cursor-pointer">
                                                    Add Now (Paste Codes)
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2 rounded-md border p-3">
                                                <RadioGroupItem value="upload-csv" id="upload-csv" />
                                                <Label htmlFor="upload-csv" className="flex-1 cursor-pointer">
                                                    Upload CSV File
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    {bulkImportMethod === "add-now" && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="currency">Currency</Label>
                                                    <Input
                                                        id="currency"
                                                        type="text"
                                                        placeholder="Enter currency (e.g., USD)"
                                                        value={currency}
                                                        onChange={(e) => setCurrency(e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="amount">Amount</Label>
                                                    <Input
                                                        id="amount"
                                                        type="number"
                                                        placeholder="Enter amount (e.g., $50)"
                                                        value={amount}
                                                        onChange={(e) => setAmount(Number(e.target.value))}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="gift-card-textarea">Paste Gift Card Codes</Label>
                                                <textarea
                                                    id="gift-card-textarea"
                                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    placeholder="Enter one gift card code per line"
                                                    value={codes.join("\n")}
                                                    onChange={handleTextareaChange}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Enter one gift card code per line.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {bulkImportMethod === "upload-csv" && (
                                        <div className="space-y-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="gift-card-file">Upload CSV File</Label>
                                                <Input
                                                    id="gift-card-file"
                                                    type="file"
                                                    accept=".csv"
                                                    className="w-full"
                                                    onChange={handleFileChange}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Ensure the CSV file includes columns for <strong>Code</strong>, <strong>Amount</strong>, and <strong>Currency</strong>.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {giftCardMethod === "add-later" && (
                                <div className="space-y-3">
                                    <p className="text-sm text-muted-foreground">
                                        You've chosen to add gift card codes later. You can add them from the reward management dashboard
                                        after setting up the program.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button className="w-full" disabled={!rewardType} onClick={handleSaveRewardSettings}>
                        Save Reward Settings
                    </Button>
                </CardFooter>
            </Card>

            <div className="flex justify-end gap-2 pt-6">
                <Button onClick={() => navigate(`/b/dashboard/campaign-portal/builder/${campaignId}`)} variant="outline">Back</Button>
                <Button onClick={() => navigate(`/b/dashboard/campaign-portal/settings/${campaignId}`)} className="bg-amber-500 hover:bg-amber-600">Next</Button>
            </div>
        </div>
    );
}