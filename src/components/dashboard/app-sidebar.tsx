"use client"

import * as React from "react"
import {
  Command,
  GithubIcon,
  Twitter,
  CircleUser,
  Link,
  NotepadText,
  Video,
} from "lucide-react"

import { NavMain } from "@/components/dashboard/nav-main"
import { NavSecondary } from "@/components/dashboard/nav-secondary"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { tagTypeEnum } from "@/hooks/useTagState"

const data = {
  user: {
    name: "brainly",
    email: "brainly@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  navMain: [
    {
      title: "Links",
      tagType: tagTypeEnum.links,
      icon: Link
    },
    {
      title: "Documents",
      tagType: tagTypeEnum.docs,
      icon: NotepadText
    },
    {
      title: "Tweet",
      tagType: tagTypeEnum.tweet,
      icon: Twitter
    },
    {
      title: "Video",
      tagType: tagTypeEnum.videos,
      icon: Video,
    },
  ],
  navSecondary: [
    {
      title: "Twitter",
      url: "https://x.com/orca_x27",
      icon: Twitter,
    },
    {
      title: "Github",
      url: "https://github.com/dhanushd-27",
      icon: GithubIcon,
    },
    {
      title: "Portfolio",
      url: "https://past-nova-2ec.notion.site/portfolio",
      icon: CircleUser
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
