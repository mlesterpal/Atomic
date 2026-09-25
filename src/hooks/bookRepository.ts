import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  addNewBook,
  deleteBook,
  getAllFavoriteLines,
  getAllBooks,
  updateBook,
  type AddNewBookRequest,
} from "../services/bookService"

export const useGetAllBooks = () => {
  return useQuery({
    queryKey: ["books"],
    queryFn: getAllBooks,
  })
}

export const useAddBook = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AddNewBookRequest) => addNewBook(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["books"] })
    },
  })
}

export const useDeleteBook = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (bookId: number) => deleteBook(bookId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["books"] })
    },
  })
}

export const useToggleFinished = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ bookId, isFinished }: { bookId: number; isFinished: boolean }) =>
      updateBook(bookId, { isFinished }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["books"] })
    },
  })
}

export const useGetAllFavoriteLines = (bookId: number) => {
  return useQuery({
    queryKey: ["books", bookId, "favoriteLines"],
    queryFn: () => getAllFavoriteLines(bookId),
    enabled: Number.isFinite(bookId),
  })
}