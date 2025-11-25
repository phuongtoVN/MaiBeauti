-- Run this in your Supabase SQL Editor to create the missing user record

INSERT INTO users (id, email, name, created_at, updated_at)
VALUES (
  'ddb3c0a4-d298-4107-b02c-93d69077f7b9',  -- Your auth user ID
  'phuongto112vn@gmail.com',                -- Your email
  'Phuong To',                               -- Your name
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
