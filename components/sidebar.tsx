"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Activity, BarChart3, Briefcase, Cpu, Database, Layers, LineChart, Settings, Zap } from "lucide-react"
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarProvider,
} from "@/components/ui/sidebar"

export function Sidebar() {
  const [activeItem, setActiveItem] = useState("dashboard")

  const menuItems = [
    { id: "dashboard", icon: Activity, label: "Dashboard" },
    { id: "agents", icon: Cpu, label: "Agents" },
    { id: "strategies", icon: Zap, label: "Strategies" },
    { id: "alpha", icon: LineChart, label: "Alpha" },
    { id: "blockchain", icon: Database, label: "Blockchain" },
    { id: "tesla", icon: Layers, label: "Tesla" },
    { id: "capital", icon: BarChart3, label: "Capital" },
    { id: "feedback", icon: Briefcase, label: "Feedback" },
    { id: "settings", icon: Settings, label: "Settings" },
  ]

  return (
    <SidebarProvider>
      <ShadcnSidebar collapsible="icon">
        <SidebarHeader className="flex items-center justify-center py-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center"
          >
            <span className="font-bold text-white">DD</span>
          </motion.div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={activeItem === item.id}
                  onClick={() => setActiveItem(item.id)}
                  tooltip={item.label}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarRail />
      </ShadcnSidebar>
    </SidebarProvider>
  )
}
