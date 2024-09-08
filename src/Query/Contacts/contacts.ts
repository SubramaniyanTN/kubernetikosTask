import { useInfiniteQuery } from "@tanstack/react-query";
import SUPABASE_TABLE, { ContactsType } from "../../utils/SUPABASE_TABLE";
import { QUERY_KEY, supabase } from "../../utils";
import { GET } from "../../axios";

const LIMIT = 10; // Define a limit for pagination

export const useGetContacts = () => {
  return useInfiniteQuery<
    { data: ContactsType[]; error: any }, // Adjust according to the expected response
    { statusCode: number; success: boolean; message: string }
  >({
    queryKey: [QUERY_KEY.contacts],
    queryFn: async ({ pageParam = 0 }) => {
      return GET({
        url: `/contacts`,
        config: {
          params: {
            select: "*",
          },
        },
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      return undefined;
      // Determine if there are more pages to fetch
      if (lastPage.data.length < LIMIT) {
        return undefined; // No more pages
      }
      return allPages.length; // Return the next page number
    },
    initialPageParam: 0,
  });
};
