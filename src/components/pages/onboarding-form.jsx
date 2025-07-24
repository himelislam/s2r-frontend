// "use client"

// import { useState } from "react"
// import { ChevronLeft, ChevronRight, CheckCircle, Zap, Users, Shield, TrendingUp, Star } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { useMutation } from "@tanstack/react-query"
// import businessApi from "@/api/businessApi"
// import { useNavigate } from "react-router-dom"
// import InfoSidebar from "./Infosidebar"

// const businessTypeOptions = ["E-commerce", "Service-based", "SaaS (Software as a service)", "Agency", "Personal brand", "Other"]

// const hearAboutUsOptions = ["Google", "YouTube", "Friend or colleague", "Social Media", "Newsletter", "Other"]

// const roleOptions = ["Founder", "Marketer", "Developer", "Designer", "Operations", "Other"]

// export default function OnboardingForm() {
//   const [currentStep, setCurrentStep] = useState(0)
//   const [isSubmitted, setIsSubmitted] = useState(false)
//   const [formData, setFormData] = useState({
//     businessType: "",
//     hearAboutUs: "",
//     role: "",
//     additionalInfo: "",
//   })
//   const user = JSON.parse(localStorage.getItem('user'));
//   const navigate = useNavigate()

//   const totalSteps = 4

//   const updateFormData = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//   }

//   const nextStep = () => {
//     if (currentStep < totalSteps - 1) {
//       setCurrentStep(currentStep + 1)
//     } else {
//       handleSubmit()
//     }
//   }

//   const prevStep = () => {
//     if (currentStep > 0) {
//       setCurrentStep(currentStep - 1)
//     }
//   }

//   const skipStep = () => {
//     if (currentStep < totalSteps - 1) {
//       setCurrentStep(currentStep + 1)
//     } else {
//       handleSubmit()
//     }
//   }

//   const handleSubmit = () => {
//     console.log("Form submitted:", formData)
//     createOnboardingMutation.mutate({
//         ...formData,
//         businessId: user.userId
//     })
//     // setIsSubmitted(true)
//   }

//   const createOnboardingMutation = useMutation({
//     mutationFn: businessApi.createOnboardingData,
//     onSuccess: (data) =>{
//         console.log(data);
//         setIsSubmitted(true)
//     },
//     onError: (err)=>{
//         console.log(err)
//     }
//   })

//   const getStepTitle = () => {
//     switch (currentStep) {
//       case 0:
//         return "Tell us about your business"
//       case 1:
//         return "How did you find us?"
//       case 2:
//         return "What's your role?"
//       case 3:
//         return "Anything else to share?"
//       default:
//         return ""
//     }
//   }

//   const getStepDescription = () => {
//     switch (currentStep) {
//       case 0:
//         return "Help us to understand the type of business you're running or want to establish"
//       case 1:
//         return "We'd love to know how you discovered our platform"
//       case 2:
//         return "This helps us tailor the experience for you"
//       case 3:
//         return "Share your goals or what you're looking for (optional)"
//       default:
//         return ""
//     }
//   }

//   if (isSubmitted) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <InfoSidebar/>
//         <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
//           <CardContent className="pt-8 pb-8 text-center">
//             <div className="mb-6">
//               <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//               <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanks for the info!</h2>
//               <p className="text-gray-600">You're all set. Let's get you started on your referral journey.</p>
//             </div>
//             <Button
//               onClick={() => {navigate('/b/dashboard')}}
//               className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
//             >
//               Continue to Dashboard
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen  flex items-center justify-center">

//       <InfoSidebar/>


//       <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm transition-all duration-300 ease-in-out">
//         <CardHeader className="text-center pb-4">
//           <div className="flex justify-center mb-4">
//             <div className="flex space-x-2">
//               {Array.from({ length: totalSteps }).map((_, index) => (
//                 <div
//                   key={index}
//                   className={`w-2 h-2 rounded-full transition-all duration-300 ${
//                     index <= currentStep ? "bg-blue-600" : "bg-gray-300"
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>
//           <CardTitle className="text-xl font-semibold text-gray-900">{getStepTitle()}</CardTitle>
//           <CardDescription className="text-gray-600">{getStepDescription()}</CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           <div className="space-y-6">
//             {/* Step 0: Business Type */}
//             {currentStep === 0 && (
//               <div className="animate-in fade-in-50 duration-300">
//                 <div className="space-y-2">
//                   <Label className="text-sm font-medium text-gray-700">What type of business are you in?</Label>
//                   <Select
//                     onValueChange={(value) => updateFormData("businessType", value)}
//                     value={formData.businessType}
//                   >
//                     <SelectTrigger className="w-full">
//                       <SelectValue placeholder="Select your business type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {businessTypeOptions.map((option) => (
//                         <SelectItem key={option} value={option}>
//                           {option}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             )}

//             {/* Step 1: How did you hear about us */}
//             {currentStep === 1 && (
//               <div className="animate-in fade-in-50 duration-300">
//                 <div className="space-y-2">
//                   <Label className="text-sm font-medium text-gray-700">How did you hear about us?</Label>
//                   <Select onValueChange={(value) => updateFormData("hearAboutUs", value)} value={formData.hearAboutUs}>
//                     <SelectTrigger className="w-full">
//                       <SelectValue placeholder="Select an option" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {hearAboutUsOptions.map((option) => (
//                         <SelectItem key={option} value={option}>
//                           {option}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             )}

//             {/* Step 2: Role */}
//             {currentStep === 2 && (
//               <div className="animate-in fade-in-50 duration-300">
//                 <div className="space-y-2">
//                   <Label className="text-sm font-medium text-gray-700">What's your role in the business?</Label>
//                   <Select onValueChange={(value) => updateFormData("role", value)} value={formData.role}>
//                     <SelectTrigger className="w-full">
//                       <SelectValue placeholder="Select your role" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {roleOptions.map((option) => (
//                         <SelectItem key={option} value={option}>
//                           {option}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             )}

//             {/* Step 3: Additional Info */}
//             {currentStep === 3 && (
//               <div className="animate-in fade-in-50 duration-300">
//                 <div className="space-y-2">
//                   <Label className="text-sm font-medium text-gray-700">
//                     Tell us more about your goals or what you're looking for
//                   </Label>
//                   <Textarea
//                     placeholder="Share anything that would help us personalize your experience..."
//                     className="min-h-[100px] resize-none"
//                     value={formData.additionalInfo}
//                     onChange={(e) => updateFormData("additionalInfo", e.target.value)}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Navigation Buttons */}
//           <div className="flex flex-col space-y-3 pt-4">
//             <div className="flex justify-between space-x-3">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={prevStep}
//                 disabled={currentStep === 0}
//                 className="flex-1 bg-transparent"
//               >
//                 <ChevronLeft className="w-4 h-4 mr-1" />
//                 Back
//               </Button>
//               <Button
//                 type="button"
//                 onClick={nextStep}
//                 className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
//               >
//                 {currentStep === totalSteps - 1 ? "Finish" : "Next"}
//                 {currentStep !== totalSteps - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
//               </Button>
//             </div>
//             <Button
//               type="button"
//               variant="ghost"
//               onClick={skipStep}
//               className="w-full text-gray-500 hover:text-gray-700"
//             >
//               Skip this step
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }




"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import InfoSidebar from "./Infosidebar"
import businessApi from "@/api/businessApi"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

const businessTypeOptions = ["Service-based", "Product-based"]

const hearAboutUsOptions = ["Google", "Social Media", "Friend or colleague", "Other"]

const roleOptions = ["Founder", "Marketer", "Developer", "Other"]

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [skipType, setSkipType] = useState("forever") // 'forever' or 'later'
  const [formData, setFormData] = useState({
    businessType: "",
    hearAboutUs: "",
    role: "",
    additionalInfo: "",
  });
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate()

  const totalSteps = 3

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

  const skipAllSteps = (type) => {
    setSkipType(type)
    handleSubmit()
  }

   const handleSubmit = () => {
    console.log("Form submitted:", formData)
    console.log("Skip Type", skipType);
    createOnboardingMutation.mutate({
        ...formData,
        businessId: user.userId
    })
    setIsSubmitted(true)
  }

  const createOnboardingMutation = useMutation({
    mutationFn: businessApi.createOnboardingData,
    onSuccess: (data) =>{
        console.log(data);
        user.skipType = skipType;
        localStorage.setItem("user", JSON.stringify(user));
        setIsSubmitted(true)
    },
    onError: (err)=>{
        console.log(err)
    }
  })

  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return "Let's understand your business better! 🚀"
      case 1:
        return "How did you discover us? 🔍"
      case 2:
        return "Tell us a bit about yourself! 👋"
      default:
        return ""
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 0:
        return "This helps us customize the platform to work perfectly for your business type"
      case 1:
        return "We love hearing how awesome people like you find us!"
      case 2:
        return "Knowing your role helps us show you the most relevant features first"
      default:
        return ""
    }
  }

  const getSuccessMessage = () => {
    if (skipType === "forever") {
      return {
        title: "No worries at all! 👍",
        description:
          "You can always update your preferences later in your account settings. Let's get you started with the platform!",
      }
    } else if (skipType === "later") {
      return {
        title: "We'll catch up later! ⏰",
        description:
          "No problem! We'll remind you to complete this setup later so we can better personalize your experience.",
      }
    } else {
      return {
        title: "Thank you so much! 🎉",
        description:
          "We're excited to help you grow your business with referrals! Based on what you've shared, we'll reach out soon with personalized tips and features that match your needs.",
      }
    }
  }

  if (isSubmitted) {
    const successMsg = getSuccessMessage()

    return (
      <div className="flex h-screen w-full items-center justify-center">
        <InfoSidebar/>
        <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mb-6">
              <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{successMsg.title}</h2>
              <p className="text-gray-600 mb-4">{successMsg.description}</p>
              <p className="text-sm text-gray-500">Ready to start building your referral network?</p>
            </div>
            <Button
              onClick={() => navigate('/b/dashboard')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Let's Get Started! 🚀
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <InfoSidebar/>
      
      <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm transition-all duration-300 ease-in-out">
        {/* Skip All Options - Subtle top section */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Want to skip the questions?</span>
            <div className="flex gap-2">
              <button
                onClick={() => skipAllSteps("later")}
                className="text-blue-600 hover:text-blue-700 underline transition-colors"
              >
                Fill out later
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => skipAllSteps("forever")}
                className="text-gray-500 hover:text-gray-700 underline transition-colors"
              >
                Skip forever
              </button>
            </div>
          </div>
        </div>

        <CardHeader className="text-center pb-4 pt-2">
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
          {currentStep === 0 && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                💡 <strong>Why we ask:</strong> This information helps us understand your business better so we can
                reach out with personalized recommendations and features that actually matter to you!
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-6">
            {/* Step 0: Business Type */}
            {currentStep === 0 && (
              <div className="animate-in fade-in-50 duration-300">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">What kind of business do you run?</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {businessTypeOptions.map((option) => (
                      <Button
                        key={option}
                        type="button"
                        variant={formData.businessType === option ? "default" : "outline"}
                        className={`w-full justify-start h-auto p-4 text-left transition-all ${
                          formData.businessType === option
                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                            : "bg-white hover:bg-gray-50 border-gray-200"
                        }`}
                        onClick={() => updateFormData("businessType", option)}
                      >
                        <div>
                          <div className="font-medium">{option}</div>
                          <div className="text-xs opacity-70 mt-1">
                            {option === "Service-based"
                              ? "Consulting, coaching, agencies, freelancing, etc."
                              : "Physical products, digital products, e-commerce, etc."}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: How did you hear about us */}
            {currentStep === 1 && (
              <div className="animate-in fade-in-50 duration-300">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">How did you find us?</Label>
                  <p className="text-xs text-gray-500 mb-3">
                    We're curious! This helps us know where to focus our efforts to help more businesses like yours.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {hearAboutUsOptions.map((option) => (
                      <Button
                        key={option}
                        type="button"
                        variant={formData.hearAboutUs === option ? "default" : "outline"}
                        className={`w-full justify-center h-auto p-4 text-center transition-all ${
                          formData.hearAboutUs === option
                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                            : "bg-white hover:bg-gray-50 border-gray-200"
                        }`}
                        onClick={() => updateFormData("hearAboutUs", option)}
                      >
                        <div className="font-medium">{option}</div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Role and Additional Info Combined */}
            {currentStep === 2 && (
              <div className="animate-in fade-in-50 duration-300">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">What's your role in the business?</Label>
                    <p className="text-xs text-gray-500 mb-3">
                      This helps us show you the most relevant features and tips for your position.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {roleOptions.map((option) => (
                        <Button
                          key={option}
                          type="button"
                          variant={formData.role === option ? "default" : "outline"}
                          className={`w-full justify-center h-auto p-4 text-center transition-all ${
                            formData.role === option
                              ? "bg-blue-600 text-white border-blue-600 shadow-md"
                              : "bg-white hover:bg-gray-50 border-gray-200"
                          }`}
                          onClick={() => updateFormData("role", option)}
                        >
                          <div className="font-medium">{option}</div>
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Anything specific you're hoping to achieve? 💭
                    </Label>
                    <p className="text-xs text-gray-500 mb-2">
                      Optional, but helpful! Share your goals so we can reach out with personalized advice.
                    </p>
                    <Textarea
                      placeholder="e.g., 'I want to get more referrals from existing customers' or 'Looking to build a partner network'..."
                      className="min-h-[80px] resize-none"
                      value={formData.additionalInfo}
                      onChange={(e) => updateFormData("additionalInfo", e.target.value)}
                    />
                  </div>
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
                {currentStep === totalSteps - 1 ? "All Done! 🎉" : "Next Step"}
                {currentStep !== totalSteps - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={skipStep}
              className="w-full text-gray-500 hover:text-gray-700"
            >
              Skip this question
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

