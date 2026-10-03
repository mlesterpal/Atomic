import type { ExerciseCategory } from "../entities/response/ExerciseCategory"
import { axiosInstance } from "./apiClient"

export const getAllExerciseCategories = async (): Promise<ExerciseCategory[]> => {
  const response = await axiosInstance.get<ExerciseCategory[]>("/exercise/categories")
  return response.data
}

