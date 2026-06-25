import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
//  получения задачи
export async function getTodosFromDB() {
    const { data, error } = await supabase
        .from('todos')
       .select('*')
        .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return data;
}
// добавления задачи
export async function addTodoToDB(text) {
    const { data, error } = await supabase
        .from('todos')
        .insert([{ title: text, is_completed: false }])
        .select();
    
    if (error) throw new Error(error.message);
    return data[0]; 
}
//удаления задачи
export async function deleteTodoFromDB(id) {
    const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
        
    if (error) throw new Error(error.message);
}
export async function updateTodoStatusInDB(id, isCompleted) {
    const { error } = await supabase
        .from('todos')
        .update({ is_completed: isCompleted })
        .eq('id', id);
        
    if (error) throw new Error(error.message);
}