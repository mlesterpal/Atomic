import type { ExerciseCategory } from "../entities/response/ExerciseCategory"
import { axiosInstance } from "./apiClient"

export const getAllExerciseCategories = async (): Promise<ExerciseCategory[]> => {
  const response = await axiosInstance.get<ExerciseCategory[]>("/exercise/categories")
  return response.data
}

export type AddExerciseRecordRequest = {
  categoryId: number
  recordDate: string
  primaryLabel: string
  primaryValue: string
  secondaryLabel: string
  secondaryValue: string
}

export const addExerciseRecord = async (payload: AddExerciseRecordRequest): Promise<number> => {
  const response = await axiosInstance.post<{ id: number }>("/exercise/record", payload)
  return response.data.id
}

