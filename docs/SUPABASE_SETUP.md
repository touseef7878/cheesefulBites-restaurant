# Supabase Setup for the Handoff

Create a Supabase project owned by the final client, then set the values below in `.env.local` for development and in the host’s environment settings for production:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Apply the migrations in `supabase/migrations/` in filename order using the Supabase SQL editor or migration tooling. The app requires `profiles`, `restaurant_menu_items`, `menu_reviews`, and `customer_favourites`, plus the policies and role helper functions included in those migrations.

For email confirmation, configure the client’s own approved SMTP sender in Supabase Auth and add every final website URL to **Auth → URL Configuration → Redirect URLs**. Google OAuth is not configured in this handoff.

For restaurant image management, create or retain a `restaurant-media` storage bucket, upload the supplied WebP files or client-owned replacements, and write the resulting public URLs into `restaurant_menu_items.image`. Do not use a service-role key in the React app.

To appoint an owner, use a trusted dashboard session to change that user’s `public.profiles.role` from `customer` to `admin`. The browser app has no self-promotion control.
