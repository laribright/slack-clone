'use server';

import { supabaseServerClient } from '@/supabase/supabaseServer';
import { getUserData } from '@/actions/get-user-data';
import { addMemberToWorkspace } from '@/actions/add-member-to-workspace';
import { updateUserWorkspace } from '@/actions/update-user-workspace';

export const getUserWorkspaceData = async (workspaceIds: Array<string>) => {
  const supabase = await supabaseServerClient();

  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .in('id', workspaceIds);

  return [data, error];
};

export const getCurrentWorksaceData = async (workspaceId: string) => {
  const supabase = await supabaseServerClient();

  const { data, error } = await supabase
    .from('workspaces')
    .select('*, channels (*)')
    .eq('id', workspaceId)
    .single();

  if (error) {
    return [null, error];
  }

  const { members } = data;

  const memberDetails = await Promise.all(
    members.map(async (memberId: string) => {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', memberId)
        .single();

      if (userError) {
        console.log(
          `Error fetching user data for member ${memberId}`,
          userError
        );
        return null;
      }

      return userData;
    })
  );

  data.members = memberDetails.filter(member => member !== null);

  return [data, error];
};

export const workspaceInvite = async (inviteCode: string) => {
  const supabase = await supabaseServerClient();
  const userData = await getUserData();

  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .eq('invite_code', inviteCode)
    .single();

  if (error) {
    console.log('Error fetching workspace invite', error);
    return;
  }

  const isUserMember = data?.members?.includes(userData?.id);

  if (isUserMember) {
    console.log('User is already a member of this workspace');
    return;
  }

  if (data?.super_admin === userData?.id) {
    console.log('User is the super admin of this workspace');
    return;
  }

  await addMemberToWorkspace(userData?.id!, data?.id);

  await updateUserWorkspace(userData?.id!, data?.id);
};
