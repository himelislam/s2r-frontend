import React from 'react'
import { useQuery} from '@tanstack/react-query';
import referrerApi from '@/api/referrerApi';
import ReferrerQrCard from './referrer-qr-card';

export default function ReferrerOverview() {

  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  const { data, isError } = useQuery({
    queryKey: ['getQrCodeByReferrerId', user?.userId, user?.businessId],
    queryFn: ({ queryKey }) => {
      const [,referrerId, businessId] = queryKey; // Destructure arguments from the key
      return referrerApi.getQrCodeByReferrerId({
        referrerId,
        businessId
      });
    },
    retry: 1,
    retryDelay: 100,
    enabled: !!user?.userId 
  })

  return (
    <div>
      {/* <h1>Referrer Overview hello</h1> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReferrerQrCard card={data} />
      </div>
    </div>
  )
}
