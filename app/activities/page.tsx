"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Activity, Save, Clock, Smile } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ActivityEntry {
  date: string
  activity: string
  category: string
  duration: number
  enjoyment: number
  notes?: string
}

const activityCategories = [
  "Ejercicio",
  "Social",
  "Creativo",
  "Trabajo",
  "Relajación",
  "Pasatiempos",
  "Aprendizaje",
  "Aire Libre",
  "Autocuidado",
  "Otro",
]

const enjoymentLabels = {
  1: "Nada Agradable",
  2: "Poco Agradable",
  3: "Moderadamente Agradable",
  4: "Muy Agradable",
  5: "Extremadamente Agradable",
}

const enjoymentColors = {
  1: "bg-red-500",
  2: "bg-orange-500",
  3: "bg-yellow-500",
  4: "bg-green-500",
  5: "bg-blue-500",
}

const categoryColors: { [key: string]: string } = {
  Ejercicio: "bg-red-100 text-red-800",
  Social: "bg-blue-100 text-blue-800",
  Creativo: "bg-purple-100 text-purple-800",
  Trabajo: "bg-gray-100 text-gray-800",
  Relajación: "bg-green-100 text-green-800",
  Pasatiempos: "bg-yellow-100 text-yellow-800",
  Aprendizaje: "bg-indigo-100 text-indigo-800",
  "Aire Libre": "bg-emerald-100 text-emerald-800",
  Autocuidado: "bg-pink-100 text-pink-800",
  Otro: "bg-slate-100 text-slate-800",
}

export default function ActivityTracker() {
  const [activity, setActivity] = useState("")
  const [category, setCategory] = useState("")
  const [duration, setDuration] = useState("")
  const [enjoyment, setEnjoyment] = useState([3])
  const [notes, setNotes] = useState("")
  const [activityHistory, setActivityHistory] = useState<ActivityEntry[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedActivityData = localStorage.getItem("mindtrack-activities")
    if (savedActivityData) {
      setActivityHistory(JSON.parse(savedActivityData))
    }
  }, [])

  const handleSubmit = async () => {
    if (!activity || !category || !duration) return

    setIsSubmitting(true)

    const newEntry: ActivityEntry = {
      date: new Date().toISOString(),
      activity,
      category,
      duration: Number.parseInt(duration),
      enjoyment: enjoyment[0],
      notes: notes.trim() || undefined,
    }

    const updatedHistory = [...activityHistory, newEntry]
    setActivityHistory(updatedHistory)
    localStorage.setItem("mindtrack-activities", JSON.stringify(updatedHistory))

    // Reiniciar formulario
    setActivity("")
    setCategory("")
    setDuration("")
    setEnjoyment([3])
    setNotes("")
    setIsSubmitting(false)

    setTimeout(() => {
      router.push("/")
    }, 1000)
  }

  const getTotalTimeToday = () => {
    const today = new Date().toDateString()
    return activityHistory
      .filter((entry) => new Date(entry.date).toDateString() === today)
      .reduce((total, entry) => total + entry.duration, 0)
  }

  const getMostEnjoyableCategory = () => {
    if (activityHistory.length === 0) return null

    const categoryScores: { [key: string]: { total: number; count: number } } = {}

    activityHistory.forEach((entry) => {
      if (!categoryScores[entry.category]) {
        categoryScores[entry.category] = { total: 0, count: 0 }
      }
      categoryScores[entry.category].total += entry.enjoyment
      categoryScores[entry.category].count += 1
    })

    let bestCategory = ""
    let bestScore = 0

    Object.entries(categoryScores).forEach(([cat, data]) => {
      const average = data.total / data.count
      if (average > bestScore) {
        bestScore = average
        bestCategory = cat
      }
    })

    return bestCategory
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Encabezado */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="h-8 w-8 text-green-600" />
              Registro de Actividades
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Registra tus actividades diarias y cuánto las disfrutaste
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de Registro de Actividad */}
          <Card>
            <CardHeader>
              <CardTitle>Registrar Actividad</CardTitle>
              <CardDescription>Anota lo que hiciste y cómo te hizo sentir</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="activity-name">Actividad</Label>
                <Input
                  id="activity-name"
                  placeholder="ej. Trotar por la mañana, Leer, Cocinar cena"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-category">Categoría</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duración (minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="30"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  min="1"
                />
              </div>

              <div className="space-y-4">
                <Label>Nivel de Disfrute: {enjoyment[0]}/5</Label>
                <Slider min={1} max={5} step={1} value={enjoyment} onValueChange={setEnjoyment} className="w-full" />
                <div className="flex justify-center">
                  <Badge
                    className={`${enjoymentColors[enjoyment[0] as keyof typeof enjoymentColors]} text-white px-4 py-2`}
                  >
                    {enjoymentLabels[enjoyment[0] as keyof typeof enjoymentLabels]}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-notes">Notas (Opcional)</Label>
                <Input
                  id="activity-notes"
                  placeholder="¿Algún pensamiento adicional sobre esta actividad?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !activity || !category || !duration}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Guardando..." : "Guardar Actividad"}
              </Button>
            </CardContent>
          </Card>

          {/* Estadísticas e Historial de Actividades */}
          <div className="space-y-6">
            {/* Resumen de Hoy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Resumen de Hoy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{getTotalTimeToday()}</div>
                    <div className="text-sm text-muted-foreground">Minutos Activos</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{getMostEnjoyableCategory() || "N/A"}</div>
                    <div className="text-sm text-muted-foreground">Categoría Favorita</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actividades Recientes */}
            <Card>
              <CardHeader>
                <CardTitle>Actividades Recientes</CardTitle>
                <CardDescription>Tus últimas actividades registradas</CardDescription>
              </CardHeader>
              <CardContent>
                {activityHistory.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Comienza a registrar actividades para ver tu historial
                  </p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {activityHistory
                      .slice(-10)
                      .reverse()
                      .map((entry, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className={categoryColors[entry.category]}>{entry.category}</Badge>
                              <Badge variant="outline">{entry.duration}min</Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(entry.date).toLocaleDateString("es-ES", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="font-medium mb-1">{entry.activity}</div>
                          <div className="flex items-center gap-2 mb-1">
                            <Smile className="h-4 w-4" />
                            <Badge
                              className={`${enjoymentColors[entry.enjoyment as keyof typeof enjoymentColors]} text-white text-xs`}
                            >
                              {entry.enjoyment}/5
                            </Badge>
                          </div>
                          {entry.notes && <p className="text-sm text-gray-700 dark:text-gray-300">{entry.notes}</p>}
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
