import { useQuery } from "@tanstack/react-query"
import { getAllSpiritualCategories } from "../services/spiritualService"

export const useGetAllSpiritualCategories = () => {
  return useQuery({
    queryKey: ["spiritual", "categories"],
    queryFn: getAllSpiritualCategories,
  })
}

