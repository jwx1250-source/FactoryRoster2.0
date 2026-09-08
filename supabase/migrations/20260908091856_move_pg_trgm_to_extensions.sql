-- Keep third-party extension objects outside the exposed public schema.
create schema if not exists extensions;
alter extension pg_trgm set schema extensions;
