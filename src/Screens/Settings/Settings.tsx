import {
  Button,
  Card,
  Container,
  Group,
  Radio,
  Text,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { supabase, SUPABASE_TABLE } from "../../utils";
import { IconRefresh, IconEdit } from "@tabler/icons-react";
import { toast } from "react-toastify";

const Settings = () => {
  const [userData, setUserData] = useState({
    email: "",
    id: "",
    role: "",
    user_id: "",
    user_name: "",
  });
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const roles = ["Admin", "Management"] as const;

  const onChange = <K extends keyof typeof userData>(
    key: K,
    value: (typeof userData)[K]
  ) => {
    setUserData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleEdit = () => {
    setIsEdit((prev) => !prev);
  };

  const setInitialData = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user?.id) {
      const { data: userResponse } = await supabase
        .from(SUPABASE_TABLE.profiles)
        .select()
        .eq("user_id", data.user.id)
        .single();
      if (userResponse) {
        setUserData(userResponse);
      }
    }
  };

  const handleSave = async () => {
    const id = toast.loading("Updating", {
      closeButton: true,
      draggable: true,
      hideProgressBar: false,
      progress: 1,
    });
    const { error, data } = await supabase
      .from(SUPABASE_TABLE.profiles)
      .update({ user_name: userData.user_name, role: userData.role })
      .eq("id", userData.id);

    if (!error) {
      toast.update(id, {
        type: "success",
        render: "Updated Successfully",
        isLoading: false,
        progress: 0,
        autoClose: 3000,
      });
    } else {
      toast.update(id, {
        type: "error",
        render: error?.message,
        isLoading: false,
        progress: 0,
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    setInitialData();
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center bg-[#EEF2F5]">
      <Card className="bg-white w-full sm:w-[90%] md:w-[75%] lg:w-[60%] xl:w-[50%] min-h-[50%] flex flex-col justify-center items-center py-10 px-4 sm:px-8 gap-7">
        {/* Icon Buttons (aligned to the end of the row) */}
        <Container className="flex flex-row justify-end gap-5 w-full mb-4">
          <div
            onClick={setInitialData}
            className="border-gray-400 bg-gray-100 p-2 cursor-pointer"
          >
            <IconRefresh />
          </div>
          <div
            className={`border-gray-400 ${
              isEdit ? "bg-green-300" : "bg-gray-100"
            } p-2 cursor-pointer`}
            onClick={toggleEdit}
          >
            <IconEdit color={isEdit ? "#FFF" : "#000"} />
          </div>
        </Container>

        {/* Profile Info */}
        <Text
          className="text-[#292929] font-bold text-2xl mb-4"
          variant="heading"
        >
          Profile Info
        </Text>

        {/* User Name Field */}
        <TextInput
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            onChange("user_name", event.target.value);
          }}
          label="User Name"
          size="md"
          placeholder="Name"
          value={userData?.user_name}
          disabled={!isEdit}
          className="w-full"
        />

        {/* Email Field */}
        <TextInput
          label="Email"
          size="md"
          placeholder="Email"
          disabled
          value={userData?.email}
          className="w-full"
        />

        {/* Role Selection */}
        <Radio.Group
          name="role"
          label="Select your Role"
          description="Based on this role, you will be able to manage Projects"
          withAsterisk
          value={userData?.role}
          className="w-full"
        >
          <Group mt="xs" className="flex flex-row w-full">
            {roles.map((singleValue, index) => (
              <Radio
                key={index}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setUserData((prev) => ({
                    ...prev,
                    role: event.target.value,
                  }));
                }}
                value={singleValue}
                label={singleValue}
                disabled={!isEdit}
                className="w-full"
              />
            ))}
          </Group>
        </Radio.Group>

        {/* Action Buttons */}
        <Container className="flex flex-row justify-between items-center gap-4 w-full">
          <Button
            variant="filled"
            onClick={() => {
              setInitialData();
              toggleEdit();
            }}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="light"
            onClick={handleSave}
            className="w-full sm:w-auto"
          >
            Save
          </Button>
        </Container>
      </Card>
    </div>
  );
};

export default Settings;
