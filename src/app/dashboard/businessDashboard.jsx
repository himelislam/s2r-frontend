import businessApi from "@/api/businessApi";
import { BusinessAppSidebar } from "@/components/pages/business/business-app-sidebar"
import { Loader } from "@/components/pages/loader";
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom"

export default function BusinessDashboard() {
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  const {data: business =[], isLoading} = useQuery({
    queryKey: ['getBusinessById', user?.userId],
    queryFn: () => businessApi.getBusinessById(user?.userId),
    enabled: !!user?.userId
  })

if(isLoading){
  return <Loader/>
}

  return (
    <SidebarProvider>
      <BusinessAppSidebar business={business} />
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
          <Outlet/>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
