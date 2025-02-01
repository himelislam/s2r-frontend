import React, { useEffect, useState } from "react"
import { Monitor, Tablet, Smartphone, PenSquare, Wrench, Share2, ChevronLeft, ChevronRight, Plus, Trash2, Mail, QrCode, CalendarIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

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
    setContent,
    addFormField,
    updateFormField,
    deleteFormField
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

  useEffect(() => {
    getCampaignStateMutation.mutate({
      campaignId: campaign?._id
    })
  }, [])

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
                      {/* <img
                        src="https://dcdko16buub2z.cloudfront.net/images/XrwbjBN0860gkf4G.gif"
                        alt=""
                        className="w-full p-2"
                      /> */}
                    </div>

                    {/* Rest of your form */}
                    <Card className="mx-auto max-w-md cursor-pointer">
                      <CardContent>
                        <form>
                          <div className="grid gap-4 mt-4" onClick={() => setSelectedElement('form')}>
                            {content?.form?.fields?.map((field) => (
                              <div key={field.id} className="grid gap-2">
                                <Label htmlFor={field.id} style={field.styles}>
                                  {field.label}
                                </Label>
                                <Input
                                  id={field.id}
                                  type={field.type}
                                  placeholder={field.placeholder}
                                  required={field.required}
                                  style={field.styles}
                                />
                              </div>
                            ))}
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
          <div className="w-96 border-l bg-background p-4">
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
                // <>
                //   <h3 className="font-medium mb-3">Logo Styles</h3>
                //   {/* Background Color Picker */}
                //   <div>
                //     <h3 className="font-medium mb-3">Background Color</h3>
                //     <input
                //       type="color"
                //       value={content.logo.styles.backgroundColor}
                //       onChange={(e) =>
                //         updateStyles('logo', {
                //           ...content.logo.styles,
                //           backgroundColor: e.target.value,
                //         })
                //       }
                //       className="w-full"
                //     />
                //   </div>

                //   {/* Font Size Slider */}
                //   <div>
                //     <h3 className="font-medium mb-3">Font Size</h3>
                //     <input
                //       type="range"
                //       min="12"
                //       max="32"
                //       value={parseInt(content.logo.styles.fontSize)}
                //       onChange={(e) =>
                //         updateStyles('logo', {
                //           ...content.logo.styles,
                //           fontSize: `${e.target.value}px`,
                //         })
                //       }
                //       className="w-full"
                //     />
                //     <span className="text-xs">{content.logo.styles.fontSize}</span>
                //   </div>

                //   {/* Font Family Selector */}
                //   <div>
                //     <h3 className="font-medium mb-3">Font Family</h3>
                //     <select
                //       value={content.logo.styles.fontFamily}
                //       onChange={(e) =>
                //         updateStyles('logo', {
                //           ...content.logo.styles,
                //           fontFamily: e.target.value,
                //         })
                //       }
                //       className="w-full p-2 border rounded"
                //     >
                //       <option value="Arial, sans-serif">Arial</option>
                //       <option value="Times New Roman, serif">Times New Roman</option>
                //       <option value="Courier New, monospace">Courier New</option>
                //       <option value="Georgia, serif">Georgia</option>
                //     </select>
                //   </div>

                //   {/* Text Color Picker */}
                //   <div>
                //     <h3 className="font-medium mb-3">Text Color</h3>
                //     <input
                //       type="color"
                //       value={content.logo.styles.color}
                //       onChange={(e) =>
                //         updateStyles('logo', {
                //           ...content.logo.styles,
                //           color: e.target.value,
                //         })
                //       }
                //       className="w-full"
                //     />
                //   </div>

                //   {/* Padding Slider */}
                //   <div>
                //     <h3 className="font-medium mb-3">Padding</h3>
                //     <input
                //       type="range"
                //       min="0"
                //       max="32"
                //       value={parseInt(content.logo.styles.padding)}
                //       onChange={(e) =>
                //         updateStyles('logo', {
                //           ...content.logo.styles,
                //           padding: `${e.target.value}px`,
                //         })
                //       }
                //       className="w-full"
                //     />
                //     <span className="text-xs">{content.logo.styles.padding}</span>
                //   </div>

                //   {/* Border Radius Slider */}
                //   <div>
                //     <h3 className="font-medium mb-3">Border Radius</h3>
                //     <input
                //       type="range"
                //       min="0"
                //       max="32"
                //       value={parseInt(content.logo.styles.borderRadius)}
                //       onChange={(e) =>
                //         updateStyles('logo', {
                //           ...content.logo.styles,
                //           borderRadius: `${e.target.value}px`,
                //         })
                //       }
                //       className="w-full"
                //     />
                //     <span className="text-xs">{content.logo.styles.borderRadius}</span>
                //   </div>

                //   {/* Logo */}
                //   <div>
                //     <h3 className="font-medium mb-3">Logo</h3>
                //     <input
                //       type="file"
                //       accept="image/*"
                //       onChange={handleImageUpload}
                //       // value={parseInt(content.logo.styles.borderRadius)}
                //       // onChange={(e) =>
                //       //   updateStyles('logo', {
                //       //     ...content.logo.styles,
                //       //     borderRadius: `${e.target.value}px`,
                //       //   })
                //       // }
                //       className="w-full"
                //     />
                //     {/* Display Uploaded Image */}
                //     {uploadedImage && (
                //       <div className="mb-4">
                //         <img
                //           src={uploadedImage}
                //           alt="Uploaded Logo"
                //           style={{ borderRadius: content.logo.styles.borderRadius }}
                //           className="w-32 h-32 object-cover border border-gray-200"
                //         />
                //       </div>
                //     )}
                //     {/* <span className="text-xs">{content.logo.styles.borderRadius}</span> */}
                //   </div>

                //   {/* Height */}
                //   <div>
                //     <h3 className="font-medium mb-3">Height</h3>
                //     <input
                //       type="range"
                //       min="0"
                //       max="300"
                //       value={parseInt(content.logo.styles.height)}
                //       onChange={(e) =>
                //         updateStyles('logo', {
                //           ...content.logo.styles,
                //           height: `${e.target.value}px`,
                //         })
                //       }
                //       className="w-full"
                //     />
                //     <span className="text-xs">{content.logo.styles.height}</span>
                //   </div>

                //   {/* Width */}
                //   <div>
                //     <h3 className="font-medium mb-3">Width</h3>
                //     <input
                //       type="range"
                //       min="0"
                //       max="300"
                //       value={parseInt(content.logo.styles.width)}
                //       onChange={(e) =>
                //         updateStyles('logo', {
                //           ...content.logo.styles,
                //           width: `${e.target.value}px`,
                //         })
                //       }
                //       className="w-full"
                //     />
                //     <span className="text-xs">{content.logo.styles.width}</span>
                //   </div>

                // </>

                <Card className="w-full max-w-3xl mx-auto">
                  <CardHeader>
                    <CardTitle>Logo Styles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="colors" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="colors">Colors</TabsTrigger>
                        <TabsTrigger value="typography">Typography</TabsTrigger>
                        <TabsTrigger value="layout">Layout</TabsTrigger>
                        <TabsTrigger value="logo">Logo</TabsTrigger>
                      </TabsList>
                      <TabsContent value="colors" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="backgroundColor">Background Color</Label>
                          <div className="flex space-x-2">
                            <Input
                              id="backgroundColor"
                              type="color"
                              value={content.logo.styles.backgroundColor}
                              onChange={(e) => updateStyles("backgroundColor", e.target.value)}
                              className="w-12 h-12 p-1 rounded"
                            />
                            <Input
                              value={content.logo.styles.backgroundColor}
                              onChange={(e) => updateStyles("backgroundColor", e.target.value)}
                              placeholder="#ffffff"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="color">Text Color</Label>
                          <div className="flex space-x-2">
                            <Input
                              id="color"
                              type="color"
                              value={content.logo.styles.color}
                              onChange={(e) => updateStyles("color", e.target.value)}
                              className="w-12 h-12 p-1 rounded"
                            />
                            <Input
                              value={content.logo.styles.color}
                              onChange={(e) => updateStyles("color", e.target.value)}
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="typography" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="fontSize">Font Size: {content.logo.styles.fontSize}</Label>
                          <Slider
                            id="fontSize"
                            min={12}
                            max={32}
                            step={1}
                            value={[Number.parseInt(content.logo.styles.fontSize)]}
                            onValueChange={(value) => updateStyles("fontSize", `${value[0]}px`)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fontFamily">Font Family</Label>
                          <Select
                            value={content.logo.styles.fontFamily}
                            onValueChange={(value) => updateStyles("fontFamily", value)}
                          >
                            <SelectTrigger id="fontFamily">
                              <SelectValue placeholder="Select a font" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                              <SelectItem value="Times New Roman, serif">Times New Roman</SelectItem>
                              <SelectItem value="Courier New, monospace">Courier New</SelectItem>
                              <SelectItem value="Georgia, serif">Georgia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TabsContent>
                      <TabsContent value="layout" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="padding">Padding: {content.logo.styles.padding}</Label>
                          <Slider
                            id="padding"
                            min={0}
                            max={32}
                            step={1}
                            value={[Number.parseInt(content.logo.styles.padding)]}
                            onValueChange={(value) => updateStyles("padding", `${value[0]}px`)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="borderRadius">Border Radius: {content.logo.styles.borderRadius}</Label>
                          <Slider
                            id="borderRadius"
                            min={0}
                            max={32}
                            step={1}
                            value={[Number.parseInt(content.logo.styles.borderRadius)]}
                            onValueChange={(value) => updateStyles("borderRadius", `${value[0]}px`)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="height">Height: {content.logo.styles.height}</Label>
                          <Slider
                            id="height"
                            min={0}
                            max={300}
                            step={1}
                            value={[Number.parseInt(content.logo.styles.height)]}
                            onValueChange={(value) => updateStyles("height", `${value[0]}px`)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="width">Width: {content.logo.styles.width}</Label>
                          <Slider
                            id="width"
                            min={0}
                            max={300}
                            step={1}
                            value={[Number.parseInt(content.logo.styles.width)]}
                            onValueChange={(value) => updateStyles("width", `${value[0]}px`)}
                          />
                        </div>
                      </TabsContent>
                      <TabsContent value="logo" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="logoUpload">Upload Logo</Label>
                          <Input id="logoUpload" type="file" accept="image/*" onChange={handleImageUpload} />
                        </div>
                        {uploadedImage && (
                          <div className="mt-4">
                            <img
                              src={uploadedImage || "/placeholder.svg"}
                              alt="Uploaded Logo"
                              style={{
                                borderRadius: content.logo.styles.borderRadius,
                                height: content.logo.styles.height,
                                width: content.logo.styles.width,
                                backgroundColor: content.logo.styles.backgroundColor,
                                padding: content.logo.styles.padding,
                              }}
                              className="object-cover border border-gray-200"
                            />
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {selectedElement === 'form' && (
                // <>
                //   <h3 className="font-medium mb-3">Form Fields</h3>
                //   <Button
                //     variant="outline"
                //     className="w-full mb-4"
                //     onClick={() =>
                //       addFormField({
                //         id: `field-${content.form.fields.length + 1}`,
                //         type: 'text',
                //         label: 'New Field',
                //         placeholder: '',
                //         required: false,
                //         styles: {
                //           fontSize: '16px',
                //           color: '#000000',
                //           padding: '8px',
                //           borderRadius: '4px',
                //         },
                //       })
                //     }
                //   >
                //     Add Field
                //   </Button>

                //   {content.form.fields.map((field) => (
                //     <div key={field.id} className="mb-4">
                //       <div className="flex justify-between items-center mb-2">
                //         <h4 className="font-medium">{field.label}</h4>
                //         <Button
                //           variant="destructive"
                //           size="sm"
                //           onClick={() => deleteFormField(field.id)}
                //         >
                //           <Trash2 className="h-4 w-4" /> {/* Use an icon if desired */}
                //         </Button>
                //       </div>
                //       <select
                //         value={field.type}
                //         onChange={(e) =>
                //           updateFormField(field.id, {
                //             ...field,
                //             type: e.target.value,
                //           })
                //         }
                //         className="w-full p-2 border rounded mb-2"
                //       >
                //         <option value="text">Text</option>
                //         <option value="email">Email</option>
                //         <option value="number">Number</option>
                //         <option value="date">Date</option>
                //       </select>

                //       <input
                //         type="text"
                //         value={field.label}
                //         onChange={(e) =>
                //           updateFormField(field.id, {
                //             ...field,
                //             label: e.target.value,
                //           })
                //         }
                //         className="w-full p-2 border rounded mb-2"
                //         placeholder="Label"
                //       />

                //       <input
                //         type="text"
                //         value={field.placeholder}
                //         onChange={(e) =>
                //           updateFormField(field.id, {
                //             ...field,
                //             placeholder: e.target.value,
                //           })
                //         }
                //         className="w-full p-2 border rounded mb-2"
                //         placeholder="Placeholder"
                //       />

                //       <label className="flex items-center space-x-2 mb-2">
                //         <input
                //           type="checkbox"
                //           checked={field.required}
                //           onChange={(e) =>
                //             updateFormField(field.id, {
                //               ...field,
                //               required: e.target.checked,
                //             })
                //           }
                //         />
                //         <span>Required</span>
                //       </label>

                //       <h4 className="font-medium mb-2">Field Styles</h4>
                //       <input
                //         type="color"
                //         value={field.styles.color}
                //         onChange={(e) =>
                //           updateFormField(field.id, {
                //             ...field,
                //             styles: {
                //               ...field.styles,
                //               color: e.target.value,
                //             },
                //           })
                //         }
                //         className="w-full mb-2"
                //       />
                //     </div>
                //   ))}
                // </>

                <Card className="w-full max-w-3xl mx-auto">
                  <CardHeader>
                    <CardTitle>Form Fields</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full mb-6" onClick={addFormField}>
                      <Plus className="mr-2 h-4 w-4" /> Add Field
                    </Button>

                    <Accordion type="single" collapsible className="w-full">
                      {content.form.fields.map((field, index) => (
                        <AccordionItem key={field.id} value={field.id}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex justify-between items-center w-full">
                              <span>{field.label || `Field ${index + 1}`}</span>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteFormField(field.id)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor={`${field.id}-type`}>Field Type</Label>
                                <Select
                                  value={field.type}
                                  onValueChange={(value) => updateFormField(field.id, { ...field, type: value })}
                                >
                                  <SelectTrigger id={`${field.id}-type`}>
                                    <SelectValue placeholder="Select field type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="number">Number</SelectItem>
                                    <SelectItem value="date">Date</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`${field.id}-label`}>Label</Label>
                                <Input
                                  id={`${field.id}-label`}
                                  value={field.label}
                                  onChange={(e) => updateFormField(field.id, { ...field, label: e.target.value })}
                                  placeholder="Enter field label"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`${field.id}-placeholder`}>Placeholder</Label>
                                <Input
                                  id={`${field.id}-placeholder`}
                                  value={field.placeholder}
                                  onChange={(e) => updateFormField(field.id, { ...field, placeholder: e.target.value })}
                                  placeholder="Enter field placeholder"
                                />
                              </div>

                              <div className="flex items-center space-x-2">
                                <Switch
                                  id={`${field.id}-required`}
                                  checked={field.required}
                                  onCheckedChange={(checked) => updateFormField(field.id, { ...field, required: checked })}
                                />
                                <Label htmlFor={`${field.id}-required`}>Required</Label>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`${field.id}-color`}>Text Color</Label>
                                <div className="flex space-x-2">
                                  <Input
                                    id={`${field.id}-color`}
                                    type="color"
                                    value={field.styles.color}
                                    onChange={(e) =>
                                      updateFormField(field.id, {
                                        ...field,
                                        styles: { ...field.styles, color: e.target.value },
                                      })
                                    }
                                    className="w-12 h-12 p-1 rounded"
                                  />
                                  <Input
                                    value={field.styles.color}
                                    onChange={(e) =>
                                      updateFormField(field.id, {
                                        ...field,
                                        styles: { ...field.styles, color: e.target.value },
                                      })
                                    }
                                    placeholder="#000000"
                                    className="flex-grow"
                                  />
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              )}

              {/* Repeat for description1 and description2 */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


