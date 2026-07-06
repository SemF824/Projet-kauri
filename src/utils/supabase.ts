import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vikuvrkhxxwigoyoihlf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpa3V2cmtoeHh3aWdveW9paGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMjExMzgsImV4cCI6MjA5NzY5NzEzOH0.Nl4dq7IBJRv_0eoZeYnWJI3kIB8tt7DFhfrJT73oSUs';

export const projectId = 'vikuvrkhxxwigoyoihlf';
export const publicAnonKey = SUPABASE_ANON_KEY;
export const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-3612691c`;

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseInstance;
}

export async function authHeaders(): Promise<Record<string, string>> {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? publicAnonKey;
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

export function phoneToEmail(phone: string): string {
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  const normalized = clean.startsWith('+') ? clean : `+33${clean.replace(/^0/, '')}`;
  return `${normalized}@kauri.app`;
}

// Supabase requires 6+ character passwords — pad short PINs with a fixed salt
export function pinToPassword(pin: string): string {
  return `${pin}_kauri`;
}

// ── Social helpers ────────────────────────────────────────────────────────────

export async function addComment(postId: string, text: string, author: string, initials: string) {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return supabase.from('social_comments').insert({
    post_id: postId,
    user_id: user?.id ?? null,
    author,
    initials,
    text,
  });
}

export async function getComments(postId: string) {
  const supabase = getSupabase();
  return supabase
    .from('social_comments')
    .select('id, post_id, author, initials, text, created_at')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
}

export async function setFollowPro(proId: string, follow: boolean) {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  if (follow) {
    await supabase.from('social_follows').upsert({ user_id: user.id, pro_id: proId });
  } else {
    await supabase.from('social_follows').delete().match({ user_id: user.id, pro_id: proId });
  }
}

export async function checkFollowingPro(proId: string): Promise<boolean> {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from('social_follows')
    .select('pro_id')
    .eq('user_id', user.id)
    .eq('pro_id', proId)
    .maybeSingle();
  return !!data;
}
