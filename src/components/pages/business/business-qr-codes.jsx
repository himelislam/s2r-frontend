import businessApi from '@/api/businessApi';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'

export default function BusinessQrCodes() {
    const [qrCodes, setQrCodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    const generateQrCodeMutation = useMutation({
        mutationFn: businessApi.createQrCodes,
        onSuccess: async (response) => {
            console.log(response);
            const blob = response; // The response is a Blob
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'qr-codes.pdf'; // Set file name for the download
            link.click();

            window.URL.revokeObjectURL(url);
        },
        onError: (err) => {
            console.log(err);
        }
    })

    // Function to generate 10 QR codes
    const generateQrCodes = async () => {
        setLoading(true);
        const codes = [];

        generateQrCodeMutation.mutate({
            businessId: user?.userId,
            numberOfCodes: 4
        })

        // setQrCodes(codes);
        setLoading(false);
    };

    // Function to download QR codes as PDF
    const downloadQrCodesAsPdf = () => {
        // const pdf = new jsPDF();
        // qrCodes.forEach((code, index) => {
        //     const x = 10;
        //     const y = 10 + index * 30; // Adjust spacing
        //     pdf.text(`QR Code ${index + 1}: ${code.data}`, x, y - 5);
        //     pdf.addImage(code.qr, "PNG", x, y, 50, 50);

        //     if ((index + 1) % 5 === 0 && index + 1 !== qrCodes.length) {
        //         pdf.addPage();
        //     }
        // });
        // pdf.save("qr-codes.pdf");
    };
    return (
        <div className="container py-10 flex">
            <Button onClick={generateQrCodes} disabled={loading} className="mb-6 me-5">
                {loading ? "Generating..." : "Generate QR Codes"}
            </Button>

            {
                qrCodes.length > 0 &&
                <Button onClick={downloadQrCodesAsPdf}>
                    Download as PDF
                </Button>
            }
        </div>
    )
}
