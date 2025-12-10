import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Generate a user ID (stored in localStorage)
export const getUserId = (): string => {
  let userId = localStorage.getItem('litigation_user_id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('litigation_user_id', userId);
  }
  return userId;
};

export interface Evidence {
  id?: string;
  user_id: string;
  bates_number: string;
  description: string;
  date: string;
  type: string;
  tags?: string[];
}

export interface UserSettings {
  id?: string;
  user_id: string;
  api_key?: string;
  bates_prefix: string;
  bates_counter: number;
}

// Evidence operations
export const saveEvidence = async (evidence: Evidence) => {
  if (!supabase) throw new Error('Supabase not initialized');
  
  const { data, error } = await supabase
    .from('evidence')
    .insert([evidence])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getEvidence = async (userId: string): Promise<Evidence[]> => {
  if (!supabase) throw new Error('Supabase not initialized');
  
  const { data, error } = await supabase
    .from('evidence')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const deleteEvidence = async (id: string) => {
  if (!supabase) throw new Error('Supabase not initialized');
  
  const { error } = await supabase
    .from('evidence')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Settings operations
export const saveSettings = async (settings: UserSettings) => {
  if (!supabase) throw new Error('Supabase not initialized');
  
  const { data, error } = await supabase
    .from('user_settings')
    .upsert([settings], { onConflict: 'user_id' })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getSettings = async (userId: string): Promise<UserSettings | null> => {
  if (!supabase) throw new Error('Supabase not initialized');
  
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // Ignore "no rows" error
  return data;
};