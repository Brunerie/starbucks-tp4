import {SupabaseClient} from "@supabase/supabase-js";
import {User} from "@supabase/auth-helpers-nextjs";

export async function getUser (supabase: SupabaseClient) : Promise<User | null>  {
    const { data, error } = await supabase.auth.getUser()
    return data.user
}