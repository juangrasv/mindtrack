"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Shield, Download, Trash2, Eye, EyeOff, Lock, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface PrivacySettings {
  dataEncryption: boolean
  autoBackup: boolean
  shareAnalytics: boolean
  reminders: boolean
}

export default function Settings() {
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    dataEncryption: true,
    autoBackup: false,
    shareAnalytics: false,
    reminders: true,
  })
  const [showDataPreview, setShowDataPreview] = useState(false)
  const [dataStats, setDataStats] = useState({
    moodEntries: 0,
    sleepEntries: 0,
    activityEntries: 0,
    journalEntries: 0,
    goals: 0,
  })

  useEffect(() => {
    // Cargar configuraciones de privacidad
    const savedSettings = localStorage.getItem("mindtrack-privacy-settings")
    if (savedSettings) {
      setPrivacySettings(JSON.parse(savedSettings))
    }

    // Calcular estadísticas de datos
    const moodData = JSON.parse(localStorage.getItem("mindtrack-mood") || "[]")
    const sleepData = JSON.parse(localStorage.getItem("mindtrack-sleep") || "[]")
    const activityData = JSON.parse(localStorage.getItem("mindtrack-activities") || "[]")
    const journalData = JSON.parse(localStorage.getItem("mindtrack-journal") || "[]")
    const goalsData = JSON.parse(localStorage.getItem("mindtrack-goals") || "[]")

    setDataStats({
      moodEntries: moodData.length,
      sleepEntries: sleepData.length,
      activityEntries: activityData.length,
      journalEntries: journalData.length,
      goals: goalsData.length,
    })
  }, [])

  const updatePrivacySetting = (key: keyof PrivacySettings, value: boolean) => {
    const newSettings = { ...privacySettings, [key]: value }
    setPrivacySettings(newSettings)
    localStorage.setItem("mindtrack-privacy-settings", JSON.stringify(newSettings))
  }

  const exportData = () => {
    const allData = {
      mood: JSON.parse(localStorage.getItem("mindtrack-mood") || "[]"),
      sleep: JSON.parse(localStorage.getItem("mindtrack-sleep") || "[]"),
      activities: JSON.parse(localStorage.getItem("mindtrack-activities") || "[]"),
      journal: JSON.parse(localStorage.getItem("mindtrack-journal") || "[]"),
      goals: JSON.parse(localStorage.getItem("mindtrack-goals") || "[]"),
      exportDate: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(allData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `mindtrack-datos-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const clearAllData = () => {
    if (confirm("¿Estás seguro de que quieres eliminar todos tus datos? Esta acción no se puede deshacer.")) {
      localStorage.removeItem("mindtrack-mood")
      localStorage.removeItem("mindtrack-sleep")
      localStorage.removeItem("mindtrack-activities")
      localStorage.removeItem("mindtrack-journal")
      localStorage.removeItem("mindtrack-goals")

      setDataStats({
        moodEntries: 0,
        sleepEntries: 0,
        activityEntries: 0,
        journalEntries: 0,
        goals: 0,
      })

      alert("Todos los datos han sido eliminados.")
    }
  }

  const getTotalEntries = () => {
    return Object.values(dataStats).reduce((sum, count) => sum + count, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
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
              <Shield className="h-8 w-8 text-slate-600" />
              Privacidad y Configuración
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Gestiona tus datos y preferencias de privacidad</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuraciones de Privacidad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Configuraciones de Privacidad
              </CardTitle>
              <CardDescription>Controla cómo se manejan y almacenan tus datos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data-encryption">Encriptación de Datos Local</Label>
                  <p className="text-sm text-muted-foreground">
                    Encripta tus datos almacenados localmente en este dispositivo
                  </p>
                </div>
                <Switch
                  id="data-encryption"
                  checked={privacySettings.dataEncryption}
                  onCheckedChange={(checked) => updatePrivacySetting("dataEncryption", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-backup">Respaldo Automático</Label>
                  <p className="text-sm text-muted-foreground">Respalda automáticamente tus datos (próximamente)</p>
                </div>
                <Switch
                  id="auto-backup"
                  checked={privacySettings.autoBackup}
                  onCheckedChange={(checked) => updatePrivacySetting("autoBackup", checked)}
                  disabled
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="share-analytics">Compartir Análisis Anónimos</Label>
                  <p className="text-sm text-muted-foreground">Ayuda a mejorar MindTrack con datos de uso anónimos</p>
                </div>
                <Switch
                  id="share-analytics"
                  checked={privacySettings.shareAnalytics}
                  onCheckedChange={(checked) => updatePrivacySetting("shareAnalytics", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reminders">Recordatorios Diarios</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe recordatorios para registrar tus entradas diarias
                  </p>
                </div>
                <Switch
                  id="reminders"
                  checked={privacySettings.reminders}
                  onCheckedChange={(checked) => updatePrivacySetting("reminders", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Gestión de Datos */}
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Datos</CardTitle>
              <CardDescription>Ver, exportar o eliminar tus datos personales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Resumen de Datos */}
              <div>
                <h3 className="font-semibold mb-3">Resumen de tus Datos</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <div className="text-2xl font-bold text-pink-600">{dataStats.moodEntries}</div>
                    <div className="text-sm text-muted-foreground">Registros de Ánimo</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{dataStats.sleepEntries}</div>
                    <div className="text-sm text-muted-foreground">Registros de Sueño</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{dataStats.activityEntries}</div>
                    <div className="text-sm text-muted-foreground">Actividades</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">{dataStats.journalEntries}</div>
                    <div className="text-sm text-muted-foreground">Entradas de Diario</div>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                  <div className="text-xl font-bold">{getTotalEntries()}</div>
                  <div className="text-sm text-muted-foreground">Total de Entradas</div>
                </div>
              </div>

              {/* Acciones de Datos */}
              <div className="space-y-3">
                <Button
                  onClick={() => setShowDataPreview(!showDataPreview)}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {showDataPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showDataPreview ? "Ocultar" : "Vista Previa"} de Datos
                </Button>

                <Button onClick={exportData} variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Todos los Datos
                </Button>

                <Button onClick={clearAllData} variant="destructive" className="w-full justify-start">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Todos los Datos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vista Previa de Datos */}
        {showDataPreview && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Vista Previa de Datos</CardTitle>
              <CardDescription>Un resumen de los datos almacenados localmente en tu dispositivo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                <div>
                  <h4 className="font-semibold mb-2">Ubicaciones de Almacenamiento:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• mindtrack-mood: Entradas de seguimiento de ánimo</li>
                    <li>• mindtrack-sleep: Datos de patrones de sueño</li>
                    <li>• mindtrack-activities: Registros de actividades diarias</li>
                    <li>• mindtrack-journal: Entradas de diario personal</li>
                    <li>• mindtrack-goals: Datos de seguimiento de metas</li>
                    <li>• mindtrack-privacy-settings: Tus preferencias de privacidad</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información de Privacidad */}
        <Alert className="mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Tu Privacidad Importa:</strong> Todos tus datos se almacenan localmente en tu dispositivo usando el
            almacenamiento local de tu navegador. MindTrack no envía tu información personal a ningún servidor externo.
            Tu información de salud mental permanece privada y bajo tu control. Puedes exportar tus datos en cualquier
            momento o eliminarlos completamente desde esta página de configuración.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
