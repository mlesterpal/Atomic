import type { Book } from "../entities/response/Book"
import type { BookFavoriteLine } from "../entities/response/BookFavoriteLine"
import { axiosInstance } from "./apiClient"

export type AddNewBookRequest = {
  title: string
  author: string
}

export type UpdateBookRequest = {
  title?: string
  author?: string
  isFinished?: boolean
  lastPageRead?: number
}

export const getAllBooks = async (): Promise<Book[]> => {
  const response = await axiosInstance.get<Book[]>("/books/getallbooks")
  return response.data
}

export const addNewBook = async (payload: AddNewBookRequest): Promise<void> => {
  await axiosInstance.post("/books/addnewbook", payload)
}

export const deleteBook = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/books/deletebook/${id}`)
}

export const updateBook = async (id: number, payload: UpdateBookRequest): Promise<void> => {
  await axiosInstance.put(`/books/updatebook/${id}`, payload)
}

export const getAllFavoriteLines = async (bookId: number): Promise<BookFavoriteLine[]> => {
  const response = await axiosInstance.get<BookFavoriteLine[]>(
    `/books/getallfavoritelines/${bookId}`
  )
  return response.data
}

