"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Brain, Moon, Activity, Target, BookOpen, Heart, TrendingUp } from "lucide-react"
import Link from "next/link"

interface MoodEntry {
  date: string
  mood: number
  note?: string
}

interface SleepEntry {
  date: string
  hours: number
  quality: number
}

interface ActivityEntry {
  date: string
  activity: string
  duration: number
  enjoyment: number
}

export default function Dashboard() {
  const [moodData, setMoodData] = useState<MoodEntry[]>([])
  const [sleepData, setSleepData] = useState<SleepEntry[]>([])
  const [activityData, setActivityData] = useState<ActivityEntry[]>([])

  useEffect(() => {
    // Cargar datos del localStorage
    const savedMoodData = localStorage.getItem("mindtrack-mood")
    const savedSleepData = localStorage.getItem("mindtrack-sleep")
    const savedActivityData = localStorage.getItem("mindtrack-activities")

    if (savedMoodData) setMoodData(JSON.parse(savedMoodData))
    if (savedSleepData) setSleepData(JSON.parse(savedSleepData))
    if (savedActivityData) setActivityData(JSON.parse(savedActivityData))
  }, [])

  const getMoodAverage = () => {
    if (moodData.length === 0) return 0
    return Math.round(moodData.reduce((sum, entry) => sum + entry.mood, 0) / moodData.length)
  }

  const getSleepAverage = () => {
    if (sleepData.length === 0) return 0
    return Math.round((sleepData.reduce((sum, entry) => sum + entry.hours, 0) / sleepData.length) * 10) / 10
  }

  const getRecentMoodTrend = () => {
    if (moodData.length < 2) return "estable"
    const recent = moodData.slice(-7)
    const firstHalf = recent.slice(0, Math.ceil(recent.length / 2))
    const secondHalf = recent.slice(Math.ceil(recent.length / 2))

    const firstAvg = firstHalf.reduce((sum, entry) => sum + entry.mood, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, entry) => sum + entry.mood, 0) / secondHalf.length

    if (secondAvg > firstAvg + 0.5) return "mejorando"
    if (secondAvg < firstAvg - 0.5) return "declinando"
    return "estable"
  }

  const chartData = moodData.slice(-7).map((entry) => ({
    date: new Date(entry.date).toLocaleDateString("es-ES", { weekday: "short" }),
    mood: entry.mood,
  }))

  const sleepChartData = sleepData.slice(-7).map((entry) => ({
    date: new Date(entry.date).toLocaleDateString("es-ES", { weekday: "short" }),
    hours: entry.hours,
    quality: entry.quality,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Encabezado */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">MindTrack</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Tu compañero personal de salud mental</p>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado de Ánimo Promedio</CardTitle>
              <Heart className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getMoodAverage()}/10</div>
              <Badge
                variant={
                  getRecentMoodTrend() === "mejorando"
                    ? "default"
                    : getRecentMoodTrend() === "declinando"
                      ? "destructive"
                      : "secondary"
                }
              >
                {getRecentMoodTrend()}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio de Sueño</CardTitle>
              <Moon className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getSleepAverage()}h</div>
              <p className="text-xs text-muted-foreground">Últimos 7 días</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actividades</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activityData.length}</div>
              <p className="text-xs text-muted-foreground">Total registradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Racha</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">Días registrando</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia del Estado de Ánimo</CardTitle>
              <CardDescription>Tu estado de ánimo en los últimos 7 días</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  mood: {
                    label: "Estado de Ánimo",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[1, 10]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="mood" stroke="var(--color-mood)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Patrón de Sueño</CardTitle>
              <CardDescription>Horas de sueño y calidad</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  hours: {
                    label: "Horas",
                    color: "hsl(var(--chart-2))",
                  },
                  quality: {
                    label: "Calidad",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sleepChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="hours" fill="var(--color-hours)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/mood">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <Heart className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Registrar Ánimo</h3>
                  <p className="text-sm text-muted-foreground">Anota tu estado actual</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/sleep">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <Moon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Registrar Sueño</h3>
                  <p className="text-sm text-muted-foreground">Anota datos de sueño</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/activities">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Añadir Actividad</h3>
                  <p className="text-sm text-muted-foreground">Registra actividades diarias</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/journal">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Diario</h3>
                  <p className="text-sm text-muted-foreground">Escribe tus pensamientos</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Navegación */}
        <Card>
          <CardHeader>
            <CardTitle>Explora MindTrack</CardTitle>
            <CardDescription>Accede a todas las funciones para apoyar tu bienestar mental</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/goals">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Target className="h-4 w-4 mr-2" />
                  Metas y Progreso
                </Button>
              </Link>
              <Link href="/resources">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Heart className="h-4 w-4 mr-2" />
                  Recursos de Salud Mental
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Brain className="h-4 w-4 mr-2" />
                  Privacidad y Configuración
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
