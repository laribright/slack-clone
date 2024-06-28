import { supabaseServerClient } from '@/supabase/supabaseServer';

export const addMemberToWorkspace = async (
  userId: string,
  workspaceId: number
) => {
  const supabase = await supabaseServerClient();

  //   Update the workspace members
  const { data: addMemberToWorkspaceData, error: addMemberToWorkspaceError } =
    await supabase.rpc('add_member_to_workspace', {
      user_id: userId,
      workspace_id: workspaceId,
    });

  return [addMemberToWorkspaceData, addMemberToWorkspaceError];
};
