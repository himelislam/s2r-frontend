import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
// import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import businessApi from "@/api/businessApi";
import { useUser } from "@/context/usercontext";
import Spinner from "@/components/spinner";
import { Shield, Users, Zap, TrendingUp, Star } from "lucide-react";

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
    mutationFn: businessApi.createBusiness,
    onSuccess: (data) => {
      console.log('signed up as a Business', data);
      const user = JSON.parse(localStorage.getItem('user'))
      user.userType = 'owner'
      user.userId = data._id
      localStorage.setItem('user', JSON.stringify(user))

      // dispatch({
      //   type: 'UPDATE_ROLE',
      //   payload: {
      //     userType: 'owner',
      //     userId: data?._id
      //   }
      // })
      navigate('/welcome')
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
    <div className="flex h-screen w-full items-center justify-center">

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 py-4 text-white">
          <div className="">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3 my-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold">ATTACH-N'-HATCH</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Turn Referrals into Revenue with
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                QR Campaigns
              </span>
            </h1>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Empower businesses to launch trackable referral campaigns, reward promoters, and grow their customer base—all through dynamic QR codes and seamless automation.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-blue-100">Multi-Campaign Management </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-blue-100">Dynamic QR Codes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-blue-100">Referrer Rewards System </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="text-blue-100">Advanced analytics & insights</span>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-blue-100 mb-4 italic">
                "Attach-n-Hatch helped us triple our referrals in just 3 months. The automated tracking and rewards system saved us hours of manual work!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">SJ</span>
                </div>
                <div>
                  <div className="font-semibold text-white">Sarah Johnson</div>
                  <div className="text-blue-300 text-sm">Product Manager, TechCorp</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">10K+</div>
                <div className="text-blue-300 text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">50K+</div>
                <div className="text-blue-300 text-sm">Projects Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">99.9%</div>
                <div className="text-blue-300 text-sm">Uptime</div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-10 right-20 w-16 h-16 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 right-5 w-2 h-2 bg-white/40 rounded-full"></div>
        <div className="absolute top-1/3 right-12 w-1 h-1 bg-white/60 rounded-full"></div>
      </div>


      <div className="mx-auto w-3/6">
        <Card className="mx-auto max-w-5xl p-6 m-6">
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
              <Button type="submit" className="w-full" disabled={createBusinessMutation.isPending}>
                {createBusinessMutation.isPending
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
      </div>
    </div>
  );
}

export default BusinessSetup;
