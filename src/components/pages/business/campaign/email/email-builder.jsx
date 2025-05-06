import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';
import { ChevronLeft, ChevronRight, Monitor, PenSquare, Share2, Smartphone, Tablet, Wrench } from 'lucide-react';
import campaignApi from '@/api/campaignApi';
import { Loader } from '@/components/pages/loader';
import { Button } from '@/components/ui/button';
// import useEditableContent from '@/hooks/useEditableContent';
import EditableTextEmail from './editable-text-email';
import { toast } from 'react-toastify';
import useEmailEditableContent from '@/hooks/useEmailEditableContent';

export default function EmailBuilder() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [deviceView, setDeviceView] = useState('desktop');
  const [selectedElement, setSelectedElement] = useState('header');
  const [uploadedImage, setUploadedImage] = useState(null);

  const {
    content,
    updateContent,
    updateStyles,
    getContentAsJSON,
    setContent
  } = useEmailEditableContent();

  const getCampaignbyIdMutation = useMutation({
    mutationFn: campaignApi.getCampaignById,
    onSuccess: (data) => {
      const emailState = JSON.parse(data.emailJSON)
      setContent(emailState);
      setCampaign(data);
    },
    onError: (err) => {
      console.log(err, "get Err");
    }
  });

  const updateCampaignStateMutation = useMutation({
    mutationFn: campaignApi.updateCampaignEmailState,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (err) => {
      console.log(err, "err");
    }
  });

  const uploadLogoMutation = useMutation({
    mutationFn: campaignApi.uploadImage,
    onSuccess: (data) => {
      setUploadedImage(data.url);
      updateContent('logo', data.url);
      toast.success('Image uploaded successfully');
    },
    onError: (err) => {
      console.log(err, "error on file upload");
      toast.error('Unable to upload image.');
    }
  });

  useEffect(() => {
    getCampaignbyIdMutation.mutate({ campaignId });
  }, [campaignId]);

  const handleSave = () => {
    updateCampaignStateMutation.mutate({
      state: JSON.stringify(content),
      campaignId,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      uploadLogoMutation.mutate(formData);
    }
  };

  const renderContent = (content) => {
    return content
      .replace(/{{referrerName}}/g, 'Referrer')
      .replace(/{{businessName}}/g, 'Business')
      .replace(/{{code}}/g, campaign?.reward?.method == 'added' ? campaign?.reward?.code : 'Coupon/Giftcard Code' );
  };

  if (getCampaignbyIdMutation.isPending) {
    return <Loader />;
  }

  return (
    <div className="flex-1 flex flex-col">
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
            className="text-sm text-orange-500  cursor-pointer hover:underline"
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

      <div className="flex h-screen">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                {['desktop', 'tablet', 'mobile'].map((device) => (
                  <Tooltip key={device}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={deviceView === device ? "bg-blue-50" : ""}
                        onClick={() => setDeviceView(device)}
                      >
                        {device === 'desktop' ? <Monitor className="h-4 w-4" /> : device === 'tablet' ? <Tablet className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{`${device.charAt(0).toUpperCase() + device.slice(1)} View`}</TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-2">
              {/* <Button variant="outline" className="gap-2">
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
              </Button> */}
            </div>
          </div>

          <div className="flex-1 flex">
            <div className="flex-1 p-8">
              <div className="max-w-2xl mx-auto">
                <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                  <div className="items-center mb-4">
                    <img
                      src={content.logo?.content}
                      style={content.logo?.styles}
                      alt=""
                      className="w-40 h-40 mx-auto cursor-pointer hover:border-2 hover:border-dashed hover:border-blue-500 transition duration-200 ease-in-out"
                      onClick={() => setSelectedElement('logo')}
                    />
                    <EditableTextEmail
                      value={content.header?.content}
                      onChange={(value) => updateContent('header', value)}
                      className="text-center text-xl hover:border-2 hover:border-dashed hover:border-blue-500 transition duration-200 ease-in-out cursor-pointer"
                      styles={content.header?.styles}
                      elementName="header"
                      setSelectedElement={setSelectedElement}
                      renderContent={renderContent}
                      isEditable={true}
                    />
                  </div>
                  <EditableTextEmail
                    value={content.description1?.content}
                    onChange={(value) => updateContent('description1', value)}
                    className="text-md text-gray-800 dark:text-gray-200 mb-4 text-center hover:border-2 hover:border-dashed hover:border-blue-500 transition duration-200 ease-in-out cursor-pointer"
                    styles={content.description1?.styles}
                    elementName="description1"
                    setSelectedElement={setSelectedElement}
                    renderContent={renderContent}
                    isEditable={true}
                  />

                  {/* <EditableTextEmail
                    value={content.couponCode?.content}
                    // onChange={(value) => updateContent('couponCode', value)}
                    className="text-md text-gray-800 dark:text-gray-200 mb-4 text-center hover:border-2 hover:border-dashed hover:border-blue-500 transition duration-200 ease-in-out cursor-pointer"
                    styles={content.couponCode?.styles}
                    elementName="couponCode"
                    setSelectedElement={setSelectedElement}
                    renderContent={renderContent}
                  /> */}

                  <EditableTextEmail
                    value={content.couponCode?.content}
                    // onChange={() => { }} // Disable editing by passing an empty function
                    className="text-md text-gray-800 dark:text-gray-200 mb-4 text-center hover:border-2 hover:border-dashed hover:border-blue-500 transition duration-200 ease-in-out cursor-pointer"
                    styles={content.couponCode?.styles}
                    elementName="couponCode"
                    setSelectedElement={setSelectedElement}
                    renderContent={renderContent}
                    isEditable={false} // Optional: Add a prop to explicitly disable editing
                  />
                  <EditableTextEmail
                    value={content.description2?.content}
                    onChange={(value) => updateContent('description2', value)}
                    className="text-md text-gray-800 dark:text-gray-200 mb-4 text-center hover:border-2 hover:border-dashed hover:border-blue-500 transition duration-200 ease-in-out cursor-pointer"
                    styles={content.description2?.styles}
                    elementName="description2"
                    setSelectedElement={setSelectedElement}
                    renderContent={renderContent}
                    isEditable={true}
                  />
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleSave}>
                    Save
                  </Button>
                  <Button variant="outline">Preview</Button>
                </div>
              </div>
            </div>

            <div className="w-96 border-l bg-background p-4">
              <div className="space-y-6">
                {selectedElement && (
                  <>
                    <h3 className="font-medium mb-3">{`${selectedElement.charAt(0).toUpperCase() + selectedElement.slice(1)} Styles`}</h3>
                    {['backgroundColor', 'fontSize', 'fontFamily', 'color', 'padding', 'borderRadius'].map((style) => (
                      <div key={style}>
                        <h3 className="font-medium mb-3">{`${style.charAt(0).toUpperCase() + style.slice(1)}`}</h3>
                        {style === 'fontFamily' ? (
                          <select
                            value={content[selectedElement]?.styles[style]}
                            onChange={(e) => updateStyles(selectedElement, { ...content[selectedElement]?.styles, [style]: e.target.value })}
                            className="w-full p-2 border rounded"
                          >
                            <option value="Arial, sans-serif">Arial</option>
                            <option value="Times New Roman, serif">Times New Roman</option>
                            <option value="Courier New, monospace">Courier New</option>
                            <option value="Georgia, serif">Georgia</option>
                          </select>
                        ) : style === 'fontSize' || style === 'padding' || style === 'borderRadius' ? (
                          <input
                            type="range"
                            min="0"
                            max={style === 'fontSize' ? '32' : '32'}
                            value={parseInt(content[selectedElement]?.styles[style])}
                            onChange={(e) => updateStyles(selectedElement, { ...content[selectedElement]?.styles, [style]: `${e.target.value}px` })}
                            className="w-full"
                          />
                        ) : (
                          <input
                            type="color"
                            value={content[selectedElement]?.styles[style]}
                            onChange={(e) => updateStyles(selectedElement, { ...content[selectedElement]?.styles, [style]: e.target.value })}
                            className="w-full"
                          />
                        )}
                        <span className="text-xs">{content[selectedElement]?.styles[style]}</span>
                      </div>
                    ))}
                  </>
                )}
                {selectedElement === 'logo' && (
                  <div>
                    <h3 className="font-medium mb-3">Logo</h3>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full cursor-pointer"
                    />
                    {uploadedImage && (
                      <div className="mb-4">
                        <img
                          src={uploadedImage}
                          alt="Uploaded Logo"
                          style={{ borderRadius: content.logo?.styles.borderRadius }}
                          className="w-32 h-32 object-cover border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button onClick={() => navigate(`/b/dashboard/campaign-portal/settings/${campaignId}`)} variant="outline">Back</Button>
        <Button onClick={() => navigate(`/b/dashboard/campaign-portal/integration/${campaignId}`)} className="bg-amber-500 hover:bg-amber-600">Next</Button>
      </div>
    </div>
  );
}