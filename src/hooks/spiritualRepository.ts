import { useQuery } from "@tanstack/react-query"
import { getAllSpiritualCategories, getSpiritualNotesByCategory } from "../services/spiritualService"

export const useGetAllSpiritualCategories = () => {
  return useQuery({
    queryKey: ["spiritual", "categories"],
    queryFn: getAllSpiritualCategories,
  })
}

export const useGetSpiritualNotesByCategory = (categoryId: number | null) => {
  return useQuery({
    queryKey: ["spiritual", "notes", categoryId],
    queryFn: () => getSpiritualNotesByCategory(categoryId),
  })
}

