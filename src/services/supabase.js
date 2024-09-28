import { Config } from "../config.js";
import axios from 'axios'

const api = axios.create({
    baseURL: Config.SUPABASE_API_URL,
    headers: {
      apikey: Config.SUPABASE_API_KEY,
      Authorization: `Bearer ${Config.SUPABASE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
export const supabaseApi = api;