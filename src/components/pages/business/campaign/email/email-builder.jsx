import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Monitor, Tablet, Smartphone, ChevronLeft, ChevronRight, Save, ScanEye, Mail, X, Undo2, Redo2 } from 'lucide-react';
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
import EditableTextEmail from "./editable-text-email";
import { toast } from "react-toastify";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader } from "../../../loader";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import campaignApi from "@/api/campaignApi";
import useEmailEditableContent from "@/hooks/useEmailEditableContent";

const builderSteps = [
  "Welcome Email",
  "Reward Email"
];

export default function EmailBuilder() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [deviceView, setDeviceView] = useState("desktop");
  const [selectedElement, setSelectedElement] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [campaign, setCampaign] = useState(null);

  const {
    welcomeContent,
    rewardContent,
    updateSubject,
    updateContent,
    updateStyles,
    getContentAsJSON,
    getContentAsHTML,
    setContent,
    undo,
    redo,
    canUndo,
    canRedo
  } = useEmailEditableContent();

  const getCampaignbyIdMutation = useMutation({
    mutationFn: campaignApi.getCampaignById,
    onSuccess: (data) => {
      if (data.emailJSON) {
        const emailState = JSON.parse(data.emailJSON);
        setContent(emailState.welcome, 'welcome');
        setContent(emailState.reward, 'reward');
        setCampaign(data);
      }
    },
    onError: (err) => {
      console.error(err);
      toast.error('Failed to load campaign data');
    }
  });

  const updateCampaignMutation = useMutation({
    mutationFn: campaignApi.updateCampaignEmailState,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (err) => {
      console.error(err);
      toast.error('Failed to save email template');
    }
  });

  const uploadImageMutation = useMutation({
    mutationFn: campaignApi.uploadImage,
    onSuccess: (data) => {
      updateContent('logo', data.url, currentStep === 0 ? 'welcome' : 'reward');
      toast.success('Image uploaded successfully');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Failed to upload image');
    }
  });

  useEffect(() => {
    getCampaignbyIdMutation.mutate({ campaignId });
  }, [campaignId]);

  const handleSave = () => {
    updateCampaignMutation.mutate({
      campaignId,
      state: getContentAsJSON(),
      html: {
        welcome: getContentAsHTML('welcome'),
        reward: getContentAsHTML('reward')
      }
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      uploadImageMutation.mutate(formData);
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

  const renderContent = (text) => {
    return text
      .replace(/{{referrerName}}/g, 'Referrer')
      .replace(/{{businessName}}/g, 'Business')
      .replace(/{{customerName}}/g, 'Customer')
      .replace(/{{yourName}}/g, 'Your Name')
      .replace(/{{code}}/g, 'DISCOUNT50');
  };

  const renderEmailContent = () => {
    const currentContent = currentStep === 0 ? welcomeContent : rewardContent;
    const currentType = currentStep === 0 ? 'welcome' : 'reward';
    
    return (
      <div className="relative p-6 w-full flex flex-col items-center">
        {currentContent.logo && (
          <div className="items-center mb-4 w-full">
            <img
              src={currentContent.logo.content}
              style={currentContent.logo.styles}
              alt=""
              className="mx-auto cursor-pointer hover:border-2 hover:border-dashed hover:border-primary transition duration-200 ease-in-out"
              onClick={() => handleElementClick('logo')}
            />
          </div>
        )}

        {Object.entries(currentContent).map(([key, section]) => {
          if (key === 'logo' || key === 'subject') return null;
          
          return (
            <EditableTextEmail
              key={key}
              value={section.content}
              onChange={(value) => updateContent(key, value, currentType)}
              className="hover:border-2 hover:border-dashed hover:border-primary transition duration-200 ease-in-out cursor-pointer mb-4"
              styles={section.styles}
              elementName={key}
              setSelectedElement={handleElementClick}
              renderContent={renderContent}
              isEditable={true}
              placeholder={`Click to edit ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
            />
          );
        })}
      </div>
    );
  };

  if (getCampaignbyIdMutation.isPending) {
    return <Loader />;
  }

  return (
    <div className="flex h-screen bg-muted/40">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-background border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold mb-2">{campaign?.campaignName}</h1>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div
                    className="text-sm text-muted-foreground font-medium cursor-pointer hover:underline"
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
                    className="text-sm text-orange-500 cursor-pointer hover:underline"
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


              <Button 
                variant="outline" 
                size="icon" 
                onClick={undo} 
                disabled={!canUndo}
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={redo} 
                disabled={!canRedo}
              >
                <Redo2 className="h-4 w-4" />
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
                    minHeight: "500px",
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <div className="p-6">
                    {/* Email Subject */}
                    <div className="mb-6">
                      <Label className="block text-sm font-medium mb-2">Email Subject</Label>
                      <Input
                        value={currentStep === 0 ? welcomeContent.subject : rewardContent.subject}
                        onChange={(e) => updateSubject(e.target.value, currentStep === 0 ? 'welcome' : 'reward')}
                        placeholder="Enter email subject"
                      />
                    </div>

                    {renderEmailContent()}
                  </div>
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

                    {selectedElement === 'logo' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Upload Logo</Label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="cursor-pointer"
                          />
                          {(currentStep === 0 ? welcomeContent : rewardContent).logo?.content && (
                            <div className="mt-2">
                              <img
                                src={(currentStep === 0 ? welcomeContent : rewardContent).logo.content}
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
                                      value={[parseInt((currentStep === 0 ? welcomeContent : rewardContent).logo.styles.width || '200px')]}
                                      onValueChange={(value) =>
                                        updateStyles('logo', { width: `${value[0]}px` }, currentStep === 0 ? 'welcome' : 'reward')
                                      }
                                    />
                                    <Input
                                      className="w-20"
                                      value={(currentStep === 0 ? welcomeContent : rewardContent).logo.styles.width}
                                      onChange={(e) =>
                                        updateStyles('logo', {
                                          width: e.target.value.includes('px') ? e.target.value : `${e.target.value}px`,
                                        }, currentStep === 0 ? 'welcome' : 'reward')
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
                                      value={[parseInt((currentStep === 0 ? welcomeContent : rewardContent).logo.styles.height || '200px')]}
                                      onValueChange={(value) =>
                                        updateStyles('logo', { height: `${value[0]}px` }, currentStep === 0 ? 'welcome' : 'reward')
                                      }
                                    />
                                    <Input
                                      className="w-20"
                                      value={(currentStep === 0 ? welcomeContent : rewardContent).logo.styles.height}
                                      onChange={(e) =>
                                        updateStyles('logo', {
                                          height: e.target.value.includes('px') ? e.target.value : `${e.target.value}px`,
                                        }, currentStep === 0 ? 'welcome' : 'reward')
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

                    {selectedElement && selectedElement !== 'logo' && (currentStep === 0 ? welcomeContent : rewardContent)[selectedElement] && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Text Content</Label>
                          <Input
                            value={(currentStep === 0 ? welcomeContent : rewardContent)[selectedElement].content}
                            onChange={(e) => updateContent(selectedElement, e.target.value, currentStep === 0 ? 'welcome' : 'reward')}
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
                                  value={(currentStep === 0 ? welcomeContent : rewardContent)[selectedElement].styles.color || '#000000'}
                                  onChange={(e) =>
                                    updateStyles(selectedElement, {
                                      color: e.target.value,
                                    }, currentStep === 0 ? 'welcome' : 'reward')
                                  }
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Font Size</Label>
                                <Slider
                                  min={12}
                                  max={48}
                                  step={1}
                                  value={[parseInt((currentStep === 0 ? welcomeContent : rewardContent)[selectedElement].styles.fontSize || '16px')]}
                                  onValueChange={(value) =>
                                    updateStyles(selectedElement, {
                                      fontSize: `${value[0]}px`,
                                    }, currentStep === 0 ? 'welcome' : 'reward')
                                  }
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Background Color</Label>
                                <Input
                                  type="color"
                                  value={(currentStep === 0 ? welcomeContent : rewardContent)[selectedElement].styles.backgroundColor || 'transparent'}
                                  onChange={(e) =>
                                    updateStyles(selectedElement, {
                                      backgroundColor: e.target.value,
                                    }, currentStep === 0 ? 'welcome' : 'reward')
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
                                      value={[parseInt((currentStep === 0 ? welcomeContent : rewardContent)[selectedElement].styles.width?.replace('px', '') || '200')]}
                                      onValueChange={(value) =>
                                        updateStyles(selectedElement, {
                                          width: `${value[0]}px`,
                                        }, currentStep === 0 ? 'welcome' : 'reward')
                                      }
                                    />
                                    <Input
                                      className="w-20"
                                      value={(currentStep === 0 ? welcomeContent : rewardContent)[selectedElement].styles.width}
                                      onChange={(e) =>
                                        updateStyles(selectedElement, {
                                          width: e.target.value.includes('px') ? e.target.value : `${e.target.value}px`,
                                        }, currentStep === 0 ? 'welcome' : 'reward')
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
                                      value={[parseInt((currentStep === 0 ? welcomeContent : rewardContent)[selectedElement].styles.maxWidth?.replace('px', '') || '800')]}
                                      onValueChange={(value) =>
                                        updateStyles(selectedElement, {
                                          maxWidth: `${value[0]}px`,
                                        }, currentStep === 0 ? 'welcome' : 'reward')
                                      }
                                    />
                                    <Input
                                      className="w-20"
                                      value={(currentStep === 0 ? welcomeContent : rewardContent)[selectedElement].styles.maxWidth}
                                      onChange={(e) =>
                                        updateStyles(selectedElement, {
                                          maxWidth: e.target.value.includes('px') ? e.target.value : `${e.target.value}px`,
                                        }, currentStep === 0 ? 'welcome' : 'reward')
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
                                  value={[parseInt((currentStep === 0 ? welcomeContent : rewardContent)[selectedElement].styles.margin?.split(' ')[0]?.replace('px', '') || '0')]}
                                  onValueChange={(value) =>
                                    updateStyles(selectedElement, {
                                      margin: `${value[0]}px auto`,
                                    }, currentStep === 0 ? 'welcome' : 'reward')
                                  }
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Padding</Label>
                                <Slider
                                  min={0}
                                  max={40}
                                  step={1}
                                  value={[parseInt((currentStep === 0 ? welcomeContent : rewardContent)[selectedElement].styles.padding || '0px')]}
                                  onValueChange={(value) =>
                                    updateStyles(selectedElement, {
                                      padding: `${value[0]}px`,
                                    }, currentStep === 0 ? 'welcome' : 'reward')
                                  }
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Border Radius</Label>
                                <Slider
                                  min={0}
                                  max={20}
                                  step={1}
                                  value={[parseInt((currentStep === 0 ? welcomeContent : rewardContent)[selectedElement].styles.borderRadius || '0px')]}
                                  onValueChange={(value) =>
                                    updateStyles(selectedElement, {
                                      borderRadius: `${value[0]}px`,
                                    }, currentStep === 0 ? 'welcome' : 'reward')
                                  }
                                />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
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
            onClick={() => navigate(`/b/dashboard/campaign-portal/settings/${campaignId}`)}
          >
            Back
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Previous
            </Button>
            <Button
              onClick={() => {
                if (currentStep < builderSteps.length - 1) {
                  setCurrentStep(currentStep + 1);
                } else {
                  navigate(`/b/dashboard/campaign-portal/integration/${campaignId}`);
                }
              }}
              className="bg-amber-500 hover:bg-amber-600"
            >
              {currentStep < builderSteps.length - 1 ? 'Next' : 'Next: Integration'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}