"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BarChart, BookOpen, Dumbbell, Menu, Book, Download, Upload } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { toast } from "sonner"

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleExport = () => {
    const data = {
      shoulderExercises: localStorage.getItem("shoulderExercises"),
      hipExercises: localStorage.getItem("hipExercises"),
      kneeExercises: localStorage.getItem("kneeExercises"),
      wristElbowExercises: localStorage.getItem("wristElbowExercises"),
      ankleToesExercises: localStorage.getItem("ankleToesExercises"),
      scapulaExercises: localStorage.getItem("scapulaExercises"),
      exerciseCountdowns: localStorage.getItem("exerciseCountdowns"),
    }

    const blob = new Blob([JSON.stringify(data)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `range-balance-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Data exported successfully!")
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)

        // Validate the data structure
        const requiredKeys = [
          "shoulderExercises",
          "hipExercises",
          "kneeExercises",
          "wristElbowExercises",
          "ankleToesExercises",
          "scapulaExercises",
          "exerciseCountdowns",
        ]

        if (!requiredKeys.every((key) => key in data)) {
          throw new Error("Invalid data format")
        }

        // Import the data
        Object.entries(data).forEach(([key, value]) => {
          if (value) localStorage.setItem(key, value as string)
        })

        toast.success("Data imported successfully! Please refresh the page.")
      } catch (error) {
        toast.error("Error importing data. Please make sure the file is valid.")
      }
    }
    reader.readAsText(file)
    event.target.value = "" // Reset the input
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex h-[60px] items-center border-b px-6">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <Dumbbell className="h-6 w-6" />
          <span className="">Range Balance App</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="py-4">
          <SidebarLink href="/welcome" onClick={() => setIsMobileMenuOpen(false)}>
            Welcome To The Journey
          </SidebarLink>
        </div>
        <div className="space-y-4 py-4">
          <SidebarGroup title="Balance Overview" icon={BarChart}>
            <SidebarLink href="/scapula-balance" onClick={() => setIsMobileMenuOpen(false)}>
              Scapula Balance
            </SidebarLink>
            <SidebarLink href="/shoulder-balance" onClick={() => setIsMobileMenuOpen(false)}>
              Shoulder Balance
            </SidebarLink>
            <SidebarLink href="/hip-balance" onClick={() => setIsMobileMenuOpen(false)}>
              Hip Balance
            </SidebarLink>
            <SidebarLink href="/knee-balance" onClick={() => setIsMobileMenuOpen(false)}>
              Knee Balance
            </SidebarLink>
            <SidebarLink href="/wrist-elbow-balance" onClick={() => setIsMobileMenuOpen(false)}>
              Wrist & Elbow Balance
            </SidebarLink>
            <SidebarLink href="/ankle-toes-balance" onClick={() => setIsMobileMenuOpen(false)}>
              Ankle & Toes Balance
            </SidebarLink>
          </SidebarGroup>
          <SidebarGroup title="Definitions" icon={Book}>
            <SidebarLink href="/definitions/short-range" onClick={() => setIsMobileMenuOpen(false)}>
              Short Range
            </SidebarLink>
            <SidebarLink href="/definitions/long-range" onClick={() => setIsMobileMenuOpen(false)}>
              Long Range
            </SidebarLink>
            <SidebarLink href="/definitions/understanding-tension" onClick={() => setIsMobileMenuOpen(false)}>
              Understanding Tension
            </SidebarLink>
            <SidebarLink href="/definitions/tension-levels" onClick={() => setIsMobileMenuOpen(false)}>
              Tension Levels
            </SidebarLink>
            <SidebarLink href="/definitions/the-range-scale" onClick={() => setIsMobileMenuOpen(false)}>
              The Range Scale
            </SidebarLink>
          </SidebarGroup>
          <SidebarGroup title="Newsletters" icon={BookOpen}>
            <SidebarLink href="/theory/understanding-range-training" onClick={() => setIsMobileMenuOpen(false)}>
              Understanding Range Training
            </SidebarLink>
            <SidebarLink href="/theory/range-balance" onClick={() => setIsMobileMenuOpen(false)}>
              Range Balance
            </SidebarLink>
            <SidebarLink href="/theory/how-to-get-good-adaptation" onClick={() => setIsMobileMenuOpen(false)}>
              Adaptation Mastery
            </SidebarLink>
          </SidebarGroup>
        </div>
        <div className="p-4 border-t">
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => document.getElementById("import-data")?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Import Data
            </Button>
            <input type="file" id="import-data" className="hidden" accept=".json" onChange={handleImport} />
          </div>
        </div>
      </ScrollArea>
    </div>
  )

  return (
    <>
      <div className="hidden lg:block border-r bg-gray-100/40 dark:bg-gray-800/40 sidebar-nordic w-64">
        <SidebarContent />
      </div>
      <div className="lg:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-auto">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

function SidebarGroup({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center px-3 py-2 text-sm font-semibold">
        <Icon className="mr-2 h-4 w-4" />
        <span>{title}</span>
      </div>
      <div className="ml-4 space-y-1">{children}</div>
    </div>
  )
}

function SidebarLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href} passHref>
      <Button
        variant="ghost"
        className={cn("w-full justify-start sidebar-link text-sm", isActive && "bg-gray-200 dark:bg-gray-700")}
        onClick={onClick}
      >
        {children}
      </Button>
    </Link>
  )
}

