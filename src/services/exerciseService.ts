import type { ExerciseCategory } from "../entities/response/ExerciseCategory"
import type { BestExerciseRecord } from "../entities/response/BestExerciseRecord"
import type { BestLiftByMuscleGroup } from "../entities/response/BestLiftByMuscleGroup"
import type { ExerciseRecordResponse } from "../entities/response/ExerciseRecordResponse"
import { axiosInstance } from "./apiClient"

export const getAllExerciseCategories = async (): Promise<ExerciseCategory[]> => {
  const response = await axiosInstance.get<ExerciseCategory[]>("/exercise/categories")
  return response.data
}

export type AddExerciseRecordRequest = {
  categoryId: number
  recordDate: string
  liftingCategoryId?: number | null
  primaryLabel: string
  primaryValue: string
  secondaryLabel: string
  secondaryValue: string
}

export const addExerciseRecord = async (payload: AddExerciseRecordRequest): Promise<number> => {
  const response = await axiosInstance.post<{ id: number }>("/exercise/record", payload)
  return response.data.id
}

export const getBestExerciseRecords = async (): Promise<BestExerciseRecord[]> => {
  const response = await axiosInstance.get<BestExerciseRecord[]>("/exercise/best-records")
  return response.data
}

export const getRecentExerciseRecords = async (): Promise<ExerciseRecordResponse[]> => {
  const response = await axiosInstance.get<ExerciseRecordResponse[]>("/exercise/records")
  return response.data
}

export const getBestLiftsByMuscleGroup = async (): Promise<BestLiftByMuscleGroup[]> => {
  const response = await axiosInstance.get<BestLiftByMuscleGroup[]>("/exercise/best-lifts")
  return response.data
}

