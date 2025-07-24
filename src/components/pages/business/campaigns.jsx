import React, { useState } from 'react';
import { usePlan } from '@/context/planContext';
import PlanRestriction from '@/components/plan-restriction';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const CampaignsPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { canUseFeature } = usePlan();

  const CreateCampaignButton = () => (
    <Button onClick={() => setShowCreateForm(true)}>
      <Plus className="h-4 w-4 mr-2" />
      Create Campaign
    </Button>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        
        <PlanRestriction 
          feature="campaigns"
          upgradeMessage="You've reached your campaign limit. Upgrade to create more campaigns."
        >
          <CreateCampaignButton />
        </PlanRestriction>
      </div>

      {/* Rest of your campaigns component */}
      {showCreateForm && (
        <div>
          {/* Your campaign creation form */}
        </div>
      )}
    </div>
  );
};

export default CampaignsPage;