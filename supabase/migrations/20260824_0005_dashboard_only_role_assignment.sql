begin;

-- Every new account begins as a customer. Administrators are promoted only from
-- the Supabase dashboard after the account has confirmed its email address.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(coalesce(new.email, ''), '@', 1)),
    'customer'::public.app_role
  )
  on conflict (id) do update
    set email = excluded.email,
        display_name = coalesce(excluded.display_name, public.profiles.display_name);
  return new;
end;
$$;

-- Remove the legacy email-based owner assignment. This account will remain a
-- customer unless a trusted dashboard operator promotes it explicitly.
update public.profiles
set role = 'customer'::public.app_role
where lower(email) = 'alien6touseef12345@gmail.com'
  and role = 'admin'::public.app_role;

commit;
