import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
// import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { useMutation } from "@tanstack/react-query";
import userApi from "@/api/userApi";
import { useNavigate } from "react-router-dom";

export function BusinessSetup() {
  const [form, setForm] = useState({
    businessName: "",
    businessEmail: "",
    phone: "",
    address: ""
  });
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user'));
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createBusinessMutation = useMutation({
    mutationFn: userApi.createBusiness,
    onSuccess: (data) => {
      console.log('signed up as a Business', data);
      const user = JSON.parse(localStorage.getItem('user'))
      user.userType = 'owner'
      user.userId = data._id
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/b/dashboard')
    },
    onError: (err) => {
      console.error('Cant sign up as a Busiess', err?.message);
    }
  })


  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission logic, such as API call
    console.log("Business setup data:", form, user.name, user.email, user.token);
    createBusinessMutation.mutate({
      name: user?.name,
      email: user.email,
      userType: 'owner',
      ...form
    })
  };

  return (
    <Card className="mx-auto max-w-lg p-6">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Business Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              name="businessName"
              placeholder="Enter your business name"
              value={form.businessName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="businessEmail"
              name="businessEmail"
              type="email"
              placeholder="business@example.com"
              value={form.businessEmail}
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
            <Label htmlFor="address">Business Address</Label>
            <Input
              id="address"
              name="address"
              placeholder="Enter your business address"
              value={form.address}
              onChange={handleChange}
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

export default BusinessSetup;
