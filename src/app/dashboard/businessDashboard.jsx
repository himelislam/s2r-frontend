import businessApi from "@/api/businessApi";
import { BusinessAppSidebar } from "@/components/pages/business/business-app-sidebar"
import { Loader } from "@/components/pages/loader";
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import useBusiness from "@/hooks/useBusiness";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom"

export default function BusinessDashboard() {
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const { businessState, dispatch } = useBusiness();

   const navigate = useNavigate();
  const skipType = user?.skipType;

  const { data: business = [], isLoading, isSuccess } = useQuery({
    queryKey: ['getBusinessById', user?.userId],
    queryFn: () => businessApi.getBusinessById(user?.userId),
    enabled: !!user?.userId
  })

  useEffect(() => {
    if (isSuccess) {
      dispatch({ type: "SET_BUSINESS", payload: business });
      console.log('dispatched business', business);
    }
  }, [isSuccess, business]);

  if (isLoading) {
    return <Loader />
  }

  return (
    <SidebarProvider>
      <BusinessAppSidebar business={business} />
      {skipType === "later" && (
        <button
          onClick={() => navigate("/welcome")}
          className="fixed left-0 bottom-[100px] z-50 bg-blue-600 text-white text-xs px-2 py-1 origin-bottom-left hover:bg-blue-700"
        >
          Complete Onboarding
        </button>
      )}

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
