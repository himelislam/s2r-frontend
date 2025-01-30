import React, { useEffect, useState } from "react"
import { Monitor, Tablet, Smartphone, PenSquare, Wrench, Share2, ChevronLeft, ChevronRight, Plus, Trash2, Mail, QrCode, CalendarIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useLocation } from "react-router-dom"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import EditableText from "./builder/editable-text"
import useEditableContent from "@/hooks/useEditableContent"
import campaignApi from "@/api/campaignApi"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"

const steps = [
  "Person Referring",
  "Person Invited",
  "Settings",
  "Integration",
  "Email Notifications",
  "Promote"
]

export default function CampaignBuilder() {
  const [currentStep, setCurrentStep] = useState(0)
  const [deviceView, setDeviceView] = useState("desktop")
  const [personReferringStep, setPersonReferringStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    termsAccepted: false
  })

  const [date, setDate] = useState(Date)

  const { state } = useLocation();
  const campaign = state?.campaign || null;

  console.log(campaign._id, "campaign id");

  const referralLink = "https://ministry.referral-factory.com/cLILwj4l"

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
  }

  const referrerName = 'Referrer'
  const businessName = "Business"
  const [selectedElement, setSelectedElement] = useState('header');

  const {
    content,
    updateContent,
    updateStyles,
    getContentAsJSON,
    setContent
  } = useEditableContent();

  // get campaign state

  const getCampaignStateMutation = useMutation({
    mutationFn: campaignApi.getCampaignState,
    onSuccess: (data) => {
      console.log(data, "getstate");
      const dd = JSON.parse(data)
      setContent(dd);
    },
    onError: (err) => {
      console.log(err, "get Err");
    }
  })

  useEffect(()=> {
    getCampaignStateMutation.mutate({
      campaignId: campaign._id
    })
  },[])

// ---------------------


  // update builder state

  const updateCampaignStateMutation = useMutation({
    mutationFn: campaignApi.updateCampaignState,
    onSuccess: (data) => {
      console.log(data);
      toast.success(data.message)
    },
    onError: (err) => {
      console.log(err, "err");
    }
  })

  const handleSave = () => {
    const jsonContent = getContentAsJSON();
    updateCampaignStateMutation.mutate({
      state: JSON.stringify(content),
      campaignId: campaign._id
    })
    console.log(jsonContent); // This can be sent to your database
  };
// ------------

  // Function to replace placeholders with dynamic values
  const renderContent = (content) => {
    return content
      .replace(/{{referrerName}}/g, referrerName)
      .replace(/{{businessName}}/g, businessName);
  };


  // for image
  const [uploadedImage, setUploadedImage] = useState(null);

  // profile image upload
  const uploadLogoMutation = useMutation({
    mutationFn: campaignApi.uploadImage,
    onSuccess: (data) => {
      console.log(data, "success");
      setUploadedImage(data.url);
      updateContent('logo', data.url);
      toast.success('Image uploaded successfully')
    },
    onError: (err) => {
      console.log(err, "errror on file upload");
      toast.error('Unable to upload image.')
    }
  })


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      uploadLogoMutation.mutate(formData);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Progress Bar */}
        <h1 className="text-xl font-bold mb-2 ps-4">{campaign?.campaignName}</h1>
        <div className="border-b bg-background pb-4 px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {steps.map((step, index) => (
                <React.Fragment key={step}>
                  <div
                    className={`text-sm ${index === currentStep ? "text-orange-500 font-medium" : "text-muted-foreground"
                      } cursor-pointer`}
                    onClick={() => setCurrentStep(index)}
                  >
                    {step}
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground mr-2">
                Step {personReferringStep}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPersonReferringStep(1)}
                disabled={personReferringStep === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPersonReferringStep(2)}
                disabled={personReferringStep === 2}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="border-l mx-2 h-6" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={deviceView === "desktop" ? "bg-blue-50" : ""}
                      onClick={() => setDeviceView("desktop")}
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Desktop View</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={deviceView === "tablet" ? "bg-blue-50" : ""}
                      onClick={() => setDeviceView("tablet")}
                    >
                      <Tablet className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Tablet View</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={deviceView === "mobile" ? "bg-blue-50" : ""}
                      onClick={() => setDeviceView("mobile")}
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mobile View</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="gap-2">
                <PenSquare className="h-4 w-4" />
                Design
              </Button>
              <Button variant="outline" className="gap-2">
                <Wrench className="h-4 w-4" />
                Build
              </Button>
              <Button variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex">
          <div className="flex-1 p-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-orange-100/50 text-orange-800 px-3 py-1 rounded-full text-sm inline-block mb-4">
                Step {personReferringStep} - Person Referred
              </div>

              {personReferringStep === 1 ? (
                <div>
                  <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                    <div className="items-center mb-4">
                      {/* Editable Image */}
                      <img
                        src={content.logo.content}
                        style={content.logo.styles}
                        alt=""
                        className="w-40 h-40 mx-auto cursor-pointer"
                        onClick={() => setSelectedElement('logo')}
                      />

                      {/* Editable Header */}
                      <EditableText
                        value={content.header.content}
                        onChange={(value) => updateContent('header', value)}
                        className="text-center text-xl"
                        styles={content.header.styles}
                        elementName="header"
                        setSelectedElement={setSelectedElement}
                        renderContent={renderContent}
                      />
                    </div>

                    {/* Editable Description 1 */}
                    <EditableText
                      value={content.description1.content}
                      onChange={(value) => updateContent('description1', value)}
                      className="text-md text-gray-800 dark:text-gray-200 mb-4 text-center"
                      styles={content.description1.styles}
                      elementName="description1"
                      setSelectedElement={setSelectedElement}
                      renderContent={renderContent}
                    />

                    {/* Editable Description 2 */}
                    <EditableText
                      value={content.description2.content}
                      onChange={(value) => updateContent('description2', value)}
                      className="text-md text-gray-800 dark:text-gray-200 mb-4 text-center"
                      styles={content.description2.styles}
                      elementName="description2"
                      setSelectedElement={setSelectedElement}
                      renderContent={renderContent}
                    />

                    <div>
                      <img
                        src="https://dcdko16buub2z.cloudfront.net/images/XrwbjBN0860gkf4G.gif"
                        alt=""
                        className="w-full p-2"
                      />
                    </div>

                    {/* Rest of your form */}
                    <Card className="mx-auto max-w-md">
                      <CardContent>
                        <form>
                          <div className="grid gap-4 mt-4">
                            <div className="grid gap-2">
                              <Label htmlFor="email">Name</Label>
                              <Input
                                id="name"
                                type="text"
                                placeholder=""
                                required
                                onChange={(e) => setName(e.target.value)}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="email">Phone</Label>
                              <Input
                                id="number"
                                type="number"
                                placeholder=""
                                required
                                onChange={(e) => setPhone(e.target.value)}
                              />
                            </div>

                            <Label htmlFor="email">Preferred Contact Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[330px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon />
                                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={date}
                                  onSelect={setDate}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>

                            <Button type="submit" className="w-full">
                              Submit
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                    <div className="items-center mb-4">
                      <img
                        src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg"
                        alt=""
                        className="w-40 h-40 mx-auto"
                      />

                      {/* Editable Header */}
                      <EditableText
                        value={content.header.content}
                        onChange={(value) => updateContent('header', value)}
                        className="text-center text-xl"
                        styles={content.header.styles}
                        elementName="header"
                        setSelectedElement={setSelectedElement}
                        renderContent={renderContent}
                      />
                    </div>

                    {/* Editable Description 1 */}
                    <EditableText
                      value={content.description1.content}
                      onChange={(value) => updateContent('description1', value)}
                      className="text-md text-gray-800 dark:text-gray-200 mb-4 text-center"
                      styles={content.description1.styles}
                      elementName="description1"
                      setSelectedElement={setSelectedElement}
                      renderContent={renderContent}
                    />

                    {/* Editable Description 2 */}
                    <EditableText
                      value={content.description2.content}
                      onChange={(value) => updateContent('description2', value)}
                      className="text-md text-gray-800 dark:text-gray-200 mb-4 text-center"
                      styles={content.description2.styles}
                      elementName="description2"
                      setSelectedElement={setSelectedElement}
                      renderContent={renderContent}
                    />

                    <div>
                      <img
                        src="https://dcdko16buub2z.cloudfront.net/images/XrwbjBN0860gkf4G.gif"
                        alt=""
                        className="w-full p-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="outline">Preview</Button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-64 border-l bg-background p-4">
            <div className="space-y-6">
              {selectedElement === 'header' && (
                <>
                  <h3 className="font-medium mb-3">Header Styles</h3>
                  {/* Background Color Picker */}
                  <div>
                    <h3 className="font-medium mb-3">Background Color</h3>
                    <input
                      type="color"
                      value={content.header.styles.backgroundColor}
                      onChange={(e) =>
                        updateStyles('header', {
                          ...content.header.styles,
                          backgroundColor: e.target.value,
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Font Size Slider */}
                  <div>
                    <h3 className="font-medium mb-3">Font Size</h3>
                    <input
                      type="range"
                      min="12"
                      max="32"
                      value={parseInt(content.header.styles.fontSize)}
                      onChange={(e) =>
                        updateStyles('header', {
                          ...content.header.styles,
                          fontSize: `${e.target.value}px`,
                        })
                      }
                      className="w-full"
                    />
                    <span className="text-xs">{content.header.styles.fontSize}</span>
                  </div>

                  {/* Font Family Selector */}
                  <div>
                    <h3 className="font-medium mb-3">Font Family</h3>
                    <select
                      value={content.header.styles.fontFamily}
                      onChange={(e) =>
                        updateStyles('header', {
                          ...content.header.styles,
                          fontFamily: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="Arial, sans-serif">Arial</option>
                      <option value="Times New Roman, serif">Times New Roman</option>
                      <option value="Courier New, monospace">Courier New</option>
                      <option value="Georgia, serif">Georgia</option>
                    </select>
                  </div>

                  {/* Text Color Picker */}
                  <div>
                    <h3 className="font-medium mb-3">Text Color</h3>
                    <input
                      type="color"
                      value={content.header.styles.color}
                      onChange={(e) =>
                        updateStyles('header', {
                          ...content.header.styles,
                          color: e.target.value,
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Padding Slider */}
                  <div>
                    <h3 className="font-medium mb-3">Padding</h3>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={parseInt(content.header.styles.padding)}
                      onChange={(e) =>
                        updateStyles('header', {
                          ...content.header.styles,
                          padding: `${e.target.value}px`,
                        })
                      }
                      className="w-full"
                    />
                    <span className="text-xs">{content.header.styles.padding}</span>
                  </div>

                  {/* Border Radius Slider */}
                  <div>
                    <h3 className="font-medium mb-3">Border Radius</h3>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={parseInt(content.header.styles.borderRadius)}
                      onChange={(e) =>
                        updateStyles('header', {
                          ...content.header.styles,
                          borderRadius: `${e.target.value}px`,
                        })
                      }
                      className="w-full"
                    />
                    <span className="text-xs">{content.header.styles.borderRadius}</span>
                  </div>
                </>
              )}

              {selectedElement === 'description1' && (
                <>
                  <h3 className="font-medium mb-3">Subtitle Styles</h3>
                  {/* Background Color Picker */}
                  <div>
                    <h3 className="font-medium mb-3">Background Color</h3>
                    <input
                      type="color"
                      value={content.description1.styles.backgroundColor}
                      onChange={(e) =>
                        updateStyles('description1', {
                          ...content.description1.styles,
                          backgroundColor: e.target.value,
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Font Size Slider */}
                  <div>
                    <h3 className="font-medium mb-3">Font Size</h3>
                    <input
                      type="range"
                      min="12"
                      max="32"
                      value={parseInt(content.description1.styles.fontSize)}
                      onChange={(e) =>
                        updateStyles('description1', {
                          ...content.description1.styles,
                          fontSize: `${e.target.value}px`,
                        })
                      }
                      className="w-full"
                    />
                    <span className="text-xs">{content.description1.styles.fontSize}</span>
                  </div>

                  {/* Font Family Selector */}
                  <div>
                    <h3 className="font-medium mb-3">Font Family</h3>
                    <select
                      value={content.description1.styles.fontFamily}
                      onChange={(e) =>
                        updateStyles('description1', {
                          ...content.description1.styles,
                          fontFamily: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="Arial, sans-serif">Arial</option>
                      <option value="Times New Roman, serif">Times New Roman</option>
                      <option value="Courier New, monospace">Courier New</option>
                      <option value="Georgia, serif">Georgia</option>
                    </select>
                  </div>

                  {/* Text Color Picker */}
                  <div>
                    <h3 className="font-medium mb-3">Text Color</h3>
                    <input
                      type="color"
                      value={content.description1.styles.color}
                      onChange={(e) =>
                        updateStyles('description1', {
                          ...content.description1.styles,
                          color: e.target.value,
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Padding Slider */}
                  <div>
                    <h3 className="font-medium mb-3">Padding</h3>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={parseInt(content.description1.styles.padding)}
                      onChange={(e) =>
                        updateStyles('description1', {
                          ...content.description1.styles,
                          padding: `${e.target.value}px`,
                        })
                      }
                      className="w-full"
                    />
                    <span className="text-xs">{content.description1.styles.padding}</span>
                  </div>

                  {/* Border Radius Slider */}
                  <div>
                    <h3 className="font-medium mb-3">Border Radius</h3>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={parseInt(content.description1.styles.borderRadius)}
                      onChange={(e) =>
                        updateStyles('description1', {
                          ...content.description1.styles,
                          borderRadius: `${e.target.value}px`,
                        })
                      }
                      className="w-full"
                    />
                    <span className="text-xs">{content.description1.styles.borderRadius}</span>
                  </div>
                </>
              )}

              {selectedElement === 'description2' && (
                <>
                  <h3 className="font-medium mb-3">Description Styles</h3>
                  {/* Background Color Picker */}
                  <div>
                    <h3 className="font-medium mb-3">Background Color</h3>
                    <input
                      type="color"
                      value={content.description2.styles.backgroundColor}
                      onChange={(e) =>
                        updateStyles('description2', {
                          ...content.description2.styles,
                          backgroundColor: e.target.value,
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Font Size Slider */}
                  <div>
                    <h3 className="font-medium mb-3">Font Size</h3>
                    <input
                      type="range"
                      min="12"
                      max="32"
                      value={parseInt(content.description2.styles.fontSize)}
                      onChange={(e) =>
                        updateStyles('description2', {
                          ...content.description2.styles,
                          fontSize: `${e.target.value}px`,
                        })
                      }
                      className="w-full"
                    />
                    <span className="text-xs">{content.description2.styles.fontSize}</span>
                  </div>

                  {/* Font Family Selector */}
                  <div>
                    <h3 className="font-medium mb-3">Font Family</h3>
                    <select
                      value={content.description2.styles.fontFamily}
                      onChange={(e) =>
                        updateStyles('description2', {
                          ...content.description2.styles,
                          fontFamily: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="Arial, sans-serif">Arial</option>
                      <option value="Times New Roman, serif">Times New Roman</option>
                      <option value="Courier New, monospace">Courier New</option>
                      <option value="Georgia, serif">Georgia</option>
                    </select>
                  </div>

                  {/* Text Color Picker */}
                  <div>
                    <h3 className="font-medium mb-3">Text Color</h3>
                    <input
                      type="color"
                      value={content.description2.styles.color}
                      onChange={(e) =>
                        updateStyles('description2', {
                          ...content.description2.styles,
                          color: e.target.value,
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Padding Slider */}
                  <div>
                    <h3 className="font-medium mb-3">Padding</h3>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={parseInt(content.description2.styles.padding)}
                      onChange={(e) =>
                        updateStyles('description2', {
                          ...content.description2.styles,
                          padding: `${e.target.value}px`,
                        })
                      }
                      className="w-full"
                    />
                    <span className="text-xs">{content.description2.styles.padding}</span>
                  </div>

                  {/* Border Radius Slider */}
                  <div>
                    <h3 className="font-medium mb-3">Border Radius</h3>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={parseInt(content.description2.styles.borderRadius)}
                      onChange={(e) =>
                        updateStyles('description2', {
                          ...content.description2.styles,
                          borderRadius: `${e.target.value}px`,
                        })
                      }
                      className="w-full"
                    />
                    <span className="text-xs">{content.description2.styles.borderRadius}</span>
                  </div>
                </>
              )}

              {selectedElement === 'logo' && (
                <>
                  <h3 className="font-medium mb-3">Logo Styles</h3>
                  {/* Background Color Picker */}
                  <div>
                    <h3 className="font-medium mb-3">Background Color</h3>
                    <input
                      type="color"
                      value={content.logo.styles.backgroundColor}
                      onChange={(e) =>
                        updateStyles('logo', {
                          ...content.logo.styles,
                          backgroundColor: e.target.value,
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Font Size Slider */}
                  <div>
                    <h3 className="font-medium mb-3">Font Size</h3>
                    <input
                      type="range"
                      min="12"
                      max="32"
                      value={parseInt(content.logo.styles.fontSize)}
                      onChange={(e) =>
                        updateStyles('logo', {
                          ...content.logo.styles,
                          fontSize: `${e.target.value}px`,
                        })
                      }
                      className="w-full"
                    />
                    <span className="text-xs">{content.logo.styles.fontSize}</span>
                  </div>

                  {/* Font Family Selector */}
                  <div>
                    <h3 className="font-medium mb-3">Font Family</h3>
                    <select
                      value={content.logo.styles.fontFamily}
                      onChange={(e) =>
                        updateStyles('logo', {
                          ...content.logo.styles,
                          fontFamily: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="Arial, sans-serif">Arial</option>
                      <option value="Times New Roman, serif">Times New Roman</option>
                      <option value="Courier New, monospace">Courier New</option>
                      <option value="Georgia, serif">Georgia</option>
                    </select>
                  </div>

                  {/* Text Color Picker */}
                  <div>
                    <h3 className="font-medium mb-3">Text Color</h3>
                    <input
                      type="color"
                      value={content.logo.styles.color}
                      onChange={(e) =>
                        updateStyles('logo', {
                          ...content.logo.styles,
                          color: e.target.value,
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Padding Slider */}
                  <div>
                    <h3 className="font-medium mb-3">Padding</h3>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={parseInt(content.logo.styles.padding)}
                      onChange={(e) =>
                        updateStyles('logo', {
                          ...content.logo.styles,
                          padding: `${e.target.value}px`,
                        })
                      }
                      className="w-full"
                    />
                    <span className="text-xs">{content.logo.styles.padding}</span>
                  </div>

                  {/* Border Radius Slider */}
                  <div>
                    <h3 className="font-medium mb-3">Border Radius</h3>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={parseInt(content.logo.styles.borderRadius)}
                      onChange={(e) =>
                        updateStyles('logo', {
                          ...content.logo.styles,
                          borderRadius: `${e.target.value}px`,
                        })
                      }
                      className="w-full"
                    />
                    <span className="text-xs">{content.logo.styles.borderRadius}</span>
                  </div>

                  {/* Logo */}
                  <div>
                    <h3 className="font-medium mb-3">Logo</h3>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      // value={parseInt(content.logo.styles.borderRadius)}
                      // onChange={(e) =>
                      //   updateStyles('logo', {
                      //     ...content.logo.styles,
                      //     borderRadius: `${e.target.value}px`,
                      //   })
                      // }
                      className="w-full"
                    />
                    {/* Display Uploaded Image */}
                    {uploadedImage && (
                      <div className="mb-4">
                        <img
                          src={uploadedImage}
                          alt="Uploaded Logo"
                          style={{ borderRadius: content.logo.styles.borderRadius }}
                          className="w-32 h-32 object-cover border border-gray-200"
                        />
                      </div>
                    )}
                    {/* <span className="text-xs">{content.logo.styles.borderRadius}</span> */}
                  </div>

                  {/* Height */}
                  <div>
                    <h3 className="font-medium mb-3">Height</h3>
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={parseInt(content.logo.styles.height)}
                      onChange={(e) =>
                        updateStyles('logo', {
                          ...content.logo.styles,
                          height: `${e.target.value}px`,
                        })
                      }
                      className="w-full"
                    />
                    <span className="text-xs">{content.logo.styles.height}</span>
                  </div>

                  {/* Width */}
                  <div>
                    <h3 className="font-medium mb-3">Width</h3>
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={parseInt(content.logo.styles.width)}
                      onChange={(e) =>
                        updateStyles('logo', {
                          ...content.logo.styles,
                          width: `${e.target.value}px`,
                        })
                      }
                      className="w-full"
                    />
                    <span className="text-xs">{content.logo.styles.width}</span>
                  </div>

                </>
              )}

              {/* Repeat for description1 and description2 */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


