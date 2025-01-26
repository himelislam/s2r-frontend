import React, { useState } from "react"
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
  const { campaign } = useLocation().state;

  const referralLink = "https://ministry.referral-factory.com/cLILwj4l"

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
  }

  const referrerName = 'Hiii'
  const businessName = "Luke"
  const [selectedElement, setSelectedElement] = useState(null);

   // Use the custom hook to manage state
   const {
    headerContent,
    setHeaderContent,
    description1,
    setDescription1,
    description2,
    setDescription2,
    headerStyles,
    setHeaderStyles,
    description1Styles,
    setDescription1Styles,
    description2Styles,
    setDescription2Styles,
  } = useEditableContent();

  // Function to replace placeholders with dynamic values
  const renderContent = (content) => {
    return content
      .replace(/{{referrerName}}/g, referrerName)
      .replace(/{{businessName}}/g, businessName);
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
                      <img
                        src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg"
                        alt=""
                        className="w-40 h-40 mx-auto"
                      />

                      {/* Editable Header */}
                      <EditableText
                        value={headerContent}
                        onChange={setHeaderContent}
                        renderContent={renderContent}
                        className="uppercase text-center text-xl"
                        styles={headerStyles}
                        elementName="header"
                        setSelectedElement={setSelectedElement}
                      />
                    </div>

                    {/* Editable Description 1 */}
                    <EditableText
                      value={description1}
                      onChange={setDescription1}
                      renderContent={renderContent}
                      className="text-md text-gray-800 dark:text-gray-200 mb-4 text-center"
                      styles={description1Styles}
                      elementName="description1"
                      setSelectedElement={setSelectedElement}
                    />

                    {/* Editable Description 2 */}
                    <EditableText
                      value={description2}
                      onChange={setDescription2}
                      renderContent={renderContent}
                      className="text-md text-gray-800 dark:text-gray-200 mb-4 text-center"
                      styles={description2Styles}
                      elementName="description2"
                      setSelectedElement={setSelectedElement}
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
                <Card className="mb-4">
                  <CardContent className="p-6">
                    <h1 className="text-2xl font-bold text-center mb-4">
                      Refer Friends {formData.firstName ? `(${formData.firstName})` : ''}
                    </h1>
                    <p className="text-center text-muted-foreground mb-6">
                      Refer friends and earn rewards. All you need to do is share your referral link with friends, and if they become a customer of ours we'll reward you!
                    </p>
                    <div className="space-y-6">
                      <div className="text-center">
                        <h2 className="text-xl font-semibold mb-4">Share Your Unique Link 👆</h2>
                        <div className="flex justify-center space-x-2 mb-6">
                          <Button variant="outline" size="icon">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                            </svg>
                          </Button>
                          <Button variant="outline" size="icon">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                            </svg>
                          </Button>
                          <Button variant="outline" size="icon">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3.445 17.827c-.235.077-.484.148-.742.211-.998.241-2.057.383-3.137.383-1.081 0-2.139-.142-3.137-.383-.258-.063-.507-.134-.742-.211-.819-.275-1.318-.614-1.318-.614 0-.046-.001-.092-.001-.139 0-3.344 2.707-6.051 6.051-6.051s6.051 2.707 6.051 6.051c0 .047-.001.093-.001.139 0 0-.499.339-1.318.614z" />
                            </svg>
                          </Button>
                          <Button variant="outline" size="icon">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                          </Button>
                        </div>
                        <div className="relative">
                          <Input
                            value={referralLink}
                            readOnly
                            className="pr-24"
                          />
                          <Button
                            className="absolute right-1 top-1 h-7"
                            onClick={handleCopyLink}
                          >
                            Copy Link
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-between">
                <Button variant="outline">Save</Button>
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
                      value={headerStyles.backgroundColor}
                      onChange={(e) => setHeaderStyles({ ...headerStyles, backgroundColor: e.target.value })}
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
                      value={parseInt(headerStyles.fontSize)}
                      onChange={(e) => setHeaderStyles({ ...headerStyles, fontSize: `${e.target.value}px` })}
                      className="w-full"
                    />
                    <span className="text-xs">{headerStyles.fontSize}</span>
                  </div>

                  {/* Font Family Selector */}
                  <div>
                    <h3 className="font-medium mb-3">Font Family</h3>
                    <select
                      value={headerStyles.fontFamily}
                      onChange={(e) => setHeaderStyles({ ...headerStyles, fontFamily: e.target.value })}
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
                      value={headerStyles.color}
                      onChange={(e) => setHeaderStyles({ ...headerStyles, color: e.target.value })}
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
                      value={parseInt(headerStyles.padding)}
                      onChange={(e) => setHeaderStyles({ ...headerStyles, padding: `${e.target.value}px` })}
                      className="w-full"
                    />
                    <span className="text-xs">{headerStyles.padding}</span>
                  </div>

                  {/* Border Radius Slider */}
                  <div>
                    <h3 className="font-medium mb-3">Border Radius</h3>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={parseInt(headerStyles.borderRadius)}
                      onChange={(e) => setHeaderStyles({ ...headerStyles, borderRadius: `${e.target.value}px` })}
                      className="w-full"
                    />
                    <span className="text-xs">{headerStyles.borderRadius}</span>
                  </div>
                </>
              )}

              {selectedElement === 'description1' && (
                <>
                  <h3 className="font-medium mb-3">Description 1 Styles</h3>
                  {/* Background Color Picker */}
                  <div>
                    <h3 className="font-medium mb-3">Background Color</h3>
                    <input
                      type="color"
                      value={description1Styles.backgroundColor}
                      onChange={(e) => setDescription1Styles({ ...description1Styles, backgroundColor: e.target.value })}
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
                      value={parseInt(description1Styles.fontSize)}
                      onChange={(e) => setDescription1Styles({ ...description1Styles, fontSize: `${e.target.value}px` })}
                      className="w-full"
                    />
                    <span className="text-xs">{description1Styles.fontSize}</span>
                  </div>

                  {/* Font Family Selector */}
                  <div>
                    <h3 className="font-medium mb-3">Font Family</h3>
                    <select
                      value={description1Styles.fontFamily}
                      onChange={(e) => setDescription1Styles({ ...description1Styles, fontFamily: e.target.value })}
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
                      value={description1Styles.color}
                      onChange={(e) => setDescription1Styles({ ...description1Styles, color: e.target.value })}
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
                      value={parseInt(description1Styles.padding)}
                      onChange={(e) => setDescription1Styles({ ...description1Styles, padding: `${e.target.value}px` })}
                      className="w-full"
                    />
                    <span className="text-xs">{description1Styles.padding}</span>
                  </div>

                  {/* Border Radius Slider */}
                  <div>
                    <h3 className="font-medium mb-3">Border Radius</h3>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={parseInt(description1Styles.borderRadius)}
                      onChange={(e) => setDescription1Styles({ ...description1Styles, borderRadius: `${e.target.value}px` })}
                      className="w-full"
                    />
                    <span className="text-xs">{description1Styles.borderRadius}</span>
                  </div>
                </>
              )}

              {selectedElement === 'description2' && (
                <>
                  <h3 className="font-medium mb-3">Description 2 Styles</h3>
                  {/* Background Color Picker */}
                  <div>
                    <h3 className="font-medium mb-3">Background Color</h3>
                    <input
                      type="color"
                      value={description2Styles.backgroundColor}
                      onChange={(e) => setDescription2Styles({ ...description2Styles, backgroundColor: e.target.value })}
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
                      value={parseInt(description2Styles.fontSize)}
                      onChange={(e) => setDescription2Styles({ ...description2Styles, fontSize: `${e.target.value}px` })}
                      className="w-full"
                    />
                    <span className="text-xs">{description2Styles.fontSize}</span>
                  </div>

                  {/* Font Family Selector */}
                  <div>
                    <h3 className="font-medium mb-3">Font Family</h3>
                    <select
                      value={description2Styles.fontFamily}
                      onChange={(e) => setDescription2Styles({ ...description2Styles, fontFamily: e.target.value })}
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
                      value={description2Styles.color}
                      onChange={(e) => setDescription2Styles({ ...description2Styles, color: e.target.value })}
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
                      value={parseInt(description2Styles.padding)}
                      onChange={(e) => setDescription2Styles({ ...description2Styles, padding: `${e.target.value}px` })}
                      className="w-full"
                    />
                    <span className="text-xs">{description2Styles.padding}</span>
                  </div>

                  {/* Border Radius Slider */}
                  <div>
                    <h3 className="font-medium mb-3">Border Radius</h3>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={parseInt(description2Styles.borderRadius)}
                      onChange={(e) => setDescription2Styles({ ...description2Styles, borderRadius: `${e.target.value}px` })}
                      className="w-full"
                    />
                    <span className="text-xs">{description2Styles.borderRadius}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


