"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heart, Moon, Activity, BookOpen, Target, Shield, Home } from "lucide-react"

const navigationItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/mood", label: "Ánimo", icon: Heart },
  { href: "/sleep", label: "Sueño", icon: Moon },
  { href: "/activities", label: "Actividades", icon: Activity },
  { href: "/journal", label: "Diario", icon: BookOpen },
  { href: "/goals", label: "Metas", icon: Target },
  { href: "/settings", label: "Configuración", icon: Shield },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:hidden">
      <div className="flex justify-around items-center py-2">
        {navigationItems.slice(0, 5).map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button variant={isActive ? "default" : "ghost"} size="sm" className="flex flex-col h-auto py-2 px-3">
                <Icon className="h-4 w-4 mb-1" />
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
