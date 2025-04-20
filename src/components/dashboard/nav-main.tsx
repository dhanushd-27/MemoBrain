"use client"

import { type LucideIcon } from "lucide-react"

import {
  Collapsible,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { tagTypeEnum, useTagStore } from "@/hooks/useTagState"

export function NavMain({
  items,
}: {
  items: {
    title: string
    tagType: tagTypeEnum
    icon: LucideIcon
  }[]
}) {
  const { changeTagType } = useTagStore();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Type</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <div onClick={ () => {
                  changeTagType(item.tagType);
                }}>
                  <item.icon />
                  <span>{item.title}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
