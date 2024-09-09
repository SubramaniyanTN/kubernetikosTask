import { Button, Card, Text, TextInput, Container } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDebounce } from "../../utils";
import supabase from "../../utils/supabaseConfig";
import { SignUpDetailsType } from "../SignUp/SignUp";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type LoginDetailsType = Omit<Omit<SignUpDetailsType, "role">, "userName">;

const Login = () => {
  const navigate = useNavigate();
  const [loginDetails, setLoginDetails] = useState<LoginDetailsType>({
    email: "",
    password: "",
  });
  const onChange = <K extends keyof LoginDetailsType>(
    key: K,
    value: LoginDetailsType[K]
  ) => {
    setLoginDetails((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };
  const debouncedOnChange = useDebounce({
    func: onChange,
  });
  const handleSignIn = async () => {
    const id = toast.loading("Logging In", {
      closeButton: true,
      draggable: true,
      hideProgressBar: false,
      progress: 1,
    });
    const response = await supabase.auth.signInWithPassword({
      email: loginDetails.email,
      password: loginDetails.password,
    });
    if (response.data.user) {
      toast.update(id, {
        type: "success",
        render: "Logged in Successfully",
        isLoading: false,
        progress: 0,
        autoClose: 3000,
      });
      navigate(import.meta.env.BASE_URL + "user");
    } else {
      toast.update(id, {
        type: "error",
        render: response.error?.message,
        isLoading: false,
        progress: 0,
        autoClose: 3000,
      });
    }
  };
  const handleNavigateToSignUp = () => {
    navigate(import.meta.env.BASE_URL + "signup");
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#EEF2F5]">
      <Card className="bg-[#FFF] w-full sm:w-[80%] md:w-[60%] lg:w-[40%] min-h-[50%] flex-col justify-center items-center py-10 px-4 sm:px-8 gap-7">
        <Text className="text-[#292929] font-bold text-2xl mb-4">Login</Text>
        <TextInput
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            debouncedOnChange("email", event.target.value)
          }
          label="Enter your Email"
          size="md"
          placeholder="Email"
          className="w-full"
        />
        <TextInput
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            debouncedOnChange("password", event.target.value)
          }
          label="Enter your Password"
          size="md"
          placeholder="Password"
          className="w-full"
        />
        <Button
          onClick={handleSignIn}
          size="md"
          variant="filled"
          className="w-full"
        >
          Login
        </Button>
        <Container className="flex flex-row justify-center items-center gap-4">
          <Text className="text-[#292929] font-normal text-sm">
            Don't have an account?
          </Text>
          <Text
            onClick={handleNavigateToSignUp}
            className="underline cursor-pointer text-blue-600"
          >
            Sign up
          </Text>
        </Container>
      </Card>
    </div>
  );
};

export default Login;
