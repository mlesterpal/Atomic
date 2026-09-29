import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  addSpiritualNote,
  deleteSpiritualNote,
  getAllSpiritualCategories,
  getSpiritualNotesByCategory,
  type AddSpiritualNoteRequest,
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

export const useAddSpiritualNote = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AddSpiritualNoteRequest) => addSpiritualNote(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["spiritual", "notes"] })
    },
  })
}

