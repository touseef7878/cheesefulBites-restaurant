-- Public buckets provide object delivery through URLs without needing a broad SELECT
-- policy. Removing this policy prevents client-side directory listing.
drop policy if exists "Restaurant media is publicly readable" on storage.objects;
