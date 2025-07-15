/*
  # Fix Contact Messages RLS Policy

  1. Security Changes
    - Drop existing INSERT policy for contact_messages
    - Recreate INSERT policy to ensure anonymous users can submit contact messages
    - Verify RLS is enabled on contact_messages table

  2. Policy Details
    - Allow both anonymous (anon) and authenticated users to insert contact messages
    - No restrictions on insertion (with_check = true)
    - Maintains existing SELECT and UPDATE policies for authenticated users only
*/

-- Ensure RLS is enabled on contact_messages table
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Anyone can create contact_messages" ON contact_messages;

-- Recreate INSERT policy for anonymous and authenticated users
CREATE POLICY "Anyone can create contact_messages"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure SELECT policy exists for authenticated users
DROP POLICY IF EXISTS "Authenticated users can read contact_messages" ON contact_messages;
CREATE POLICY "Authenticated users can read contact_messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure UPDATE policy exists for authenticated users
DROP POLICY IF EXISTS "Authenticated users can update contact_messages" ON contact_messages;
CREATE POLICY "Authenticated users can update contact_messages"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);