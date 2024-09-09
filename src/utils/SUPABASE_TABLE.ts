export type ContactsType = {
  age: number;
  city: string;
  company: string;
  created_at?: Date;
  department: string;
  description: string;
  email: string;
  id?: number;
  name: string;
  state: string;
  created_by?: string;
};

export type ProfilesType = {
  id: string;
  created_at?: Date;
  email: string;
  role: string;
  user_name: string;
  user_id: string;
};

const SUPABASE_TABLE = {
  contacts: "contacts",
  profiles: "profiles",
} as const;

export default SUPABASE_TABLE;
