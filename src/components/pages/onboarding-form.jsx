"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, CheckCircle, Zap, Users, Shield, TrendingUp, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useMutation } from "@tanstack/react-query"
import businessApi from "@/api/businessApi"
import { useNavigate } from "react-router-dom"

const businessTypeOptions = ["E-commerce", "Service-based", "SaaS (Software as a service)", "Agency", "Personal brand", "Other"]

const hearAboutUsOptions = ["Google", "YouTube", "Friend or colleague", "Social Media", "Newsletter", "Other"]

const roleOptions = ["Founder", "Marketer", "Developer", "Designer", "Operations", "Other"]

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    businessType: "",
    hearAboutUs: "",
    role: "",
    additionalInfo: "",
  })
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate()

  const totalSteps = 4

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    console.log("Form submitted:", formData)
    createOnboardingMutation.mutate({
        ...formData,
        businessId: user.userId
    })
    // setIsSubmitted(true)
  }

  const createOnboardingMutation = useMutation({
    mutationFn: businessApi.createOnboardingData,
    onSuccess: (data) =>{
        console.log(data);
        setIsSubmitted(true)
    },
    onError: (err)=>{
        console.log(err)
    }
  })

  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return "Tell us about your business"
      case 1:
        return "How did you find us?"
      case 2:
        return "What's your role?"
      case 3:
        return "Anything else to share?"
      default:
        return ""
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 0:
        return "Help us to understand the type of business you're running or want to establish"
      case 1:
        return "We'd love to know how you discovered our platform"
      case 2:
        return "This helps us tailor the experience for you"
      case 3:
        return "Share your goals or what you're looking for (optional)"
      default:
        return ""
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanks for the info!</h2>
              <p className="text-gray-600">You're all set. Let's get you started on your referral journey.</p>
            </div>
            <Button
              onClick={() => {navigate('/b/dashboard')}}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Continue to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen  flex items-center justify-center">

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


      <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm transition-all duration-300 ease-in-out">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="flex space-x-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index <= currentStep ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">{getStepTitle()}</CardTitle>
          <CardDescription className="text-gray-600">{getStepDescription()}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-6">
            {/* Step 0: Business Type */}
            {currentStep === 0 && (
              <div className="animate-in fade-in-50 duration-300">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">What type of business are you in?</Label>
                  <Select
                    onValueChange={(value) => updateFormData("businessType", value)}
                    value={formData.businessType}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 1: How did you hear about us */}
            {currentStep === 1 && (
              <div className="animate-in fade-in-50 duration-300">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">How did you hear about us?</Label>
                  <Select onValueChange={(value) => updateFormData("hearAboutUs", value)} value={formData.hearAboutUs}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {hearAboutUsOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Role */}
            {currentStep === 2 && (
              <div className="animate-in fade-in-50 duration-300">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">What's your role in the business?</Label>
                  <Select onValueChange={(value) => updateFormData("role", value)} value={formData.role}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Additional Info */}
            {currentStep === 3 && (
              <div className="animate-in fade-in-50 duration-300">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Tell us more about your goals or what you're looking for
                  </Label>
                  <Textarea
                    placeholder="Share anything that would help us personalize your experience..."
                    className="min-h-[100px] resize-none"
                    value={formData.additionalInfo}
                    onChange={(e) => updateFormData("additionalInfo", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col space-y-3 pt-4">
            <div className="flex justify-between space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex-1 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {currentStep === totalSteps - 1 ? "Finish" : "Next"}
                {currentStep !== totalSteps - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={skipStep}
              className="w-full text-gray-500 hover:text-gray-700"
            >
              Skip this step
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
