import  {createClient} from 'https://esm.sh/@supabase/supabase-js'



const supUrl = 'https://ovhrjngzqxarovqwtxzc.supabase.co'
const supKey = 'sb_publishable_CgQa29tmvkn6ARBpziz5dA_S1VX70J5'

//intialize
const supabase = createClient(supUrl,supKey)

console.log(supabase);

export default supabase;