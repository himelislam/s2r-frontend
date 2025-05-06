import React, { useEffect, useState } from "react";
import { Monitor, Tablet, Smartphone, ChevronLeft, ChevronRight, Save, ScanEye, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate, useParams } from "react-router-dom";
import EditableText from "./editable-text";
import useEditableContent from "@/hooks/useEditableContent";
import campaignApi from "@/api/campaignApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Loader } from "../../../loader";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const builderSteps = [
  "Campaign Page",
  "Thank You Page"
];

export default function CampaignBuilder() {
  const [deviceView, setDeviceView] = useState("desktop");
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState(null);
  const referrerName = 'Referrer';
  const businessName = "Business";
  const [selectedElement, setSelectedElement] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    content,
    currentStep,
    setCurrentStep,
    updateContent,
    updateStyles,
    updateBackground,
    updateBackgroundStyles,
    setContent,
    addFormField,
    updateFormField,
    deleteFormField
  } = useEditableContent();

  const getCampaignbyIdMutation = useMutation({
    mutationFn: campaignApi.getCampaignById,
    onSuccess: (data) => {
      const parsedData = JSON.parse(data.refereeJSON);
      setContent(parsedData);
      setCampaign(data);
    },
    onError: (err) => {
      console.log(err, "get Err");
    }
  });

  useEffect(() => {
    getCampaignbyIdMutation.mutate({
      campaignId: campaignId
    });
  }, []);

  const updateCampaignStateMutation = useMutation({
    mutationFn: campaignApi.updateCampaignState,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (err) => {
      console.log(err, "err");
    }
  });

  const handleSave = () => {
    updateCampaignStateMutation.mutate({
      state: JSON.stringify(content),
      campaignId: campaignId
    });
  };

  const renderContent = (content) => {
    return content
      .replace(/{{referrerName}}/g, referrerName)
      .replace(/{{businessName}}/g, businessName);
  };

  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedBackground, setUploadedBackground] = useState(null);
  const [uploadedThankYouBackground, setUploadedThankYouBackground] = useState(null);

  const uploadImageMutation = useMutation({
    mutationFn: campaignApi.uploadImage,
    onSuccess: (data) => {
      return data.url;
    },
    onError: (err) => {
      toast.error('Unable to upload image.');
      throw err;
    }
  });

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        const { url } = await uploadImageMutation.mutateAsync(formData);

        if (type === 'logo') {
          setUploadedImage(url);
          updateContent('logo', url);
          console.log(url, "url")
          toast.success('Logo uploaded successfully');
        } else if (type === 'background') {
          setUploadedBackground(url);
          updateBackground('background', 'image', url);
          toast.success('Background image uploaded successfully');
        } else if (type === 'thankYouBackground') {
          setUploadedThankYouBackground(url);
          updateBackground('thankYouPage', 'image', url);
          toast.success('Thank You page background uploaded successfully');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getDeviceWidth = () => {
    switch (deviceView) {
      case "desktop": return "100%";
      case "tablet": return "768px";
      case "mobile": return "375px";
      default: return "100%";
    }
  };

  const handleElementClick = (elementName) => {
    setSelectedElement(elementName);
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setSelectedElement(null);
  };

  const getBackgroundStyle = (page) => {
    const bg = content[page]?.background || content.background;
    const viewportStyles = bg?.styles?.[deviceView] || {};

    return {
      backgroundColor: bg?.color,
      backgroundImage: bg?.image ? `url(${bg.image})` : 'none',
      backgroundRepeat: bg?.repeat,
      backgroundSize: bg?.size,
      backgroundPosition: bg?.position,
      ...viewportStyles
    };
  };

  if (getCampaignbyIdMutation.isPending) {
    return <Loader />;
  }

  const renderMainContent = () => (
    <div className="relative h-full w-full">
      {/* Clickable background overlay */}
      {/* <div
        className="absolute inset-0 cursor-pointer border-2 border-transparent hover:border-dashed hover:border-primary"
        onClick={() => handleElementClick('background')}
        style={getBackgroundStyle('background')}
      /> */}

      {/* Clickable background element */}
      {/* <div
        className="absolute inset-0 cursor-pointer border-2 border-transparent hover:border-dashed hover:border-primary"
        style={{
          ...getBackgroundStyle('background'),
          border: selectedElement === 'background' ? '2px dashed #3b82f6' : '2px solid transparent'
        }}
        onClick={() => {
          handleElementClick('background');
        }}
      > */}


      <div className="relative p-6 w-full flex flex-col items-center">
        <div className="items-center mb-4 w-full">
          <img
            src={content.logo.content}
            style={content.logo.styles[deviceView]}
            alt=""
            className="cursor-pointer hover:border-2 hover:border-dashed hover:border-primary transition duration-200 ease-in-out"
            onClick={() => handleElementClick('logo')}
          />

          <EditableText
            value={content.header.content}
            onChange={(value) => updateContent('header', value)}
            className="hover:border-2 hover:border-dashed hover:border-primary transition duration-200 ease-in-out cursor-pointer"
            styles={content.header.styles}
            elementName="header"
            setSelectedElement={handleElementClick}
            renderContent={renderContent}
            deviceView={deviceView}
          />
        </div>

        <EditableText
          value={content.description1.content}
          onChange={(value) => updateContent('description1', value)}
          className="text-gray-800 dark:text-gray-200 mb-4 hover:border-2 hover:border-dashed hover:border-primary transition duration-200 ease-in-out cursor-pointer"
          styles={content.description1.styles}
          elementName="description1"
          setSelectedElement={handleElementClick}
          renderContent={renderContent}
          deviceView={deviceView}
        />

        <EditableText
          value={content.description2.content}
          onChange={(value) => updateContent('description2', value)}
          className="text-gray-800 dark:text-gray-200 mb-4 hover:border-2 hover:border-dashed hover:border-primary transition duration-200 ease-in-out cursor-pointer"
          styles={content.description2.styles}
          elementName="description2"
          setSelectedElement={handleElementClick}
          renderContent={renderContent}
          deviceView={deviceView}
        />

        <Card
          className="w-full max-w-[500px] cursor-pointer hover:border-2 hover:border-dashed hover:border-primary transition duration-200 ease-in-out"
          onClick={() => handleElementClick('form')}
        >
          <CardContent>
            <form disabled>
              <div className="grid gap-4 mt-4">
                {content?.form?.fields?.map((field) => (
                  <div key={field.id} className="grid gap-2">
                    <Label htmlFor={field.id} style={field.styles[deviceView]}>
                      {field.label}
                    </Label>
                    <Input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      required={field.required}
                      style={field.styles[deviceView]}
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

      {/* </div> */}


    </div>
  );

  const renderThankYouPage = () => (
    <div className="relative h-full w-full">
      {/* Clickable background overlay */}
      {/* <div 
        className="absolute inset-0 cursor-pointer border-2 border-transparent hover:border-dashed hover:border-primary"
        onClick={() => handleElementClick('thankYouPageBackground')}
        style={getBackgroundStyle('thankYouPage')}
      /> */}

      {/* Will check later */}

      {/* Clickable background element */}
      {/* <div
        className="absolute inset-0 cursor-pointer border-2 border-transparent hover:border-dashed hover:border-primary"
        style={{
          ...getBackgroundStyle('thankYouPage'),
          border: selectedElement === 'thankYouPageBackground' ? '2px dashed #3b82f6' : '2px solid transparent'
        }}
        onClick={() => {
          handleElementClick('thankYouPageBackground');
        }}
      > */}
      <div className="relative p-6 w-full flex flex-col items-center justify-center h-full">
        <EditableText
          value={content.thankYouPage.content}
          onChange={(value) => updateContent('thankYouPage', value)}
          className="hover:border-2 hover:border-dashed hover:border-primary transition duration-200 ease-in-out cursor-pointer"
          styles={content.thankYouPage.styles}
          elementName="thankYouPage"
          setSelectedElement={handleElementClick}
          renderContent={renderContent}
          deviceView={deviceView}
        />
        <Button
          onClick={() => setCurrentStep(0)}
          className="mt-8"
        >
          Back to Campaign
        </Button>
      </div>


      {/* </div> */}


    </div>
  );

  return (
    <div className="flex h-screen bg-muted/40">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-background border-b ">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold mb-2">{campaign?.campaignName}</h1>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div
                    className="text-sm  text-orange-500 font-medium cursor-pointer hover:underline"
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
                    className="text-sm text-muted-foreground  cursor-pointer hover:underline"
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
              <div className="flex items-center space-x-2 mt-1 mb-4">
                {builderSteps.map((step, index) => (
                  <React.Fragment key={step}>
                    <Badge
                      variant={currentStep === index ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => setCurrentStep(index)}
                    >
                      {step}
                    </Badge>
                    {index < builderSteps.length - 1 && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </React.Fragment>
                ))}
              </div>
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
        </div>

        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={sidebarOpen ? 70 : 100} minSize={50}>
            <div className="h-full flex flex-col">
              <div className="bg-background border-b p-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {builderSteps[currentStep]}
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={deviceView === "desktop" ? "default" : "outline"}
                          size="icon"
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
                          variant={deviceView === "tablet" ? "default" : "outline"}
                          size="icon"
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
                          variant={deviceView === "mobile" ? "default" : "outline"}
                          size="icon"
                          onClick={() => setDeviceView("mobile")}
                        >
                          <Smartphone className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Mobile View</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4 bg-muted/20">
                <div
                  className="mx-auto bg-background rounded-lg shadow-sm border"
                  style={{
                    width: getDeviceWidth(),
                    maxWidth: "100%",
                    transition: "width 0.2s ease",
                    margin: "0 auto",
                    // height: "100%",
                    minHeight: "500px",
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  {currentStep === 0 ? renderMainContent() : renderThankYouPage()}
                </div>
              </div>
            </div>
          </ResizablePanel>

          {sidebarOpen && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={30} minSize={25}>
                <div className="h-full overflow-auto p-4 bg-background border-l relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={closeSidebar}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold">
                      {selectedElement?.charAt(0).toUpperCase() + selectedElement?.slice(1)} Settings
                    </h2>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Viewport</Label>
                      <Select
                        value={deviceView}
                        onValueChange={setDeviceView}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select viewport" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="desktop">Desktop</SelectItem>
                          <SelectItem value="tablet">Tablet</SelectItem>
                          <SelectItem value="mobile">Mobile</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(selectedElement === 'background' || selectedElement === 'thankYouPageBackground') && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Background Type</Label>
                          <Select
                            value={content[selectedElement === 'background' ? 'background' : 'thankYouPage'].background?.image ? 'image' : 'color'}
                            onValueChange={(value) => {
                              const prop = selectedElement === 'background' ? 'background' : 'thankYouPage';
                              if (value === 'color') {
                                updateBackground(prop, 'image', '');
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select background type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="color">Color</SelectItem>
                              <SelectItem value="image">Image</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {!content[selectedElement === 'background' ? 'background' : 'thankYouPage'].background?.image ? (
                          <div className="space-y-2">
                            <Label>Background Color</Label>
                            <Input
                              type="color"
                              value={content[selectedElement === 'background' ? 'background' : 'thankYouPage'].background?.color}
                              onChange={(e) =>
                                updateBackground(
                                  selectedElement === 'background' ? 'background' : 'thankYouPage',
                                  'color',
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        ) : (
                          <>
                            <div className="space-y-2">
                              <Label>Background Image</Label>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(
                                  e,
                                  selectedElement === 'background' ? 'background' : 'thankYouBackground'
                                )}
                                className="cursor-pointer"
                              />
                              {content[selectedElement === 'background' ? 'background' : 'thankYouPage'].background?.image && (
                                <div className="mt-2">
                                  <img
                                    src={content[selectedElement === 'background' ? 'background' : 'thankYouPage'].background?.image}
                                    alt="Background Preview"
                                    className="w-full h-32 object-cover rounded"
                                  />
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label>Background Repeat</Label>
                              <Select
                                value={content[selectedElement === 'background' ? 'background' : 'thankYouPage'].background?.repeat}
                                onValueChange={(value) => updateBackground(
                                  selectedElement === 'background' ? 'background' : 'thankYouPage',
                                  'repeat',
                                  value
                                )}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select repeat style" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="no-repeat">No Repeat</SelectItem>
                                  <SelectItem value="repeat">Repeat</SelectItem>
                                  <SelectItem value="repeat-x">Repeat X</SelectItem>
                                  <SelectItem value="repeat-y">Repeat Y</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Background Size</Label>
                              <Select
                                value={content[selectedElement === 'background' ? 'background' : 'thankYouPage'].background?.size}
                                onValueChange={(value) => updateBackground(
                                  selectedElement === 'background' ? 'background' : 'thankYouPage',
                                  'size',
                                  value
                                )}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cover">Cover</SelectItem>
                                  <SelectItem value="contain">Contain</SelectItem>
                                  <SelectItem value="auto">Auto</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Background Position</Label>
                              <Select
                                value={content[selectedElement === 'background' ? 'background' : 'thankYouPage'].background?.position}
                                onValueChange={(value) => updateBackground(
                                  selectedElement === 'background' ? 'background' : 'thankYouPage',
                                  'position',
                                  value
                                )}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="center">Center</SelectItem>
                                  <SelectItem value="top">Top</SelectItem>
                                  <SelectItem value="bottom">Bottom</SelectItem>
                                  <SelectItem value="left">Left</SelectItem>
                                  <SelectItem value="right">Right</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}

                        <Accordion type="single" collapsible>
                          <AccordionItem value="viewport-styles">
                            <AccordionTrigger>Viewport Specific Styles</AccordionTrigger>
                            <AccordionContent className="space-y-4">
                              <div className="space-y-2">
                                <Label>Opacity</Label>
                                <Slider
                                  min={0}
                                  max={100}
                                  step={1}
                                  value={[parseInt(content[
                                    selectedElement === 'background' ? 'background' : 'thankYouPage'
                                  ].background?.styles?.[deviceView]?.opacity || '100')]}
                                  onValueChange={(value) =>
                                    updateBackgroundStyles(
                                      selectedElement === 'background' ? 'background' : 'thankYouPage',
                                      deviceView,
                                      { opacity: `${value[0]}%` }
                                    )
                                  }
                                />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {['header', 'description1', 'description2', 'thankYouPage'].includes(selectedElement) && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Text Content</Label>
                          <Input
                            value={content[selectedElement].content}
                            onChange={(e) => updateContent(selectedElement, e.target.value)}
                          />
                        </div>

                        <Accordion type="multiple">
                          <AccordionItem value="styles">
                            <AccordionTrigger>Text Styles</AccordionTrigger>
                            <AccordionContent className="space-y-4">
                              <div className="space-y-2">
                                <Label>Text Color</Label>
                                <Input
                                  type="color"
                                  value={content[selectedElement].styles[deviceView].color || '#000000'}
                                  onChange={(e) =>
                                    updateStyles(selectedElement, deviceView, {
                                      color: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Font Size</Label>
                                <Slider
                                  min={12}
                                  max={48}
                                  step={1}
                                  value={[parseInt(content[selectedElement].styles[deviceView].fontSize || '16px')]}
                                  onValueChange={(value) =>
                                    updateStyles(selectedElement, deviceView, {
                                      fontSize: `${value[0]}px`,
                                    })
                                  }
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Background Color</Label>
                                <Input
                                  type="color"
                                  value={content[selectedElement].styles[deviceView].backgroundColor || 'transparent'}
                                  onChange={(e) =>
                                    updateStyles(selectedElement, deviceView, {
                                      backgroundColor: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </AccordionContent>
                          </AccordionItem>

                          <AccordionItem value="dimensions">
                            <AccordionTrigger>Dimensions & Spacing</AccordionTrigger>
                            <AccordionContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Width</Label>
                                  <div className="flex items-center gap-2">
                                    <Slider
                                      min={50}
                                      max={800}
                                      step={5}
                                      value={[parseInt(content[selectedElement].styles[deviceView].width?.replace('px', '') || '200')]}
                                      onValueChange={(value) =>
                                        updateStyles(selectedElement, deviceView, {
                                          width: `${value[0]}px`,
                                        })
                                      }
                                    />
                                    <Input
                                      className="w-20"
                                      value={content[selectedElement].styles[deviceView].width}
                                      onChange={(e) =>
                                        updateStyles(selectedElement, deviceView, {
                                          width: e.target.value.includes('px') ? e.target.value : `${e.target.value}px`,
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label>Max Width</Label>
                                  <div className="flex items-center gap-2">
                                    <Slider
                                      min={100}
                                      max={1200}
                                      step={10}
                                      value={[parseInt(content[selectedElement].styles[deviceView].maxWidth?.replace('px', '') || '800')]}
                                      onValueChange={(value) =>
                                        updateStyles(selectedElement, deviceView, {
                                          maxWidth: `${value[0]}px`,
                                        })
                                      }
                                    />
                                    <Input
                                      className="w-20"
                                      value={content[selectedElement].styles[deviceView].maxWidth}
                                      onChange={(e) =>
                                        updateStyles(selectedElement, deviceView, {
                                          maxWidth: e.target.value.includes('px') ? e.target.value : `${e.target.value}px`,
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Margin</Label>
                                <Slider
                                  min={0}
                                  max={40}
                                  step={1}
                                  value={[parseInt(content[selectedElement].styles[deviceView].margin?.split(' ')[0]?.replace('px', '') || '0')]}
                                  onValueChange={(value) =>
                                    updateStyles(selectedElement, deviceView, {
                                      margin: `${value[0]}px auto`,
                                    })
                                  }
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Padding</Label>
                                <Slider
                                  min={0}
                                  max={40}
                                  step={1}
                                  value={[parseInt(content[selectedElement].styles[deviceView].padding || '0px')]}
                                  onValueChange={(value) =>
                                    updateStyles(selectedElement, deviceView, {
                                      padding: `${value[0]}px`,
                                    })
                                  }
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Border Radius</Label>
                                <Slider
                                  min={0}
                                  max={20}
                                  step={1}
                                  value={[parseInt(content[selectedElement].styles[deviceView].borderRadius || '0px')]}
                                  onValueChange={(value) =>
                                    updateStyles(selectedElement, deviceView, {
                                      borderRadius: `${value[0]}px`,
                                    })
                                  }
                                />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {selectedElement === 'logo' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Upload Logo</Label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'logo')}
                            className="cursor-pointer"
                          />
                          {content.logo.content && (
                            <div className="mt-2">
                              <img
                                src={content.logo.content}
                                alt="Uploaded Logo"
                                className="w-32 h-32 object-contain border rounded"
                              />
                            </div>
                          )}
                        </div>

                        <Accordion type="multiple">
                          <AccordionItem value="dimensions">
                            <AccordionTrigger>Dimensions</AccordionTrigger>
                            <AccordionContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Width</Label>
                                  <div className="flex items-center gap-2">
                                    <Slider
                                      min={50}
                                      max={300}
                                      step={5}
                                      value={[parseInt(content.logo.styles[deviceView].width || '200px')]}
                                      onValueChange={(value) =>
                                        updateStyles('logo', deviceView, {
                                          width: `${value[0]}px`,
                                        })
                                      }
                                    />
                                    <Input
                                      className="w-20"
                                      value={content.logo.styles[deviceView].width}
                                      onChange={(e) =>
                                        updateStyles('logo', deviceView, {
                                          width: e.target.value.includes('px') ? e.target.value : `${e.target.value}px`,
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label>Height</Label>
                                  <div className="flex items-center gap-2">
                                    <Slider
                                      min={50}
                                      max={300}
                                      step={5}
                                      value={[parseInt(content.logo.styles[deviceView].height || '200px')]}
                                      onValueChange={(value) =>
                                        updateStyles('logo', deviceView, {
                                          height: `${value[0]}px`,
                                        })
                                      }
                                    />
                                    <Input
                                      className="w-20"
                                      value={content.logo.styles[deviceView].height}
                                      onChange={(e) =>
                                        updateStyles('logo', deviceView, {
                                          height: e.target.value.includes('px') ? e.target.value : `${e.target.value}px`,
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {selectedElement === 'form' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addFormField('phone')}
                            disabled={content.form.fields.some(f => f.id === 'phone')}
                          >
                            Add Phone
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addFormField('date')}
                            disabled={content.form.fields.some(f => f.id === 'date')}
                          >
                            Add Date
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {content.form.fields.map((field) => (
                            <Card key={field.id} className="p-4">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium">{field.label || 'Field'}</h4>
                                {!['name', 'email'].includes(field.id) && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteFormField(field.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                )}
                              </div>

                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <Label>Label</Label>
                                  <Input
                                    value={field.label}
                                    onChange={(e) =>
                                      updateFormField(field.id, deviceView, {
                                        label: e.target.value
                                      })
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>Placeholder</Label>
                                  <Input
                                    value={field.placeholder}
                                    onChange={(e) =>
                                      updateFormField(field.id, deviceView, {
                                        placeholder: e.target.value,
                                      })
                                    }
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Width</Label>
                                    <div className="flex items-center gap-2">
                                      <Slider
                                        min={50}
                                        max={500}
                                        step={5}
                                        value={[parseInt(field.styles[deviceView].width.replace('%', '').replace('px', '') || '100')]}
                                        onValueChange={(value) =>
                                          updateFormField(field.id, deviceView, {
                                            width: `${value[0]}%`
                                          })
                                        }
                                      />
                                      <Input
                                        className="w-20"
                                        value={field.styles[deviceView].width}
                                        onChange={(e) =>
                                          updateFormField(field.id, deviceView, {
                                            width: e.target.value.includes('%') || e.target.value.includes('px')
                                              ? e.target.value
                                              : `${e.target.value}px`
                                          })
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Max Width</Label>
                                    <div className="flex items-center gap-2">
                                      <Slider
                                        min={100}
                                        max={800}
                                        step={10}
                                        value={[parseInt(field.styles[deviceView].maxWidth?.replace('px', '') || '500')]}
                                        onValueChange={(value) =>
                                          updateFormField(field.id, deviceView, {
                                            maxWidth: `${value[0]}px`
                                          })
                                        }
                                      />
                                      <Input
                                        className="w-20"
                                        value={field.styles[deviceView].maxWidth}
                                        onChange={(e) =>
                                          updateFormField(field.id, deviceView, {
                                            maxWidth: e.target.value.includes('px')
                                              ? e.target.value
                                              : `${e.target.value}px`
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Height</Label>
                                    <div className="flex items-center gap-2">
                                      <Slider
                                        min={20}
                                        max={100}
                                        step={2}
                                        value={[parseInt(field.styles[deviceView].height.replace('px', '') || '40')]}
                                        onValueChange={(value) =>
                                          updateFormField(field.id, deviceView, {
                                            height: `${value[0]}px`
                                          })
                                        }
                                      />
                                      <Input
                                        className="w-20"
                                        value={field.styles[deviceView].height}
                                        onChange={(e) =>
                                          updateFormField(field.id, deviceView, {
                                            height: e.target.value.includes('px')
                                              ? e.target.value
                                              : `${e.target.value}px`
                                          })
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Margin</Label>
                                    <div className="flex items-center gap-2">
                                      <Slider
                                        min={0}
                                        max={40}
                                        step={1}
                                        value={[parseInt(field.styles[deviceView].margin?.split(' ')[0]?.replace('px', '') || '8')]}
                                        onValueChange={(value) =>
                                          updateFormField(field.id, deviceView, {
                                            margin: `${value[0]}px auto`
                                          })
                                        }
                                      />
                                      <Input
                                        className="w-20"
                                        value={field.styles[deviceView].margin}
                                        onChange={(e) =>
                                          updateFormField(field.id, deviceView, {
                                            margin: e.target.value.includes('px')
                                              ? e.target.value
                                              : `${e.target.value}px auto`
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label>Font Size</Label>
                                  <Slider
                                    min={10}
                                    max={24}
                                    step={1}
                                    value={[parseInt(field.styles[deviceView].fontSize.replace('px', '') || '16')]}
                                    onValueChange={(value) =>
                                      updateFormField(field.id, deviceView, {
                                        fontSize: `${value[0]}px`
                                      })
                                    }
                                  />
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id={`required-${field.id}`}
                                    checked={field.required}
                                    onCheckedChange={(checked) =>
                                      updateFormField(field.id, deviceView, {
                                        required: checked,
                                      })
                                    }
                                  />
                                  <Label htmlFor={`required-${field.id}`}>Required</Label>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>

        <div className="bg-background border-t p-4 flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/b/dashboard/campaign-portal')}
          >
            Back
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Previous Step
            </Button>
            <Button
              onClick={() => {
                if (currentStep < builderSteps.length - 1) {
                  setCurrentStep(currentStep + 1);
                } else {
                  navigate(`/b/dashboard/campaign-portal/reward/${campaignId}`);
                }
              }}
              className="bg-amber-500 hover:bg-amber-600"
            >
              {currentStep < builderSteps.length - 1 ? 'Next Step' : 'Next: Reward Settings'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}