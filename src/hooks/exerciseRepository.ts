import { useQuery } from "@tanstack/react-query"
import { getAllExerciseCategories } from "../services/exerciseService"

export const useGetAllExerciseCategories = () => {
  return useQuery({
    queryKey: ["exercise", "categories"],
    queryFn: getAllExerciseCategories,
  })
}

