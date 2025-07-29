"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, Phone, Globe, Shield, ExternalLink } from "lucide-react"
import Link from "next/link"

const crisisResources = [
  {
    name: "Salud Responde",
    phone: "600 360 7777",
    description: "Apoyo en crisis 24/7 para personas en crisis suicida o angustia emocional",
    available: "24/7",
  },
  {
    name: "Línea de Prevención del Suicidio",
    phone: "4141",
    description: "Apoyo gratuito en crisis 24/7 vía telefónica",
    available: "24/7",
  },
  {
    name: "MindTrack",
    phone: "12345678",
    description: "Orientación y apoyo",
    available: "24/7",
  },
]

const onlineResources = [
  {
    name: "National Institute of Mental Health",
    url: "https://www.nimh.nih.gov/health/topics/",
    description: "Información general sobre salud mental",
    category: "General",
  },
  {
    name: "Confederación Salud Mental España",
    url: "https://consaludmental.org",
    description: "Grupos de apoyo, educación y defensa para la salud mental",
    category: "Apoyo",
  },
  {
    name: "Asociación de Ansiedad y Depresión",
    url: "https://adaa.org",
    description: "Recursos específicamente para ansiedad y depresión",
    category: "Ansiedad/Depresión",
  },
  {
    name: "Headspace",
    url: "https://headspace.com",
    description: "App de meditación y mindfulness con sesiones guiadas",
    category: "Mindfulness",
  },
  {
    name: "Calm",
    url: "https://calm.com",
    description: "Historias para dormir, meditación y técnicas de relajación",
    category: "Mindfulness",
  },
  {
    name: "7 Cups",
    url: "https://7cups.com",
    description: "Apoyo emocional gratuito y terapia en línea",
    category: "Apoyo",
  },
]

const selfCareActivities = [
  {
    category: "Mindfulness",
    activities: [
      "Ejercicios de respiración profunda",
      "Relajación muscular progresiva",
      "Caminata consciente",
      "Meditación de escaneo corporal",
      "Diario de gratitud",
    ],
  },
  {
    category: "Físico",
    activities: [
      "Rutina de ejercicio regular",
      "Yoga o estiramientos",
      "Obtener sueño adecuado",
      "Comer comidas nutritivas",
      "Tomar baños tibios",
    ],
  },
  {
    category: "Social",
    activities: [
      "Conectar con amigos",
      "Unirse a grupos de apoyo",
      "Hacer voluntariado",
      "Pasar tiempo con mascotas",
      "Participar en actividades comunitarias",
    ],
  },
  {
    category: "Creativo",
    activities: [
      "Arte o dibujo",
      "Escribir o llevar un diario",
      "Tocar música",
      "Proyectos de manualidades o bricolaje",
      "Fotografía",
    ],
  },
]

const warningSignsData = [
  "Tristeza persistente o desesperanza",
  "Pérdida de interés en actividades que antes disfrutabas",
  "Cambios significativos en el apetito o patrones de sueño",
  "Dificultad para concentrarse o tomar decisiones",
  "Sentimientos de inutilidad o culpa excesiva",
  "Pensamientos de muerte o suicidio",
  "Aumento del uso de alcohol o drogas",
  "Aislamiento de amigos y familia",
  "Cambios extremos de humor",
  "Incapacidad para lidiar con actividades diarias",
]

export default function Resources() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-gray-900 dark:to-gray-800">
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
              <Heart className="h-8 w-8 text-emerald-600" />
              Recursos de Salud Mental
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Apoyo, herramientas e información para tu bienestar mental
            </p>
          </div>
        </div>

        {/* Recursos de Crisis */}
        <Card className="mb-8 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-800 dark:text-red-200 flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Apoyo en Crisis - Obtén Ayuda Ahora
            </CardTitle>
            <CardDescription className="text-red-700 dark:text-red-300">
              Si estás en crisis o tienes pensamientos de autolesión, por favor busca ayuda inmediatamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {crisisResources.map((resource, index) => (
                <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">{resource.name}</h3>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">{resource.phone}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{resource.description}</p>
                  <Badge variant="outline" className="text-red-600 border-red-600">
                    {resource.available}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recursos en Línea */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Recursos en Línea y Apps
              </CardTitle>
              <CardDescription>Sitios web y aplicaciones útiles para apoyo en salud mental</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {onlineResources.map((resource, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{resource.name}</h3>
                      <Badge variant="secondary">{resource.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                    <Button variant="outline" size="sm" asChild>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visitar Sitio
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actividades de Autocuidado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Actividades de Autocuidado
              </CardTitle>
              <CardDescription>Estrategias saludables de afrontamiento y actividades de bienestar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selfCareActivities.map((category, index) => (
                  <div key={index}>
                    <h3 className="font-semibold mb-2 text-emerald-700 dark:text-emerald-300">{category.category}</h3>
                    <ul className="space-y-1 ml-4">
                      {category.activities.map((activity, actIndex) => (
                        <li key={actIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Señales de Advertencia */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Cuándo Buscar Ayuda Profesional
            </CardTitle>
            <CardDescription>
              Reconocer señales de advertencia que indican que puede ser momento de contactar a un profesional de salud
              mental
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">Señales de Advertencia:</h3>
                <ul className="space-y-2">
                  {warningSignsData.map((sign, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      {sign}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Recuerda:</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Buscar ayuda es una señal de fortaleza, no de debilidad. Los profesionales de salud mental están
                    capacitados para ayudarte a desarrollar estrategias de afrontamiento y superar desafíos.
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Tipos de Ayuda:</h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• Terapeutas y consejeros</li>
                    <li>• Psiquiatras para medicación</li>
                    <li>• Grupos de apoyo</li>
                    <li>• Programas de asistencia al empleado</li>
                    <li>• Centros comunitarios de salud mental</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Descargo de Responsabilidad */}
        <Card className="mt-8 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Descargo de responsabilidad:</strong> MindTrack es una herramienta de seguimiento personal y no
              sustituye el consejo médico profesional, diagnóstico o tratamiento. Siempre busca el consejo de
              proveedores de salud calificados con cualquier pregunta que puedas tener sobre una condición médica. Si
              estás experimentando una emergencia de salud mental, por favor contacta servicios de emergencia o una
              línea de crisis inmediatamente.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
