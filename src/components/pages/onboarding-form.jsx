"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useMutation } from "@tanstack/react-query"
import businessApi from "@/api/businessApi"
import { useNavigate } from "react-router-dom"

const businessTypeOptions = ["E-commerce", "Service-based", "SaaS", "Agency", "Personal brand", "Other"]

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
        return "Help us understand what type of business you're running"
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
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
