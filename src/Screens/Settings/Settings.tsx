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
import { supabase, SUPABASE_TABLE, useDebounce } from "../../utils";
import { IconRefresh, IconEdit } from "@tabler/icons-react";
import useUserData from "../../Store/Store";
import { ProfilesType } from "../../utils/SUPABASE_TABLE";
import { toast } from "react-toastify";

const Settings = () => {
  const [userData, setUserData] = useState<ProfilesType>({
    email: "",
    id: "",
    role: "",
    user_id: "",
    user_name: "",
  });
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const roles = ["Admin", "Management"] as const;
  const onChange = <K extends keyof ProfilesType>(
    key: K,
    value: ProfilesType[K]
  ) => {
    setUserData((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
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
    console.log({ error, data });
    if (!error) {
      toast.update(id, {
        type: "success",
        render: "Updated Successfully",
        isLoading: false,
        progress: 0,
        autoClose: 3000,
      });
    } else {
      console.log(error);
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
    <div className="fixed w-full h-full flex items-center justify-center">
      <Card className="bg-[#FFF] w-[40%] min-h-[50%] flex-col justify-center items-center py-10 gap-7">
        <Text className="font-[#292929] font-bold text-2xl" variant="heading">
          Profile Info
        </Text>
        <TextInput
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            onChange("user_name", event.target.value);
          }}
          label="User name"
          size="md"
          placeholder="Name"
          value={userData?.user_name}
          disabled={!isEdit}
        />

        <TextInput
          label="Email"
          size="md"
          placeholder="Password"
          disabled
          value={userData?.email}
        />
        <Radio.Group
          name="role"
          label="Select your Role"
          description="Based on this role , You will be able to manage Projects"
          withAsterisk
          value={userData?.role}
        >
          <Group mt="xs">
            {roles.map((singleValue, index) => {
              return (
                <Radio
                  key={index}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setUserData((prev) => {
                      return {
                        ...prev,
                        role: event.target.value,
                      };
                    });
                  }}
                  value={singleValue}
                  label={singleValue}
                  disabled={!isEdit}
                />
              );
            })}
          </Group>
        </Radio.Group>
        <Container className="flex flex-row justify-between items-center gap-4">
          <Button
            variant="filled"
            onClick={() => {
              setInitialData();
              toggleEdit();
            }}
          >
            Cancel
          </Button>
          <Button variant="light" onClick={handleSave}>
            Save
          </Button>
        </Container>
        <Container
          pos={"absolute"}
          className="flex flex-row gap-5"
          right={20}
          top={20}
        >
          <div
            onClick={setInitialData}
            className={`border-gray-400 bg-gray-100 p-2`}
          >
            <IconRefresh />
          </div>
          <div
            className={`border-gray-400 ${
              isEdit ? "bg-green-300" : "bg-gray-100"
            } p-2`}
            onClick={toggleEdit}
          >
            <IconEdit color={isEdit ? "#FFF" : "#000"} />
          </div>
        </Container>
      </Card>
    </div>
  );
};

export default Settings;
