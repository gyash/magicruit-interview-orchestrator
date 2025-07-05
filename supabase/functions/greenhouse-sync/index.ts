import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GreenhouseJob {
  id: number
  name: string
  requisition_id: string
  status: string
  created_at: string
  updated_at: string
  departments: Array<{ id: number; name: string }>
  offices: Array<{ id: number; name: string }>
}

interface GreenhouseCandidate {
  id: number
  first_name: string
  last_name: string
  email_addresses: Array<{ value: string; type: string }>
  phone_numbers: Array<{ value: string; type: string }>
  applications: Array<{
    id: number
    job: { id: number; name: string }
    status: string
    current_stage: { name: string }
  }>
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data } = await supabaseClient.auth.getUser(token)
    const user = data.user

    if (!user) {
      throw new Error('Not authenticated')
    }

    const { action, apiKey, ...params } = await req.json()
    const greenhouseApiKey = apiKey || Deno.env.get('GREENHOUSE_API_KEY')
    
    if (!greenhouseApiKey) {
      throw new Error('Greenhouse API key not configured')
    }

    const greenhouseHeaders = {
      'Authorization': `Basic ${btoa(greenhouseApiKey + ':')}`,
      'Content-Type': 'application/json',
    }

    const baseUrl = 'https://harvest.greenhouse.io/v1'

    switch (action) {
      case 'test-connection': {
        // Test the API connection by fetching user info
        const response = await fetch(`${baseUrl}/users/me`, {
          headers: greenhouseHeaders,
        })
        
        if (!response.ok) {
          throw new Error(`Greenhouse API error: ${response.status} ${response.statusText}`)
        }
        
        const userData = await response.json()
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Connection successful',
          user: userData.name || userData.email
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      case 'fetch-jobs': {
        const response = await fetch(`${baseUrl}/jobs?per_page=100`, {
          headers: greenhouseHeaders,
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.status}`)
        }
        
        const jobs: GreenhouseJob[] = await response.json()
        return new Response(JSON.stringify({ jobs }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      case 'fetch-candidates': {
        const { jobId } = params
        let url = `${baseUrl}/candidates?per_page=100`
        
        if (jobId) {
          url += `&job_id=${jobId}`
        }
        
        const response = await fetch(url, {
          headers: greenhouseHeaders,
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch candidates: ${response.status}`)
        }
        
        const candidates: GreenhouseCandidate[] = await response.json()
        return new Response(JSON.stringify({ candidates }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      case 'fetch-interviews': {
        const response = await fetch(`${baseUrl}/scheduled_interviews?per_page=100`, {
          headers: greenhouseHeaders,
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch interviews: ${response.status}`)
        }
        
        const interviews = await response.json()
        return new Response(JSON.stringify({ interviews }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      default:
        throw new Error('Invalid action')
    }

  } catch (error) {
    console.error('Greenhouse API Error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})