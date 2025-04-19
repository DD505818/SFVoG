"use client"

import { useEffect, useState } from "react"
import { Search, Settings, Zap, BarChart3, Cpu, Database, LineChart, Layers, Briefcase } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"

export function CommandMenu() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <Button
        id="command-menu-trigger"
        variant="outline"
        className="fixed right-4 bottom-4 h-10 w-10 rounded-full shadow-lg"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => console.log("Dashboard")}>
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => console.log("Agents")}>
              <Cpu className="mr-2 h-4 w-4" />
              <span>Agents</span>
            </CommandItem>
            <CommandItem onSelect={() => console.log("Strategies")}>
              <Zap className="mr-2 h-4 w-4" />
              <span>Strategies</span>
            </CommandItem>
            <CommandItem onSelect={() => console.log("Alpha")}>
              <LineChart className="mr-2 h-4 w-4" />
              <span>Alpha Feed</span>
            </CommandItem>
            <CommandItem onSelect={() => console.log("Blockchain")}>
              <Database className="mr-2 h-4 w-4" />
              <span>Blockchain Verifier</span>
            </CommandItem>
            <CommandItem onSelect={() => console.log("Tesla")}>
              <Layers className="mr-2 h-4 w-4" />
              <span>Tesla Tuner</span>
            </CommandItem>
            <CommandItem onSelect={() => console.log("Capital")}>
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Capital Matrix</span>
            </CommandItem>
            <CommandItem onSelect={() => console.log("Feedback")}>
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Feedback Loop</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => console.log("New Strategy")}>
              <Zap className="mr-2 h-4 w-4" />
              <span>New Strategy</span>
            </CommandItem>
            <CommandItem onSelect={() => console.log("Start Trading")}>
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Start Trading</span>
            </CommandItem>
            <CommandItem onSelect={() => console.log("Stop Trading")}>
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Stop Trading</span>
            </CommandItem>
            <CommandItem onSelect={() => console.log("Settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
