import { Shield, Star, TrendingUp, Users, Zap } from 'lucide-react'
import React from 'react'

export default function InfoSidebar() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden h-full">
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
            <div className="w-12 h-12 bg-white rounded-xl overflow-hidden p-1">
              <img
                src="https://cdn.cmsfly.com/680cda66c612a5002b6d29d1/images/Screenshot2025-07-24at103638PM-L1HtJ.png"
                alt=""
                className="w-full h-full object-cover rounded-sm"
              />
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
          {/* <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
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
            </div> */}

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
  )
}
