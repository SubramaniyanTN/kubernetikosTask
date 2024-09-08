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
};

const SUPABASE_TABLE = {
  contacts: "contacts",
} as const;

export default SUPABASE_TABLE;
