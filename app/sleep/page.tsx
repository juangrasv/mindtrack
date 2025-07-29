"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Moon, Save, Clock, Star } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SleepEntry {
  date: string
  bedtime: string
  wakeTime: string
  hours: number
  quality: number
  notes?: string
}

const qualityLabels = {
  1: "Muy Mala",
  2: "Mala",
  3: "Regular",
  4: "Buena",
  5: "Excelente",
}

const qualityColors = {
  1: "bg-red-500",
  2: "bg-orange-500",
  3: "bg-yellow-500",
  4: "bg-green-500",
  5: "bg-blue-500",
}

export default function SleepTracker() {
  const [bedtime, setBedtime] = useState("")
  const [wakeTime, setWakeTime] = useState("")
  const [quality, setQuality] = useState([3])
  const [notes, setNotes] = useState("")
  const [sleepHistory, setSleepHistory] = useState<SleepEntry[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedSleepData = localStorage.getItem("mindtrack-sleep")
    if (savedSleepData) {
      setSleepHistory(JSON.parse(savedSleepData))
    }
  }, [])

  const calculateSleepHours = (bedtime: string, wakeTime: string) => {
    if (!bedtime || !wakeTime) return 0

    const bed = new Date(`2000-01-01 ${bedtime}`)
    let wake = new Date(`2000-01-01 ${wakeTime}`)

    // Si la hora de despertar es anterior a la de dormir, asumir que es el día siguiente
    if (wake < bed) {
      wake = new Date(`2000-01-02 ${wakeTime}`)
    }

    const diffMs = wake.getTime() - bed.getTime()
    return Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10
  }

  const sleepHours = calculateSleepHours(bedtime, wakeTime)

  const handleSubmit = async () => {
    if (!bedtime || !wakeTime) return

    setIsSubmitting(true)

    const newEntry: SleepEntry = {
      date: new Date().toISOString(),
      bedtime,
      wakeTime,
      hours: sleepHours,
      quality: quality[0],
      notes: notes.trim() || undefined,
    }

    const updatedHistory = [...sleepHistory, newEntry]
    setSleepHistory(updatedHistory)
    localStorage.setItem("mindtrack-sleep", JSON.stringify(updatedHistory))

    // Reiniciar formulario
    setBedtime("")
    setWakeTime("")
    setQuality([3])
    setNotes("")
    setIsSubmitting(false)

    setTimeout(() => {
      router.push("/")
    }, 1000)
  }

  const getAverageSleep = () => {
    if (sleepHistory.length === 0) return 0
    const total = sleepHistory.reduce((sum, entry) => sum + entry.hours, 0)
    return Math.round((total / sleepHistory.length) * 10) / 10
  }

  const getAverageQuality = () => {
    if (sleepHistory.length === 0) return 0
    const total = sleepHistory.reduce((sum, entry) => sum + entry.quality, 0)
    return Math.round((total / sleepHistory.length) * 10) / 10
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
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
              <Moon className="h-8 w-8 text-blue-600" />
              Registro de Sueño
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Registra tus patrones y calidad de sueño</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de Registro de Sueño */}
          <Card>
            <CardHeader>
              <CardTitle>Registrar Datos de Sueño</CardTitle>
              <CardDescription>Anota cuándo te acostaste y cuándo despertaste</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedtime">Hora de Dormir</Label>
                  <Input id="bedtime" type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wake-time">Hora de Despertar</Label>
                  <Input id="wake-time" type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
                </div>
              </div>

              {sleepHours > 0 && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Clock className="h-5 w-5" />
                    Total de Sueño: {sleepHours} horas
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <Label>Calidad del Sueño: {quality[0]}/5</Label>
                <Slider min={1} max={5} step={1} value={quality} onValueChange={setQuality} className="w-full" />
                <div className="flex justify-center">
                  <Badge className={`${qualityColors[quality[0] as keyof typeof qualityColors]} text-white px-4 py-2`}>
                    {qualityLabels[quality[0] as keyof typeof qualityLabels]}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sleep-notes">Notas (Opcional)</Label>
                <Input
                  id="sleep-notes"
                  placeholder="¿Cómo dormiste? ¿Algún factor que afectó tu sueño?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <Button onClick={handleSubmit} disabled={isSubmitting || !bedtime || !wakeTime} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Guardando..." : "Guardar Registro de Sueño"}
              </Button>
            </CardContent>
          </Card>

          {/* Estadísticas e Historial de Sueño */}
          <div className="space-y-6">
            {/* Estadísticas de Sueño */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Estadísticas de Sueño
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{getAverageSleep()}h</div>
                    <div className="text-sm text-muted-foreground">Promedio de Sueño</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{getAverageQuality()}/5</div>
                    <div className="text-sm text-muted-foreground">Calidad Promedio</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historial Reciente */}
            <Card>
              <CardHeader>
                <CardTitle>Historial de Sueño Reciente</CardTitle>
                <CardDescription>Tus patrones de sueño de las noches recientes</CardDescription>
              </CardHeader>
              <CardContent>
                {sleepHistory.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Comienza a registrar para ver tu historial</p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {sleepHistory
                      .slice(-7)
                      .reverse()
                      .map((entry, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{entry.hours}h</Badge>
                              <Badge
                                className={`${qualityColors[entry.quality as keyof typeof qualityColors]} text-white`}
                              >
                                Calidad: {entry.quality}/5
                              </Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(entry.date).toLocaleDateString("es-ES", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {entry.bedtime} - {entry.wakeTime}
                          </div>
                          {entry.notes && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{entry.notes}</p>
                          )}
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
