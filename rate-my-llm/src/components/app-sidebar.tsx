import { Calendar, Home, TestTubeDiagonal, Inbox, Search, Settings } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"


const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "Test Model",
        url: "/test-eval",
        icon: TestTubeDiagonal,
    },
    {
        title: "Start Evaluation",
        url: "/evaluate",
        icon: TestTubeDiagonal,
    },
    {
        title: "Saved Evaluations",
        url: "/history",
        icon: Inbox,
    },
    {
        title: "Documentation",
        url: "#",
        icon: Calendar,
    },
    {
        title: "/models",
        url: "/models",
        icon: Search,
    },
    {
        title: "/saved",
        url: "/saved",
        icon: Settings,
    },
    {
        title: "/docs",
        url: "/docs",
        icon: Settings,
    },
    {
        title: "/configure",
        url: "/configure",
        icon: Settings,
    },
    {
        title: "/results",
        url: "/saved",
        icon: Settings,
    },
    {
        title: "/compare",
        url: "/saved",
        icon: Settings,
    },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Rate My LLM</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
