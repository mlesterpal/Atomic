import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  addSpiritualNote,
  deleteSpiritualNote,
  getAllSpiritualCategories,
  getSpiritualNotesByCategory,
  type AddSpiritualNoteRequest,
  updateSpiritualNote,
  type UpdateSpiritualNoteRequest,
} from "../services/spiritualService"

export const useGetAllSpiritualCategories = () => {
  return useQuery({
    queryKey: ["spiritual", "categories"],
    queryFn: getAllSpiritualCategories,
  })
}

export const useGetSpiritualNotesByCategory = (categoryId: number | null) => {
  return useQuery({
    queryKey: ["spiritual", "notes", "single", categoryId],
    queryFn: () => getSpiritualNotesByCategory(categoryId, null),
  })
}

export const useInfiniteSpiritualNotesByCategory = (categoryId: number | null) => {
  return useInfiniteQuery({
    queryKey: ["spiritual", "notes", categoryId],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) => getSpiritualNotesByCategory(categoryId, pageParam),
    getNextPageParam: (lastPage) => {
      if (!lastPage.length) return undefined
      if (!lastPage[0].hasMore) return undefined

      let oldest = lastPage[0].noteDate.slice(0, 10)
      for (const r of lastPage) {
        const d = r.noteDate.slice(0, 10)
        if (d < oldest) oldest = d
      }
      return oldest
    },
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

export const useUpdateSpiritualNote = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ noteId, payload }: { noteId: number; payload: UpdateSpiritualNoteRequest }) =>
      updateSpiritualNote(noteId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["spiritual", "notes"] })
    },
  })
}

