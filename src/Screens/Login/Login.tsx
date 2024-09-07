import {
  Button,
  Card,
  Text,
  TextInput,
  Anchor,
  Container,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useDebounce } from "../../utils";
import supabase from "../../utils/supabaseConfig";
import { SignUpDetailsType } from "../SignUp/SignUp";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type LoginDetailsType = Omit<SignUpDetailsType, "role">;

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
    const id = toast.loading("Loggin In", {
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
      navigate("/user");
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
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#EEF2F5]">
      <Card className="bg-[#FFF] w-[40%] min-h-[50%] flex-col justify-center items-center py-10 gap-7">
        <Text className="font-[#292929] font-bold text-2xl" variant="heading">
          Login
        </Text>
        <TextInput
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            debouncedOnChange("email", event.target.value)
          }
          label="Enter your Email"
          size="md"
          placeholder="Email"
        />
        <TextInput
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            debouncedOnChange("password", event.target.value)
          }
          label="Enter your Password"
          size="md"
          placeholder="Password"
        />
        <Button onClick={handleSignIn} size="md" variant="filled">
          Login
        </Button>
        <Container className="flex flex-row justify-center items-center gap-4">
          <Text
            className="font-[#292929] font-normal text-sm"
            variant="heading"
          >
            Don't have an account ?
          </Text>
          <Anchor href="/signup" variant="text" underline="always">
            Sign up
          </Anchor>
        </Container>
      </Card>
    </div>
  );
};

export default Login;
