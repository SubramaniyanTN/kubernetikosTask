import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import SUPABASE_TABLE, { ContactsType } from "../../utils/SUPABASE_TABLE";
import { QUERY_KEY, supabase } from "../../utils";
import { GET, PATCH } from "../../axios";
import POST, { PostPropsType } from "../../axios/Post/Post";
import { useLoadingToast } from "../../utils/loadingToast";
import { Id, toast } from "react-toastify";
import { PostgrestError } from "@supabase/supabase-js";
import { useRef } from "react";
import { PatchPropsType } from "../../axios/Patch/Patch";

const LIMIT = 10; // Define a limit for pagination

export const useGetContacts = (search: string, limit: number) => {
  return useInfiniteQuery<
    ContactsType[], // Adjust according to the expected response
    { statusCode: number; success: boolean; message: string }
  >({
    queryKey: [QUERY_KEY.contacts],
    queryFn: async ({ pageParam = 0 }) => {
      return GET({
        url: `/contacts`,
        config: {
          params: {
            select: "*",
            is_deleted: "eq.false",
          },
        },
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      // Determine if there are more pages to fetch
      if (lastPage.length < LIMIT) {
        return undefined; // No more pages
      }
      return allPages.length; // Return the next page number
    },
    initialPageParam: 0,
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();
  let id = useRef<Id>();
  return useMutation<null, PostgrestError, PostPropsType<ContactsType>, any>({
    mutationFn: POST,
    onMutate: () => {
      id.current = useLoadingToast("Creating Contact");
      console.log({ id });
    },
    onSuccess: (data) => {
      console.log(data);
      console.log({ id });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.contacts] });
      if (id.current) {
        toast.update(id.current, {
          type: "success",
          render: "Created Successfully",
          isLoading: false,
          progress: 0,
          autoClose: 3000,
        });
      }
    },
    onError: (error, variables, context) => {
      console.log({ id });

      if (id.current) {
        toast.update(id.current, {
          type: "error",
          render: error.message,
          isLoading: false,
          progress: 0,
          autoClose: 3000,
        });
      }
    },
  });
};
export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  let id = useRef<Id>();
  return useMutation<
    null,
    PostgrestError,
    PatchPropsType<{ is_deleted: boolean }>,
    any
  >({
    mutationFn: PATCH,
    onMutate: () => {
      id.current = useLoadingToast("Deleting");
      console.log({ id });
    },
    onSuccess: (data) => {
      console.log(data);
      console.log({ id });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.contacts] });
      if (id.current) {
        toast.update(id.current, {
          type: "success",
          render: "Deleted Successfully",
          isLoading: false,
          progress: 0,
          autoClose: 3000,
        });
      }
    },
    onError: (error, variables, context) => {
      if (id.current) {
        toast.update(id.current, {
          type: "error",
          render: error.message,
          isLoading: false,
          progress: 0,
          autoClose: 3000,
        });
      }
    },
  });
};
