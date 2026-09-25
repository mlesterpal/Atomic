import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  addNewBook,
  addFavoriteLine,
  deleteBook,
  deleteFavoriteLine,
  getAllFavoriteLines,
  getAllBooks,
  updateBook,
  type AddNewBookRequest,
  type AddBookFavoriteLineRequest,
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

export const useAddFavoriteLine = (bookId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AddBookFavoriteLineRequest) => addFavoriteLine(bookId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["books", bookId, "favoriteLines"] })
    },
  })
}

export const useDeleteFavoriteLine = (bookId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (favoriteLineId: number) => deleteFavoriteLine(favoriteLineId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["books", bookId, "favoriteLines"] })
    },
  })
}

export const useUpdateLastPageRead = (bookId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (lastPageRead: number) => updateBook(bookId, { lastPageRead }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["books"] })
    },
  })
}