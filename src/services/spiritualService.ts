import type { SpiritualCategory } from "../entities/response/SpiritualCategory"
import type { SpiritualNotesByCategories } from "../entities/response/SpiritualNotesByCategories"
import { axiosInstance } from "./apiClient"

export type AddSpiritualNoteRequest = {
  categoryId: number
  title: string
  notes?: string | null
  createdAt?: string | null
}

export type UpdateSpiritualNoteRequest = {
  categoryId: number
  title: string
  notes?: string | null
  createdAt?: string | null
}

export const getAllSpiritualCategories = async (): Promise<SpiritualCategory[]> => {
  const response = await axiosInstance.get<SpiritualCategory[]>("/spiritual/categories")
  return response.data
}

export const getSpiritualNotesByCategory = async (
  categoryId: number | null,
  beforeDate?: string | null
): Promise<SpiritualNotesByCategories[]> => {
  const params: Record<string, unknown> = {}
  if (categoryId) params.categoryId = categoryId
  if (beforeDate) params.beforeDate = beforeDate

  const response = await axiosInstance.get<SpiritualNotesByCategories[]>("/spiritual/notes", {
    params: Object.keys(params).length ? params : undefined,
  })
  return response.data
}

export const deleteSpiritualNote = async (noteId: number): Promise<void> => {
  await axiosInstance.delete(`/spiritual/note/${noteId}`)
}

export const addSpiritualNote = async (payload: AddSpiritualNoteRequest): Promise<void> => {
  await axiosInstance.post("/spiritual/note", payload)
}

export const updateSpiritualNote = async (
  noteId: number,
  payload: UpdateSpiritualNoteRequest
): Promise<void> => {
  await axiosInstance.put(`/spiritual/note/${noteId}`, payload)
}

