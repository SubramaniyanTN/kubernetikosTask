import { Button, Card, Text, TextInput, Radio, Group } from "@mantine/core";
import { useState } from "react";
import { useDebounce } from "../../utils";
import supabase from "../../utils/supabaseConfig";
import { toast } from "react-toastify";
import { useNavigate, useNavigation } from "react-router-dom";
import useCreateUser from "../../Query/User/createUser";
export type SignUpDetailsType = {
  email: string;
  password: string;
  role: "Admin" | "Management";
  userName: string;
};

const SignUp = () => {
  const navigate = useNavigate();
  const [signInDetails, setSignInDetails] = useState<SignUpDetailsType>({
    email: "",
    password: "",
    role: "Management",
    userName: "",
  });
  const roles = ["Admin", "Management"] as const;
  const onChange = <K extends keyof SignUpDetailsType>(
    key: K,
    value: SignUpDetailsType[K]
  ) => {
    setSignInDetails((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };
  const createUser = useCreateUser();
  const debouncedOnChange = useDebounce({
    func: onChange,
  });
  const handleSignUp = async () => {
    const id = toast.loading("Sign Up", {
      closeButton: true,
      draggable: true,
      hideProgressBar: false,
      progress: 1,
    });
    const response = await supabase.auth.signUp({
      email: signInDetails.email,
      password: signInDetails.password,
      options: {
        data: {
          role: signInDetails.role,
          user_name: signInDetails.userName,
        },
      },
    });
    console.log({ response });
    if (response.data.user) {
      navigate("/");
      toast.update(id, {
        type: "success",
        render: "Account created Successfully,Check your Email and Verify",
        isLoading: false,
        progress: 0,
        autoClose: 3000,
      });
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
          Sign Up
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
        <TextInput
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            debouncedOnChange("userName", event.target.value)
          }
          label="Enter your User Name"
          size="md"
          placeholder="User Name"
        />
        <Radio.Group
          name="role"
          label="Select your Role"
          description="Based on this role , You will be able to manage Projects"
          withAsterisk
        >
          <Group mt="xs">
            {roles.map((singleValue, index) => (
              <Radio
                key={index}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  debouncedOnChange(
                    "role",
                    event.target.value as SignUpDetailsType["role"]
                  )
                }
                value={singleValue}
                label={singleValue}
              />
            ))}
          </Group>
        </Radio.Group>
        <Button onClick={handleSignUp} size="md" variant="filled">
          Sign Up
        </Button>
      </Card>
    </div>
  );
};

export default SignUp;
