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
  QrCode,
  Settings,
  Trophy,
  Magnet
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { BusinessNavUser } from "@/components/pages/business/business-nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"


export function BusinessAppSidebar({ ...props }) {
  
  
  const data = {
    user: {
      name: props.business?.name,
      email: props.business?.email,
      avatar: props?.business?.url,
    },
    teams: [
      {
        name: props.business?.businessName ? props.business?.businessName : "Business Dashboard",
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
        title: "Rewards",
        url: "/b/dashboard/payouts",
        icon: Trophy,
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
        icon: QrCode,
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
        icon: Magnet,
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
        title: "Add Referrer",
        url: "/b/dashboard/add-referrer",
        icon: Magnet,
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
        icon: Settings,
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
  
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} business={props.business} referrer={[]} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <BusinessNavUser user={data.user} />
        {/* <NavUser user={userState} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
