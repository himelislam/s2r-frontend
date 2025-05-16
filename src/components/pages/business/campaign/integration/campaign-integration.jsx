import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { 
  ChevronRight, Cog, MonitorSmartphone, Upload, Percent, 
  Hand, FileCode, Code, Zap, Tally3, Loader2, Trash2, CheckCircle2
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import campaignApi from '@/api/campaignApi'
import { Loader } from '@/components/pages/loader'
import { ZapierConfig } from '../integration/zapier-config'
import { WebhookConfig } from '../integration/webhook-config'
import { PabblyConfig } from '../integration/pabbly-config'
import { MakeConfig } from '../integration/make-config'
import { ApiConfig } from '../integration/api-config'
import integrationApi from '@/api/integrationApi'
import { toast } from 'react-toastify'

export default function CampaignIntegration() {
  const { campaignId } = useParams()
  const [campaign, setCampaign] = useState(null)
  const navigate = useNavigate()
  const [selectedIntegration, setSelectedIntegration] = useState('integrations')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [integrationToDelete, setIntegrationToDelete] = useState(null)

  // Filtered integrations to match backend schema
  const integrations = [
    // { id: "integrations", name: "Integrations", icon: <MonitorSmartphone className="h-6 w-6" /> },
    { id: "zapier", name: "Zapier", icon: <Zap className='h-6 w-6' /> },
    { id: "pabbly", name: "Pabbly", icon: <Tally3 className='h-6 w-6' /> },
    { id: "make", name: "Make.com", icon: <Tally3 className='h-6 w-6' /> },
    { id: "webhook", name: "Webhook", icon: <Cog className="h-6 w-6" /> },
    { id: "customApi", name: "Public API", icon: <FileCode className="h-6 w-6" /> },
  ]

  const isIntegrationActive = (integrationId) => {
    if (!campaign?.integrations) return false
    
    switch(integrationId) {
      case 'zapier':
        return campaign.integrations.zapier?.isActive || false
      case 'pabbly':
        return campaign.integrations.pabbly?.isActive || false
      case 'make':
        return campaign.integrations.make?.isActive || false
      case 'webhook':
        return campaign.integrations.webhook?.isActive || false
      case 'customApi':
        return campaign.integrations.customApi?.isActive || false
      default:
        return false
    }
  }

  const handleDeleteClick = (integrationId) => {
    setIntegrationToDelete(integrationId)
    setShowDeleteDialog(true)
  }

  const deleteIntegrationMutation = useMutation({
    mutationFn: (data) => integrationApi.updateIntegration(data),
    onSuccess: () => {
      toast.success('Integration deleted')
      getCampaignbyIdMutation.mutate({ campaignId })
      setShowDeleteDialog(false)
    },
    onError: (err) => console.log(err, "delete integration error")
  })

  const handleDeleteIntegration = () => {
    if (!integrationToDelete) return
    
    const updateData = {
      campaignId,
      updates: {
        [`integrations.${integrationToDelete}.isActive`]: false,
        [`integrations.${integrationToDelete}.webhookUrl`]: null,
        [`integrations.${integrationToDelete}.lastTriggeredAt`]: null,
        ...(integrationToDelete === 'zapier' && { 'integrations.zapier.secretKey': null })
      }
    }
    
    deleteIntegrationMutation.mutate(updateData)
  }

  const getIntegrationContent = () => {
    if (!campaign) return null

    const activeContent = (integrationName) => (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{integrationName} Integration</span>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleDeleteClick(selectedIntegration)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Integration
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Active</AlertTitle>
            <AlertDescription>
              This integration is currently active. You can delete it to configure a new one.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )

    switch(selectedIntegration) {
      case 'zapier':
        return isIntegrationActive('zapier') ? 
          activeContent('Zapier') : 
          <ZapierConfig campaignId={campaignId} onSuccess={() => getCampaignbyIdMutation.mutate({ campaignId })} />
      case 'pabbly':
        return isIntegrationActive('pabbly') ? 
          activeContent('Pabbly') : 
          <PabblyConfig campaignId={campaignId} onSuccess={() => getCampaignbyIdMutation.mutate({ campaignId })} />
      case 'make':
        return isIntegrationActive('make') ? 
          activeContent('Make.com') : 
          <MakeConfig campaignId={campaignId} onSuccess={() => getCampaignbyIdMutation.mutate({ campaignId })} />
      case 'webhook':
        return isIntegrationActive('webhook') ? 
          activeContent('Webhook') : 
          <WebhookConfig campaignId={campaignId} onSuccess={() => getCampaignbyIdMutation.mutate({ campaignId })} />
      case 'customApi':
        return isIntegrationActive('customApi') ? 
          activeContent('Public API') : 
          <ApiConfig campaignId={campaignId} onSuccess={() => getCampaignbyIdMutation.mutate({ campaignId })} />
      case 'integrations':
        return (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Connect Your Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Select an integration from the menu above to configure it for your campaign.
              </p>
            </CardContent>
          </Card>
        )
      default:
        return (
          <Card className="max-w-lg mx-auto mt-6">
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-semibold mb-2">
                {selectedIntegration} integration coming soon
              </h2>
              <p className="text-muted-foreground mb-6">
                We're working on adding this integration soon.
              </p>
              <Button className="bg-blue-500 hover:bg-blue-600">
                Notify me when available
              </Button>
            </CardContent>
          </Card>
        )
    }
  }

  const getCampaignbyIdMutation = useMutation({
    mutationFn: campaignApi.getCampaignById,
    onSuccess: (data) => setCampaign(data),
    onError: (err) => console.log(err, "get Err")
  })

  useEffect(() => {
    getCampaignbyIdMutation.mutate({ campaignId })
  }, [])

  if (getCampaignbyIdMutation.isPending) return <Loader />

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex-1 flex flex-col">
        <h1 className="text-xl font-bold mb-2">{campaign?.campaignName}</h1>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 flex-wrap">
            {[
              { name: 'Campaign', path: 'builder' },
              { name: 'Reward', path: 'reward' },
              { name: 'Settings', path: 'settings' },
              { name: 'Email', path: 'email-builder' },
              { name: 'Integration', path: 'integration', active: true },
              { name: 'Promotes', path: 'promotes' }
            ].map((item, index) => (
              <React.Fragment key={item.path}>
                <div
                  className={`text-sm ${item.active ? 'text-orange-500' : 'text-muted-foreground'} cursor-pointer hover:underline`}
                  onClick={() => navigate(`/b/dashboard/campaign-portal/${item.path}/${campaignId}`)}
                >
                  {item.name}
                </div>
                {index < 5 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Integration Options */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {integrations.map((integration) => (
          <Button
            key={integration.id}
            variant={selectedIntegration === integration.id ? 'default' : 'outline'}
            className={`flex flex-col h-24 ${selectedIntegration === integration.id ? 'bg-blue-500' : ''} ${
              isIntegrationActive(integration.id) ? 'border-green-500 border-2' : ''
            }`}
            onClick={() => setSelectedIntegration(integration.id)}
          >
            <div className="flex items-center justify-center h-12 w-12 mb-2">
              {integration.icon}
              {isIntegrationActive(integration.id) && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500"></span>
              )}
            </div>
            <span className="text-sm font-medium">{integration.name}</span>
          </Button>
        ))}
      </div>

      <Separator />

      {/* Integration Content */}
      {getIntegrationContent()}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Integration</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this integration? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleteIntegrationMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteIntegration}
              disabled={deleteIntegrationMutation.isPending}
            >
              {deleteIntegrationMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button 
          onClick={() => navigate(`/b/dashboard/campaign-portal/email-builder/${campaignId}`)} 
          variant="outline"
        >
          Back
        </Button>
        <Button 
          onClick={() => navigate(`/b/dashboard/campaign-portal/promotes/${campaignId}`)} 
          className="bg-amber-500 hover:bg-amber-600"
        >
          Next
        </Button>
      </div>
    </div>
  )
}