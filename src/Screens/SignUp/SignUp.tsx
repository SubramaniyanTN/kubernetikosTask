import { Button, Card, Text, TextInput, Radio, Group } from "@mantine/core";
import { useState } from "react";
import { useDebounce } from "../../utils";
import supabase from "../../utils/supabaseConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
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
    setSignInDetails((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const createUser = useCreateUser();
  const debouncedOnChange = useDebounce({
    func: onChange,
  });

  const handleSignUp = async () => {
    const id = toast.loading("Signing Up", {
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

    if (response.data.user) {
      navigate("/");
      toast.update(id, {
        type: "success",
        render: "Account created successfully. Check your email and verify.",
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
      <Card className="bg-[#FFF] w-full sm:w-[80%] md:w-[60%] lg:w-[40%] min-h-[50%] flex-col justify-center items-center py-10 px-4 sm:px-8 gap-7">
        <Text
          className="text-[#292929] font-bold text-2xl mb-4"
          variant="heading"
        >
          Sign Up
        </Text>
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
        <TextInput
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            debouncedOnChange("userName", event.target.value)
          }
          label="Enter your User Name"
          size="md"
          placeholder="User Name"
          className="w-full"
        />
        <Radio.Group
          name="role"
          label="Select your Role"
          description="Based on this role, you will be able to manage projects"
          withAsterisk
        >
          <Group mt="xs">
            {roles.map((role, index) => (
              <Radio
                key={index}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  debouncedOnChange(
                    "role",
                    event.target.value as SignUpDetailsType["role"]
                  )
                }
                value={role}
                label={role}
              />
            ))}
          </Group>
        </Radio.Group>
        <Button
          onClick={handleSignUp}
          size="md"
          variant="filled"
          className="w-full"
        >
          Sign Up
        </Button>
      </Card>
    </div>
  );
};

export default SignUp;
