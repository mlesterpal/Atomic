import type { SpiritualCategory } from "../entities/response/SpiritualCategory"
import type { SpiritualNotesByCategories } from "../entities/response/SpiritualNotesByCategories"
import { axiosInstance } from "./apiClient"

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

