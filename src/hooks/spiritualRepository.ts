import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  deleteSpiritualNote,
  getAllSpiritualCategories,
  getSpiritualNotesByCategory,
} from "../services/spiritualService"

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

export const useDeleteSpiritualNote = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (noteId: number) => deleteSpiritualNote(noteId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["spiritual", "notes"] })
    },
  })
}

