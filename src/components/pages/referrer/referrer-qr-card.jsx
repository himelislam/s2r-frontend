import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { ShareSocial } from 'react-share-social';

const style = {
    root: {
      color: 'white',
        height: '100%',
        padding: '0px',
        width: '100%',
        minWidth: '100%',
        margin: 'auto',
        alignItems: 'center',
    },
    copyContainer: {
      display: 'none',
    },
    title: {
      color: 'aquamarine',
      fontStyle: 'italic'
    }
  };

export default function ReferrerQrCard({ card, downloadSingleQrCodesAsPdf }) {
  return (
    <div className="border rounded-lg shadow-sm p-4 bg-white dark:bg-gray-800">
      <div className="relative w-full content-center">
        <h3 className="text-lg font-semibold text-center">QR Code</h3>
        <img src={card?.qrCodeBase64} className='mx-auto w-full' alt="" />
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">Share URL:
          <a href={card?.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {card?.url}
          </a>
        </p>
        <div className='mx-auto w-full'>
        <ShareSocial url={card?.url} socialTypes={['facebook','twitter','whatsapp','linkedin']} style={style}/>
        </div>
      </div>
    </div>
  )
}
