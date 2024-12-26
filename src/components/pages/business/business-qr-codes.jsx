import businessApi from '@/api/businessApi';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import QrCard from './qr-card';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Minus, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export default function BusinessQrCodes() {
    const [isAvailable, setisAvailable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openGenerateModal, setOpenGenerateModal] = useState(false);
    const [isOpenDownloadModal, setOpenDownloadModal] = useState(false)
    const [numberOfCodes, setNumberOfCodes] = useState(1);
    const [qrCodeHeight, setQrCodeHeight] = useState(50)
    const [qrCodeWidth, setQrCodeWidth] = useState(50)
    const queryClient = useQueryClient();
    const user = JSON.parse(localStorage.getItem('user'));

    const { data: business = [], isLoading, isError, error } = useQuery({
        queryKey: ['getBusinessById', user?.userId],
        queryFn: () => businessApi.getBusinessById(user?.userId),
        enabled: !!user?.userId,
    })

    const generateQrCodeMutation = useMutation({
        mutationFn: businessApi.generateQrCodes,
        onSuccess: async (response) => {
            toast.success(response?.message)
            queryClient.invalidateQueries(['getBusinessById', user?.userId])
        },
        onError: (err) => {
            console.log(err);
            toast.error(err?.message)
        }
    })

    const generateQrCodes = async () => {
        setLoading(true);
        generateQrCodeMutation.mutate({
            businessId: user?.userId,
            numberOfCodes: numberOfCodes
        })
        setLoading(false);
        setOpenGenerateModal(false);
    }

    const downloadSingleQrCodesAsPdf = (card) => {
        const doc = new jsPDF();

        // Convert base64 to an image and add it to the PDF
        const imgData = card?.qrCodeBase64;
        doc.addImage(imgData, 'PNG', 10, 10, 180, 160); // Change position and size as needed

        // Add additional text or information
        doc.setFont("helvetica", "bold"); // Set font style
        doc.setFontSize(20); // Set font size
        const pageWidth = doc.internal.pageSize.width;

        // Add Qr Id
        const qrId = `QR ID: ${card?.id}`;
        const qrIdTextWidth = doc.getTextWidth(qrId);
        const qrIdXCenter = (pageWidth - qrIdTextWidth) / 2;
        doc.text(qrId, qrIdXCenter, 180);

        // Add business name in the middle
        const businessName = `Business Name: ${business?.businessName}`;
        const textWidth = doc.getTextWidth(businessName);
        const xCenter = (pageWidth - textWidth) / 2; // Calculate center position
        doc.text(businessName, xCenter, 190); // Add text at Y=180

        // Add status in the middle
        const status = `Status: ${card?.status}`;
        const statusTextWidth = doc.getTextWidth(status);
        const statusXCenter = (pageWidth - statusTextWidth) / 2;
        doc.text(status, statusXCenter, 200);


        // Save the generated PDF
        doc.save(`qrCode${card?.status}.pdf`);
    }

    const downloadAllQrCodesAsPdf = (busienss, qrCodeWidth, qrCodeHeight) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        const marginX = 5; // Margin from left and right edges
        const marginY = 5; // Margin from top and bottom edges
        const spacingX = 10; // Horizontal spacing between QR codes
        const spacingY = 10; // Vertical spacing between QR codes

        let currentX = marginX;
        let currentY = marginY;

        const qrCodes = busienss.qrCodes;

        qrCodes.forEach((card, index) => {
            // Add QR Code Image
            const imgData = card?.qrCodeBase64;
            doc.addImage(imgData, 'PNG', currentX, currentY, qrCodeWidth, qrCodeHeight);

            // Add QR ID below the QR code
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            const qrId = `QR ID: ${card?.id}`;
            doc.text(qrId, currentX + qrCodeWidth / 2, currentY + qrCodeHeight + 5, { align: "center" });

            // Move to the next column
            currentX += qrCodeWidth + spacingX;

            // Check if the next QR code will overflow the page width
            if (currentX + qrCodeWidth + marginX > pageWidth) {
                currentX = marginX; // Reset to the first column
                currentY += qrCodeHeight + spacingY; // Move to the next row
            }

            // Check if the next QR code will overflow the page height
            if (currentY + qrCodeHeight + marginY > pageHeight) {
                doc.addPage(); // Add a new page
                currentX = marginX; // Reset X position for the new page
                currentY = marginY; // Reset Y position for the new page
            }
        });

        // Save the PDF
        doc.save('AnH-qrCodes.pdf');
        setOpenDownloadModal(false);
    };


    // const downloadAllQrCodesAsJpg = (busienss, qrCodeWidth, qrCodeHeight) => {
    //     const canvas = document.createElement("canvas");
    //     const ctx = canvas.getContext("2d");

    //     // Set canvas size based on QR code layout
    //     const marginX = 10;
    //     const marginY = 10;
    //     const spacingX = 10;
    //     const spacingY = 10;
    //     const pageWidth = 210; // Width in mm (default A4 width)
    //     const pageHeight = 297; // Height in mm (default A4 height)

    //     canvas.width = pageWidth * 4; // Convert mm to pixels (at 96 DPI)
    //     canvas.height = pageHeight * 4; // Convert mm to pixels (at 96 DPI)
    //     ctx.scale(4, 4); // Scale up for high-resolution output

    //     let currentX = marginX;
    //     let currentY = marginY;

    //     busienss.qrCodes.forEach((card) => {
    //         // Draw QR Code Image
    //         const img = new Image();
    //         img.src = card?.qrCodeBase64;
    //         ctx.drawImage(img, currentX, currentY, qrCodeWidth, qrCodeHeight);

    //         // Add QR ID text below the QR code
    //         ctx.font = "8px Helvetica";
    //         ctx.textAlign = "center";
    //         ctx.fillText(
    //             `QR ID: ${card?.id}`,
    //             currentX + qrCodeWidth / 2,
    //             currentY + qrCodeHeight + 5
    //         ); 

    //         // Move to the next column
    //         currentX += qrCodeWidth + spacingX;

    //         // Check if the next QR code will overflow the page width
    //         if (currentX + qrCodeWidth + marginX > pageWidth) {
    //             currentX = marginX; // Reset to the first column
    //             currentY += qrCodeHeight + spacingY; // Move to the next row
    //         }

    //         // Check if the next QR code will overflow the page height
    //         if (currentY + qrCodeHeight + marginY > pageHeight) {
    //             console.error("Exceeds canvas height. Add new canvas if needed.");
    //         }
    //     });

    //     // Convert Canvas to JPG
    //     canvas.toBlob((blob) => {
    //         const link = document.createElement("a");
    //         link.href = URL.createObjectURL(blob);
    //         link.download = "AnH-qrCodes.jpg";
    //         link.click();
    //     }, "image/jpeg");
    // };


    return (
        <div className="container">
            <div>
                <Dialog open={openGenerateModal} onOpenChange={setOpenGenerateModal}>
                    <DialogTrigger asChild>
                        <Button disabled={generateQrCodeMutation.isLoading} className="mb-6 me-5">
                            Generate QR Codes
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogTitle>Enter the Number of QR Codes</DialogTitle>
                        <DialogDescription>Please input the number of QR codes you want to generate.</DialogDescription>
                        <Input
                            type="number"
                            value={numberOfCodes}
                            onChange={(e) => setNumberOfCodes(Number(e.target.value))}
                            min={1} // Ensure that the number is at least 1
                        />
                        <DialogFooter>
                            <Button onClick={generateQrCodes} disabled={generateQrCodeMutation.isPending} className='mb-6 me-5'>
                                {generateQrCodeMutation.isPending ? "Generating..." : "Generate QR Codes"}
                            </Button>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Drawer>
                    <DrawerTrigger asChild>
                        {
                            business?.qrCodes?.length > 0 &&
                            <Button onClick={() => setOpenDownloadModal(true)}>Download All QR Codes</Button>

                        }
                    </DrawerTrigger>
                    <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                            <DrawerHeader>
                                <DrawerTitle className='text-center text-xl'>Qr Codes</DrawerTitle>
                                <DrawerDescription className='text-center'>Set Height and Width of the Qr code</DrawerDescription>
                            </DrawerHeader>
                            <div className="p-4 pb-0">
                                <div className="flex items-center justify-center space-x-2">
                                    <Label>Height (mm)</Label>
                                    <Input
                                        type="number"
                                        value={qrCodeHeight}
                                        onChange={(e) => setQrCodeHeight(Number(e.target.value))}
                                        min={30} // Ensure that the number is at least 1
                                    />
                                    <Label>Width (mm)</Label>
                                    <Input
                                        type="number"
                                        value={qrCodeWidth}
                                        onChange={(e) => setQrCodeWidth(Number(e.target.value))}
                                        min={30} // Ensure that the number is at least 1
                                    />

                                </div>
                                <div className="mt-3">
                                    <Carousel className="w-full">
                                        <CarouselContent>
                                            {Array.from({ length: 5 }).map((_, index) => (
                                                <CarouselItem key={index}>
                                                    <div className="p-1">
                                                        <Card>
                                                            <CardContent className="flex aspect-square items-center justify-center p-6">
                                                                <span className="text-4xl font-semibold">{index + 1}</span>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious />
                                        <CarouselNext />
                                    </Carousel>
                                </div>
                            </div>
                            <DrawerFooter>
                                <Button onClick={() => downloadAllQrCodesAsPdf(business, qrCodeWidth, qrCodeHeight)}>Download</Button>
                                <DrawerClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {business?.qrCodes?.map((card) => <QrCard card={card} downloadSingleQrCodesAsPdf={downloadSingleQrCodesAsPdf} />)}
            </div>
        </div>
    )
}
