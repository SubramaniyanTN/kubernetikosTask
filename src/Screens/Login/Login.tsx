import { Button, Card, Text, TextInput, Radio, Group } from "@mantine/core";
import { useState } from "react";
import { useDebounce } from "../../utils";
type LoginDetailsType = {
  email: string;
  password: string;
  role: "Admin" | "Management";
};

const Login = () => {
  const [loginDetails, setLoginDetails] = useState<LoginDetailsType>({
    email: "",
    password: "",
    role: "Management",
  });
  const roles = ["Admin", "Management"] as const;
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
  const handleSignIn = () => {
    // supabase.au
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
                    event.target.value as LoginDetailsType["role"]
                  )
                }
                value={singleValue}
                label={singleValue}
              />
            ))}
          </Group>
        </Radio.Group>
        <Button onClick={handleSignIn} size="md" variant="filled">
          Login
        </Button>
      </Card>
    </div>
  );
};

export default Login;
