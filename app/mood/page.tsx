"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, Save, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface MoodEntry {
  date: string
  mood: number
  note?: string
}

const moodLabels = {
  1: "Terrible",
  2: "Muy Mal",
  3: "Mal",
  4: "Regular",
  5: "Normal",
  6: "Bien",
  7: "Muy Bien",
  8: "Genial",
  9: "Excelente",
  10: "Increíble",
}

const moodColors = {
  1: "bg-red-500",
  2: "bg-red-400",
  3: "bg-orange-500",
  4: "bg-orange-400",
  5: "bg-yellow-500",
  6: "bg-yellow-400",
  7: "bg-green-400",
  8: "bg-green-500",
  9: "bg-blue-500",
  10: "bg-purple-500",
}

export default function MoodTracker() {
  const [mood, setMood] = useState([5])
  const [note, setNote] = useState("")
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedMoodData = localStorage.getItem("mindtrack-mood")
    if (savedMoodData) {
      setMoodHistory(JSON.parse(savedMoodData))
    }
  }, [])

  const handleSubmit = async () => {
    setIsSubmitting(true)

    const newEntry: MoodEntry = {
      date: new Date().toISOString(),
      mood: mood[0],
      note: note.trim() || undefined,
    }

    const updatedHistory = [...moodHistory, newEntry]
    setMoodHistory(updatedHistory)
    localStorage.setItem("mindtrack-mood", JSON.stringify(updatedHistory))

    // Reiniciar formulario
    setMood([5])
    setNote("")
    setIsSubmitting(false)

    // Mostrar éxito y redirigir
    setTimeout(() => {
      router.push("/")
    }, 1000)
  }

  const todaysEntries = moodHistory.filter((entry) => new Date(entry.date).toDateString() === new Date().toDateString())

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 dark:from-gray-900 dark:to-gray-800">
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
              <Heart className="h-8 w-8 text-pink-600" />
              Registro de Estado de Ánimo
            </h1>
            <p className="text-gray-600 dark:text-gray-300">¿Cómo te sientes hoy?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de Registro de Ánimo */}
          <Card>
            <CardHeader>
              <CardTitle>Registra tu Estado de Ánimo</CardTitle>
              <CardDescription>Califica tu estado de ánimo actual del 1 (terrible) al 10 (increíble)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="mood-slider">Estado de Ánimo Actual: {mood[0]}/10</Label>
                <div className="space-y-4">
                  <Slider
                    id="mood-slider"
                    min={1}
                    max={10}
                    step={1}
                    value={mood}
                    onValueChange={setMood}
                    className="w-full"
                  />
                  <div className="flex justify-center">
                    <Badge className={`${moodColors[mood[0] as keyof typeof moodColors]} text-white px-4 py-2 text-lg`}>
                      {moodLabels[mood[0] as keyof typeof moodLabels]}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mood-note">Notas (Opcional)</Label>
                <Textarea
                  id="mood-note"
                  placeholder="¿Qué está influyendo en tu estado de ánimo hoy? ¿Algún pensamiento o sentimiento que quieras registrar?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                />
              </div>

              <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Guardando..." : "Guardar Registro"}
              </Button>
            </CardContent>
          </Card>

          {/* Registros de Hoy e Historial Reciente */}
          <div className="space-y-6">
            {/* Registros de Hoy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Registros de Hoy
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todaysEntries.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No hay registros de hoy</p>
                ) : (
                  <div className="space-y-3">
                    {todaysEntries.map((entry, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`${moodColors[entry.mood as keyof typeof moodColors]} text-white`}>
                            {entry.mood}/10 - {moodLabels[entry.mood as keyof typeof moodLabels]}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(entry.date).toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {entry.note && <p className="text-sm text-gray-700 dark:text-gray-300">{entry.note}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Historial Reciente */}
            <Card>
              <CardHeader>
                <CardTitle>Historial Reciente</CardTitle>
                <CardDescription>Tus registros de estado de ánimo de la semana pasada</CardDescription>
              </CardHeader>
              <CardContent>
                {moodHistory.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Comienza a registrar para ver tu historial</p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {moodHistory
                      .slice(-10)
                      .reverse()
                      .map((entry, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={`${moodColors[entry.mood as keyof typeof moodColors]} text-white`}>
                              {entry.mood}/10
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(entry.date).toLocaleDateString("es-ES", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          {entry.note && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{entry.note}</p>
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
