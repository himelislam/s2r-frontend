import React, { useEffect, useState } from "react"
import { Monitor, Tablet, Smartphone, PenSquare, Wrench, Share2, ChevronLeft, ChevronRight, Plus, Trash2, Mail, QrCode, CalendarIcon, Save, ScanEye } from 'lucide-react'
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
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import EditableText from "./editable-text"
import useEditableContent from "@/hooks/useEditableContent"
import campaignApi from "@/api/campaignApi"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Loader } from "../../../loader"

const steps = [
  "Campaign",
  "Settings",
  "Email",
  "Promotes"
]

export default function CampaignBuilder() {
  const [currentStep, setCurrentStep] = useState(0)
  const [deviceView, setDeviceView] = useState("desktop")
  const [personReferringStep, setPersonReferringStep] = useState(1)
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const { state } = useLocation();
  const [campaign, setCampaign] = useState(null);
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

  const getCampaignbyIdMutation = useMutation({
    mutationFn: campaignApi.getCampaignById,
    onSuccess: (data) => {
      const dd = JSON.parse(data.refereeJSON)
      setContent(dd);
      setCampaign(data)
    },
    onError: (err) => {
      console.log(err, "get Err");
    }
  })


  useEffect(() => {
    getCampaignbyIdMutation.mutate({
      campaignId: campaignId
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
    updateCampaignStateMutation.mutate({
      state: JSON.stringify(content),
      // campaignId: campaign._id
      campaignId: campaignId
    })
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

  if (getCampaignbyIdMutation.isPending) {
    return <Loader />
  }

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <h1 className="text-xl font-bold mb-2">{campaign?.campaignName}</h1>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div
              className="text-sm text-orange-500 font-medium cursor-pointer hover:underline"
              onClick={() => navigate(`/b/dashboard/campaign-portal/builder/${campaignId}`)}
            >
              Campaign
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />

            <div
              className="text-sm text-muted-foreground font-medium cursor-pointer hover:underline"
              onClick={() => navigate(`/b/dashboard/campaign-portal/reward/${campaignId}`)}
            >
              Reward
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />

            <div
              className="text-sm text-muted-foreground cursor-pointer hover:underline"
              onClick={() => navigate(`/b/dashboard/campaign-portal/settings/${campaignId}`)}
            >
              Settings
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />

            <div
              className="text-sm text-muted-foreground cursor-pointer hover:underline"
              onClick={() => navigate(`/b/dashboard/campaign-portal/email-builder/${campaignId}`)}
            >
              Email
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />

            <div
              className="text-sm text-muted-foreground cursor-pointer hover:underline"
              onClick={() => navigate(`/b/dashboard/campaign-portal/integration/${campaignId}`)}
            >
              Integration
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />

            <div
              className="text-sm text-muted-foreground cursor-pointer hover:underline"
              onClick={() => navigate(`/b/dashboard/campaign-portal/promotes/${campaignId}`)}
            >
              Promotes
            </div>
          </div>
        </div>



        {/* campaign builder renderPersonReferringStep(); */}
        <div>
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
              <Button variant="outline" onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" className="gap-2">
                <ScanEye className="h-4 w-4" />
                Preview
              </Button>
            </div>
          </div>


          {/* Main Editor Area */}
          <div className="flex-1 flex">
            <div className="flex-1 p-8">
              <div className="max-w-2xl mx-auto">

                <div>
                  <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                    <div className="items-center mb-4">
                      {/* Editable Image */}
                      <img
                        src={content.logo.content}
                        style={content.logo.styles}
                        alt=""
                        className="w-40 h-40 mx-auto cursor-pointer hover:border-2 hover:border-dashed hover:border-blue-500 transition duration-200 ease-in-out"
                        onClick={() => setSelectedElement('logo')}
                      />

                      {/* Editable Header */}
                      <EditableText
                        value={content.header.content}
                        onChange={(value) => updateContent('header', value)}
                        className="text-center text-xl hover:border-2 hover:border-dashed hover:border-blue-500 transition duration-200 ease-in-out cursor-pointer"
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
                      className="text-md text-gray-800 dark:text-gray-200 mb-4 text-center hover:border-2 hover:border-dashed hover:border-blue-500 transition duration-200 ease-in-out cursor-pointer"
                      styles={content.description1.styles}
                      elementName="description1"
                      setSelectedElement={setSelectedElement}
                      renderContent={renderContent}
                    />

                    {/* Editable Description 2 */}
                    <EditableText
                      value={content.description2.content}
                      onChange={(value) => updateContent('description2', value)}
                      className="text-md text-gray-800 dark:text-gray-200 mb-4 text-center hover:border-2 hover:border-dashed hover:border-blue-500 transition duration-200 ease-in-out cursor-pointer"
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
                    <Card className="mx-auto max-w-md cursor-pointer hover:border-2 hover:border-dashed hover:border-blue-500 transition duration-200 ease-in-out">
                      <CardContent>
                        <form disabled>
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
                                  disabled
                                />
                              </div>
                            ))}
                            <Button type="submit" className="w-full" disabled>
                              Submit
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* <div className="flex justify-between">
                  <Button variant="outline" onClick={handleSave}>
                    Save
                  </Button>
                  <Button variant="outline">Preview</Button>
                </div> */}
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
                        className="w-full cursor-pointer"
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

                {selectedElement === 'form' && (
                  <>
                    <h3 className="font-medium mb-3">Form Fields</h3>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <Button
                        variant="outline"
                        onClick={() => addFormField('phone')}
                        disabled={content.form.fields.some(f => f.id === 'phone')}
                      >
                        Add Phone
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => addFormField('date')}
                        disabled={content.form.fields.some(f => f.id === 'date')}
                      >
                        Add Date
                      </Button>
                    </div>

                    {content.form.fields.map((field) => (
                      <div key={field.id} className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{field.label}</h4>
                          {!['name', 'email'].includes(field.id) && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteFormField(field.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) =>
                            updateFormField(field.id, {
                              ...field,
                              label: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded mb-2"
                          placeholder="Label"
                        />

                        <input
                          type="text"
                          value={field.placeholder}
                          onChange={(e) =>
                            updateFormField(field.id, {
                              ...field,
                              placeholder: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded mb-2"
                          placeholder="Placeholder"
                        />

                        <label className="flex items-center space-x-2 mb-2">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) =>
                              updateFormField(field.id, {
                                ...field,
                                required: e.target.checked,
                              })
                            }
                          />
                          <span>Required</span>
                        </label>

                        <h4 className="font-medium mb-2">Field Styles</h4>
                        <input
                          type="color"
                          value={field.styles.color}
                          onChange={(e) =>
                            updateFormField(field.id, {
                              ...field,
                              styles: {
                                ...field.styles,
                                color: e.target.value,
                              },
                            })
                          }
                          className="w-full mb-2"
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={() => navigate('/b/dashboard/campaign-portal')} variant="outline">Back</Button>
          <Button onClick={() => navigate(`/b/dashboard/campaign-portal/reward/${campaignId}`)} className="bg-amber-500 hover:bg-amber-600">Next</Button>
        </div>
      </div>

    </div>
  )
}


