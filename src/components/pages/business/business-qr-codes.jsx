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

export default function BusinessQrCodes() {
    const [isAvailable, setisAvailable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openGenerateModal, setOpenGenerateModal] = useState(false);
    const [isOpenDownloadModal, setOpenDownloadModal] = useState(false)
    const [numberOfCodes, setNumberOfCodes] = useState(1);
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

    const downloadAllQrCodesAsPdf = (busienss) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        let currentY = 10; // Starting Y position for the first QR code

        const qrCodes = busienss.qrCodes;

        qrCodes.forEach((card, index) => {
            // Add QR Code Image
            const imgData = card?.qrCodeBase64;
            doc.addImage(imgData, 'PNG', 20, currentY, 50, 50); // Adjust size and position as needed

            // Add Business Name
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);

            const qrId = `QR ID: ${card?.id}`;
            const qrIdTextWidth = doc.getTextWidth(qrId);
            const qrIdXCenter = (pageWidth - qrIdTextWidth) / 2;
            doc.text(qrId, qrIdXCenter, currentY + 10);

            const businessName = `Business Name: ${busienss?.businessName}`;
            const businessNameWidth = doc.getTextWidth(businessName);
            const businessNameXCenter = (pageWidth - businessNameWidth) / 2;
            doc.text(businessName, businessNameXCenter, currentY + 20);

            // Add Status
            const status = `Status: ${card?.status}`;
            const statusWidth = doc.getTextWidth(status);
            const statusXCenter = (pageWidth - statusWidth) / 2;
            doc.text(status, statusXCenter, currentY + 30);

            // Add Referrer Name
            const referrerName = `Referrer Name: ${card?.referrerName ? card?.referrerName : 'None'}`;
            const referrerNameWidth = doc.getTextWidth(referrerName);
            const referrerNameXCenter = (pageWidth - referrerNameWidth) / 2;
            doc.text(referrerName, referrerNameXCenter, currentY + 40);

            // Move to the next position or page
            currentY += 50; // Adjust spacing between QR codes

            // Check if the next QR code would overflow the page height
            if (currentY + 80 > pageHeight) {
                doc.addPage(); // Add a new page
                currentY = 10; // Reset Y position for the new page
            }
        });

        // Save the PDF
        doc.save('AnH-qrCodes.pdf');
        setOpenDownloadModal(false);
    };

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
                            <Button onClick={generateQrCodes} disabled={generateQrCodeMutation.isLoading} className='mb-6 me-5'>
                                {generateQrCodeMutation.isLoading ? "Generating..." : "Generate QR Codes"}
                            </Button>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {
                    business?.qrCodes?.length > 0 &&
                    <Button onClick={() => setOpenDownloadModal(true)}>Download All QR Codes</Button>

                }

                <Dialog open={isOpenDownloadModal} onOpenChange={setOpenDownloadModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Download</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to download all QR codes as a PDF?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpenDownloadModal(false)}>
                                Cancel
                            </Button>
                            <Button onClick={() => downloadAllQrCodesAsPdf(business)}>Yes, Download</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {business?.qrCodes?.map((card) => <QrCard card={card} downloadSingleQrCodesAsPdf={downloadSingleQrCodesAsPdf} />)}
            </div>
        </div>
    )
}
