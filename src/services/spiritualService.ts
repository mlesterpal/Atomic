import type { SpiritualCategory } from "../entities/response/SpiritualCategory"
import type { SpiritualNotesByCategories } from "../entities/response/SpiritualNotesByCategories"
import { axiosInstance } from "./apiClient"

export type AddSpiritualNoteRequest = {
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
  categoryId: number | null
): Promise<SpiritualNotesByCategories[]> => {
  const response = await axiosInstance.get<SpiritualNotesByCategories[]>("/spiritual/notes", {
    params: categoryId ? { categoryId } : undefined,
  })
  return response.data
}

export const deleteSpiritualNote = async (noteId: number): Promise<void> => {
  await axiosInstance.delete(`/spiritual/note/${noteId}`)
}

export const addSpiritualNote = async (payload: AddSpiritualNoteRequest): Promise<void> => {
  await axiosInstance.post("/spiritual/note", payload)
}

