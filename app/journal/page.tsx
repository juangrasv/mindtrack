"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Save, Search, Calendar, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface JournalEntry {
  id: string
  date: string
  title: string
  content: string
  mood?: number
  tags: string[]
}

export default function Journal() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const savedJournalData = localStorage.getItem("mindtrack-journal")
    if (savedJournalData) {
      setJournalEntries(JSON.parse(savedJournalData))
    }
  }, [])

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return

    setIsSubmitting(true)

    const entry: JournalEntry = {
      id: editingEntry?.id || Date.now().toString(),
      date: editingEntry?.date || new Date().toISOString(),
      title: title.trim(),
      content: content.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    }

    let updatedEntries
    if (editingEntry) {
      updatedEntries = journalEntries.map((e) => (e.id === editingEntry.id ? entry : e))
    } else {
      updatedEntries = [entry, ...journalEntries]
    }

    setJournalEntries(updatedEntries)
    localStorage.setItem("mindtrack-journal", JSON.stringify(updatedEntries))

    // Reiniciar formulario
    setTitle("")
    setContent("")
    setTags("")
    setEditingEntry(null)
    setIsSubmitting(false)
  }

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry)
    setTitle(entry.title)
    setContent(entry.content)
    setTags(entry.tags.join(", "))
  }

  const handleDelete = (entryId: string) => {
    const updatedEntries = journalEntries.filter((entry) => entry.id !== entryId)
    setJournalEntries(updatedEntries)
    localStorage.setItem("mindtrack-journal", JSON.stringify(updatedEntries))
  }

  const cancelEdit = () => {
    setEditingEntry(null)
    setTitle("")
    setContent("")
    setTags("")
  }

  const filteredEntries = journalEntries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
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
              <BookOpen className="h-8 w-8 text-purple-600" />
              Diario Personal
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Expresa tus pensamientos y reflexiona sobre tu día</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de Entrada del Diario */}
          <Card>
            <CardHeader>
              <CardTitle>{editingEntry ? "Editar Entrada" : "Nueva Entrada del Diario"}</CardTitle>
              <CardDescription>
                {editingEntry
                  ? "Actualiza tu entrada del diario"
                  : "Escribe sobre tus pensamientos, sentimientos y experiencias"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="entry-title">Título</Label>
                <Input
                  id="entry-title"
                  placeholder="Dale un título a tu entrada..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry-content">Contenido</Label>
                <Textarea
                  id="entry-content"
                  placeholder="¿Qué tienes en mente hoy? ¿Cómo te sientes? ¿Qué pasó que fue significativo?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry-tags">Etiquetas (Opcional)</Label>
                <Input
                  id="entry-tags"
                  placeholder="trabajo, familia, ansiedad, gratitud (separar con comas)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Guardando..." : editingEntry ? "Actualizar Entrada" : "Guardar Entrada"}
                </Button>
                {editingEntry && (
                  <Button variant="outline" onClick={cancelEdit}>
                    Cancelar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Historial del Diario */}
          <div className="space-y-6">
            {/* Búsqueda */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar en tus entradas del diario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lista de Entradas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Tus Entradas ({filteredEntries.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredEntries.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    {searchTerm
                      ? "No hay entradas que coincidan con tu búsqueda"
                      : "Comienza a escribir para ver tus entradas aquí"}
                  </p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredEntries.map((entry) => (
                      <div key={entry.id} className="p-4 bg-muted rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{entry.title}</h3>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)} className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(entry.id)}
                              className="h-8 w-8 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {new Date(entry.date).toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>

                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">{entry.content}</p>

                        {entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
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
