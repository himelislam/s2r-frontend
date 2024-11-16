import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import userApi from "@/api/userApi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function ReferrerSetup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    signature: null,
  });

  const navigate = useNavigate();

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
    mutationFn: userApi.createReferrer,
    onSuccess: (data) =>{
      console.log('referrer created successfully', data);
      navigate('/dashboard')
    },
    onError: (err)=>{
      console.log('Unable to create referrer', err);
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();

    createReferrerMutation.mutate({
      ...form
    })
    console.log("Referrer setup data:", form);
  };


  // const {data, isLoading, isError, error} = useQuery({
  //   queryKey: ['businesses'], 
  //   queryFn: async ()=>{
  //     const response = await axios.post('http://localhost:4000/business')
  //     return response.data;
  //   }
  // })


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
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default ReferrerSetup;
