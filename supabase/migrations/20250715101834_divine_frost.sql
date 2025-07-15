/*
  # Fix Contact Messages RLS Insert Policy

  1. Security
    - Drop existing INSERT policy for contact_messages
    - Create new INSERT policy allowing anonymous users to submit contact messages
    - Ensure anonymous users can insert contact messages without authentication
*/

-- Drop existing INSERT policy
DROP POLICY IF EXISTS "Anyone can create contact_messages" ON contact_messages;

-- Create new INSERT policy that explicitly allows anonymous users
CREATE POLICY "Allow anonymous contact message creation"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;