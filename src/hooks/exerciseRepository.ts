import { useMutation, useQuery } from "@tanstack/react-query"
import {
  addExerciseRecord,
  getBestExerciseRecords,
  getBestLiftsByMuscleGroup,
  getAllExerciseCategories,
  getRecentExerciseRecords,
  type AddExerciseRecordRequest,
} from "../services/exerciseService"

export const useGetAllExerciseCategories = () => {
  return useQuery({
    queryKey: ["exercise", "categories"],
    queryFn: getAllExerciseCategories,
  })
}

export const useAddExerciseRecord = () => {
  return useMutation({
    mutationFn: (payload: AddExerciseRecordRequest) => addExerciseRecord(payload),
  })
}

export const useGetBestExerciseRecords = () => {
  return useQuery({
    queryKey: ["exercise", "best-records"],
    queryFn: getBestExerciseRecords,
  })
}

export const useGetRecentExerciseRecords = () => {
  return useQuery({
    queryKey: ["exercise", "records", "recent"],
    queryFn: getRecentExerciseRecords,
  })
}

export const useGetBestLiftsByMuscleGroup = () => {
  return useQuery({
    queryKey: ["exercise", "best-lifts"],
    queryFn: getBestLiftsByMuscleGroup,
  })
}

