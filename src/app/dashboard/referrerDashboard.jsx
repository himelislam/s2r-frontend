import referrerApi from "@/api/referrerApi";
import { Loader } from "@/components/pages/loader";
import { ReferrerAppSidebar } from "@/components/pages/referrer/referrer-app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import useReferrer from "@/hooks/useReferrer";
import { useIsFetching, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet } from "react-router-dom"

export default function ReferrerDashboard() {
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const {dispatch} = useReferrer();

  const { data: referrer = [], isLoading, isSuccess} = useQuery({
    queryKey: ['getReferrerById', user?.userId],
    queryFn: () => referrerApi.getReferrerById(user?.userId),
    enabled: !!user?.userId,
  })

  useEffect(() => {
      if (isSuccess) {
        dispatch({ type: "SET_REFERRER", payload: referrer });
      }
    }, [isSuccess, referrer]);

  if(isLoading){
    return <Loader/>
  }



  return (
    <SidebarProvider>
      <ReferrerAppSidebar referrer={referrer} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
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
