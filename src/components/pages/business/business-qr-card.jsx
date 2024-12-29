import businessApi from '@/api/businessApi';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import React from 'react'

export default function BusinessQrCard({ card, downloadSingleQrCodesAsPdf }) {

  const user = JSON.parse(localStorage.getItem("user"))

  const { data: busienss = [] } = useQuery({
    queryKey: ['getBusinessById', user?.userId],
    queryFn: () => businessApi.getBusinessById(user?.userId),
    enabled: !!user?.userId,
  })

  return (
    <div className="border rounded-lg shadow-sm p-4 bg-white dark:bg-gray-800">
      <div className="relative w-full content-center">
        <img src={card?.qrCodeBase64} className='mx-auto w-full' alt="" />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">ID: {card?.id}</h3>
        <h3 className="text-lg font-semibold">Referrer Name: {card?.referrerName ? card?.referrerName : "None"}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 truncate"> URL:
          <a href={card?.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {card?.url}
          </a>
        </p>
        <p className={`mt-2 text-sm font-medium ${status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
          Status: {card?.status}
        </p>
        <Button onClick={() => downloadSingleQrCodesAsPdf(card)}>Download PDF</Button>
      </div>
    </div>
  )
}
