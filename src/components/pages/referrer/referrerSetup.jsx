import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import referrerApi from "@/api/referrerApi";
import businessApi from "@/api/businessApi";
import Spinner from "@/components/spinner";

export function ReferrerSetup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    signature: null,
    selectedBusiness: ""
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'))

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setForm({
      ...form,
      signature: e.target.files[0],
    });
  };

  const createReferrerMutation = useMutation({
    mutationFn: referrerApi.createReferrer,
    onSuccess: (data) => {
      console.log('referrer created successfully', data);
      const user = JSON.parse(localStorage.getItem('user'))
      user.userType = 'referrer'
      user.userId = data._id
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/r/dashboard')
    },
    onError: (err) => {
      console.log('Unable to create referrer', err);
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();

    createReferrerMutation.mutate({
      name: user?.name,
      email: user?.email,
      phone: form.phone,
      signature: form.signature,
      userType: 'referrer',
      businessId: form.selectedBusiness,
      invited: false // sending flag from referrer setup without invitation
    })
    console.log("Referrer setup data:", form);
  };


  const { data: businesses = [], isLoading, isError, error } = useQuery({
    queryKey: ['getAllBusiness'],
    queryFn: businessApi.getAllBusiness
  })


  return (
    <Card className="mx-auto max-w-md p-6">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Referrer Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="referrer@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          {/* <ul>
            {isLoading && <p>Loading businesses...</p>}
            {isError && <p>Error loading businesses: {error.message}</p>}
            {businesses && businesses.length > 0 ? (
              businesses.map((business) => (
                <li key={business._id}>
                  {business.name} - {business._id}
                </li>
              ))
            ) : (
              !isLoading && <p>No businesses available</p>
            )}
          </ul> */}
          <div className="space-y-2">
            <Label htmlFor="business">Select a Business</Label>
            {isLoading ? (
              <p>Loading businesses...</p>
            ) : isError ? (
              <p>Error loading businesses: {error.message}</p>
            ) : (
              <select
                id="business"
                name="selectedBusiness"
                value={form.selectedBusiness}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              >
                <option value="" disabled>
                  Select a business
                </option>
                {businesses.map((business) => (
                  <option key={business._id} value={business._id}>
                    {business.businessName} - {business.location}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signature">E-Signature</Label>
            <Input
              id="signature"
              name="signature"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <Button type="submit" className="w-full" disabled={createReferrerMutation.isPending}>
            {createReferrerMutation.isPending
              ? (
                <>
                  Submit <Spinner />
                </>
              )
              : 'Submit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default ReferrerSetup;
