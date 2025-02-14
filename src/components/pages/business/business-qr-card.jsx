import businessApi from '@/api/businessApi';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import React from 'react'

export default function BusinessQrCard({ card, downloadSingleQrCodesAsPdf }) {

  const user = JSON.parse(localStorage.getItem("user"))

  const { data: busienss = [] } = useQuery({
    queryKey: ['getBusinessById', user?.userId],
    queryFn: () => businessApi.getBusinessById(user?.userId),
    enabled: !!user?.userId,
  })

  return (
    // <div className="border rounded-lg shadow-sm p-4 bg-white dark:bg-gray-800">
    //   <div className="relative w-full content-center">
    //     <img src={card?.qrCodeBase64} className='mx-auto w-full' alt="" />
    //   </div>
    //   <div className="mt-4">
    //     <h3 className="text-lg font-semibold">ID: {card?.id}</h3>
    //     <h3 className="text-lg font-semibold">Referrer Name: {card?.referrerName ? card?.referrerName : "None"}</h3>
    //     <p className="text-sm text-gray-600 dark:text-gray-300 truncate"> URL:
    //       <a href={card?.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
    //         {card?.url}
    //       </a>
    //     </p>
    //     <p className={`mt-2 text-sm font-medium ${status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
    //       Status: {card?.status}
    //     </p>
    //     <Button onClick={() => downloadSingleQrCodesAsPdf(card)}>Download PDF</Button>
    //   </div>
    // </div>

    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">ID: {card?.id}</h3>
          <Badge variant={card?.status === "assigned" ? "success" : "destructive"}>{card?.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Referrer: {card?.referrerName || "None"}</p>
      </CardHeader>
      <CardContent>
        <AspectRatio ratio={1 / 1} className="bg-muted">
          <img
            src={card?.qrCodeBase64 || "/placeholder.svg"}
            alt={`QR Code for ${card?.id}`}
            className="rounded-md object-cover"
          />
        </AspectRatio>
        <div className="mt-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-sm text-muted-foreground truncate">URL: {card?.url}</p>
              </TooltipTrigger>
              <TooltipContent>
                <a
                  href={card?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:underline"
                >
                  {card?.url} <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => downloadSingleQrCodesAsPdf(card)} className="w-full">
          Download PDF
        </Button>
      </CardFooter>
    </Card>
  )
}
