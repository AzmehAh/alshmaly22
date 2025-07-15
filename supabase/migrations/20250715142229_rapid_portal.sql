/*
  # Fix Contact Messages Delete Policy

  1. Security
    - Add proper DELETE policy for authenticated users
    - Ensure admins can delete contact messages
*/

-- Add DELETE policy for authenticated users
CREATE POLICY "Authenticated users can delete contact_messages"
  ON contact_messages
  FOR DELETE
  TO authenticated
  USING (true);