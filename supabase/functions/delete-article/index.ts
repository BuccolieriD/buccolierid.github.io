// Note: this file is intended to run as a Supabase Edge Function (Deno runtime).
// The project's TypeScript/IDE may show linting errors such as "Cannot find name 'Deno'"
// or "Cannot find module 'std/server'" because the local editor doesn't use the
// Deno import map / runtime the function expects. These warnings are expected and
// do not prevent deploying the function with the Supabase CLI.

import { serve } from 'std/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Use POST' }), { status: 405 })
    }

    const body = await req.json()
    const { id, image_path } = body
    if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400 })

    if (image_path) {
      try {
        const { error: delError } = await supabaseAdmin.storage.from('images').remove([image_path])
        if (delError) {
          console.warn('Storage remove error', delError)
          // continue: we still attempt to delete the DB row below
        }
      } catch (innerErr) {
        console.warn('Storage remove threw', String(innerErr))
      }
    }

    const { error } = await supabaseAdmin.from('articles').delete().eq('id', id)
    if (error) return new Response(JSON.stringify({ error: error.message || String(error) }), { status: 500 })

    return new Response(JSON.stringify({ status: 'ok' }), { status: 200 })
  } catch (err) {
    console.error('function error', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
