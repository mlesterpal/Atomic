import type { SpiritualCategory } from "../entities/response/SpiritualCategory"
import { axiosInstance } from "./apiClient"

export const getAllSpiritualCategories = async (): Promise<SpiritualCategory[]> => {
  const response = await axiosInstance.get<SpiritualCategory[]>("/spiritual/categories")
  return response.data
}

