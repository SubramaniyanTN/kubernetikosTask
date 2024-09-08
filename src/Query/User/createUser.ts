import { useMutation } from "@tanstack/react-query";
import POST, { AUTHPOST, PostPropsType } from "../../axios/Post/Post";
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const useCreateUser = () => {
  const navigate = useNavigate();
  let id = useRef<any>();
  return useMutation<
    {
      data: any;
      error: any;
    },
    {
      response: {
        data: {
          devMessage: null | any;
          message: string;
          statusCode: number;
          success: boolean;
        };
      };
    },
    PostPropsType<SignUpWithPasswordCredentials>,
    any
  >({
    mutationFn: AUTHPOST,
    onMutate: () => {
      id.current = toast.loading("Sign Up", {
        closeButton: true,
        draggable: true,
        hideProgressBar: false,
        progress: 1,
      });
    },
    onSuccess: (data, variables) => {
      console.log({ data, variables });
      navigate("/");
      toast.update(id.current, {
        type: "success",
        render: "Account created Successfully,Check your Email and Verify",
        isLoading: false,
        progress: 0,
        autoClose: 3000,
      });
    },
    onError: (error, variables, context) => {
      console.log({ error, variables, context });
      toast.update(id.current, {
        type: "error",
        render: "Error",
        isLoading: false,
        progress: 0,
        autoClose: 3000,
      });
    },
  });
};

export default useCreateUser;
