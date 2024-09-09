import { create } from "zustand";

interface UserDataType {
  data: null | {
    id: string;
  };
  setUserData: (data: { id: string }) => void;
}

const useUserData = create<UserDataType>((set) => ({
  data: null,
  setUserData: (data) =>
    set((state) => {
      console.log("INSIDE THE USE USER DATA", { data });
      return { data };
    }),
}));

export default useUserData;
