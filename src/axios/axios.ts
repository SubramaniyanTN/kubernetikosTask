import axios from "axios";
import { supabase } from "../utils";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`,
});

api.interceptors.request.use(async (config) => {
  const session = await supabase.auth.getSession();
  config.headers[
    "Authorization"
  ] = `Bearer ${session.data.session?.access_token}`;
  config.headers["apikey"] = import.meta.env.VITE_SUPABASE_API_KEY;
  config.headers.applicationType = "APP";

  return config;
});

export const authAPI = axios.create({
  baseURL: `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/`,
});

authAPI.interceptors.request.use(async (config) => {
  config.headers["Authorization"] = `Bearer ${
    import.meta.env.VITE_SUPABASE_API_KEY
  }`;
  config.headers["apikey"] = import.meta.env.VITE_SUPABASE_API_KEY;
  config.headers.applicationType = "APP";

  return config;
});

export default api;
