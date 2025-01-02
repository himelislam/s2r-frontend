import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useQuery } from "@tanstack/react-query"
import businessApi from "@/api/businessApi"
import { DotLoader } from "react-spinners"


export function BusinessAppSidebar({ ...props }) {
  
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;
  const {data: business =[], isPending} = useQuery({
    queryKey: ['getBusinessById', user?.userId],
    queryFn: () => businessApi.getBusinessById(user?.userId),
    enabled: !!user?.userId
  })

  const data = {
    user: {
      name: business?.name,
      email: business?.email,
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: business?.businessName ? business?.businessName : "Business Dashboard",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
    ],
    navMain: [
      {
        title: "Overview",
        url: "/b/dashboard",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "History",
            url: "#",
          },
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Settings",
            url: "#",
          },
        ],
      },
      {
        title: "Campaigns",
        url: "/b/dashboard/campaign-portal",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
      {
        title: "Referrers",
        url: "/b/dashboard/referrers",
        icon: Bot,
        items: [
          {
            title: "Genesis",
            url: "#",
          },
          {
            title: "Explorer",
            url: "#",
          },
          {
            title: "Quantum",
            url: "#",
          },
        ],
      },
      {
        title: "Referees",
        url: "/b/dashboard/referees",
        icon: Bot,
        items: [
          {
            title: "Genesis",
            url: "#",
          },
          {
            title: "Explorer",
            url: "#",
          },
          {
            title: "Quantum",
            url: "#",
          },
        ],
      },
      {
        title: "Awards",
        url: "/b/dashboard/payouts",
        icon: BookOpen,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
      {
        title: "QR Codes",
        url: "/b/dashboard/qr-codes",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
      {
        title: "Invite Referrer",
        url: "/b/dashboard/invite-referrer",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
      {
        title: "Account Settings",
        url: "/b/dashboard/account-settings",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  }

  // if (isPending) {
  //   return <div style={{textAlign: 'center', justifyContent: 'center', alignItems: 'center', display: 'flex', height: '100vh', width: '100vw'}}>
  //     <DotLoader cssOverride={{marginTop: '50px'}}/>
  //   </div>
  // }
  
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} business={business} referrer={[]} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
        {/* <NavUser user={userState} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
