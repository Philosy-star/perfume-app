import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://djsizvulqcjpbtroghmm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqc2l6dnVscWNqcGJ0cm9naG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxODY0NTksImV4cCI6MjA2MTc2MjQ1OX0.QyXOkcVyMAzz3zLjo1IzL7YQb2Z3rvFVHgpkA3ODoP4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
