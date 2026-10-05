import { useMutation, useQuery } from "@tanstack/react-query"
import {
  addExerciseRecord,
  getBestExerciseRecords,
  getAllExerciseCategories,
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

