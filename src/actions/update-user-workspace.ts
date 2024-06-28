'use server';

import { supabaseServerClient } from '@/supabase/supabaseServer';

export const updateUserWorkspace = async (
  userId: string,
  workspaceId: string
) => {
  const supabase = await supabaseServerClient();

  // Update the user record
  const { data: updateWorkspaceData, error: updateWorkspaceError } =
    await supabase.rpc('add_workspace_to_user', {
      user_id: userId,
      new_workspace: workspaceId,
    });

  return [updateWorkspaceData, updateWorkspaceError];
};
