import { createClient } from "@supabase/supabase-js";
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

const supabaseClient = createClient(Config.SUPABASE_API_URL, Config.SUPABASE_API_KEY);

export const supabase = supabaseClient;
