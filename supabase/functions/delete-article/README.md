Deploy steps for the delete-article Edge Function

1. Install supabase CLI: https://supabase.com/docs/guides/cli

2. Ensure you have your project ref set and are authenticated:
   supabase login
   supabase link --project-ref <your-project-ref>

3. Set the environment variables for the function (service role key & url):
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY="<your-service-role-key>" SUPABASE_URL="https://<your-project>.supabase.co"

4. Deploy the function:
   supabase functions deploy delete-article --project-ref <your-project-ref>

5. After deployment, in the Supabase dashboard you'll find the function URL. Set it into your frontend env:
   REACT_APP_DELETE_ARTICLE_FN_URL="https://<your-project>.functions.supabase.co/delete-article"

6. Rebuild/run your frontend so process.env picks up the new variable (or set in your environment/config). 

Notes:
- The function uses the service_role key, keep it secret and only in server-side envs.
- The function attempts to remove the image from the 'images' bucket using the provided image_path and then deletes the article row.
- If you prefer the function to fail the delete when the image removal fails, adjust the function accordingly.
