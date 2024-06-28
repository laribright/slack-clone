import { NextApiRequest } from 'next';

import { SockerIoApiResponse } from '@/types/app';
import { getUserDataPages } from '@/actions/get-user-data';
import supabaseServerClientPages from '@/supabase/supabaseSeverPages';
import { SupabaseClient } from '@supabase/supabase-js';

export default async function handler(
  req: NextApiRequest,
  res: SockerIoApiResponse
) {
  if (!['DELETE', 'PATCH'].includes(req.method!)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const userData = await getUserDataPages(req, res);

    if (!userData) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { messageId } = req.query;
    const { content } = req.body;

    if (!messageId) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const supabase = supabaseServerClientPages(req, res);

    const { data: messageData, error } = await supabase
      .from('direct_messages')
      .select(
        `
        *,
        user_one:users!direct_messages_user_one_fkey(*),
        user_two:users!direct_messages_user_two_fkey(*)
        `
      )
      .eq('id', messageId)
      .single();

    console.log('DIRECT MESSAGE messageData: ', error);
    console.log('DIRECT MESSAGE messageData: ', messageData);

    if (error || !messageData) {
      console.log('DIRECT MESSAGE ERROR: ', error);
      return res.status(404).json({ error: 'Message not found' });
    }

    const isMessageOwner =
      userData.id === messageData.user_one.id ||
      userData.id === messageData.user_two.id;
    const isAdmin = userData.type === 'admin';
    const isRegulator = userData.type === 'regulator';

    const canEditMessage =
      isMessageOwner || isAdmin || isRegulator || !messageData.is_deleted;

    if (!canEditMessage) {
      console.log('DIRECT MESSAGE ERROR: canEditMessage:', error);
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (req.method === 'PATCH') {
      if (!isMessageOwner) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      await updateMessageContent(supabase, messageId as string, content);
    } else if (req.method === 'DELETE') {
      await deleteMessage(supabase, messageId as string);
    }

    const { data: updatedMessage, error: messageError } = await supabase
      .from('direct_messages')
      .select(
        `
        *,
        user_one:users!direct_messages_user_one_fkey(*),
        user_two:users!direct_messages_user_two_fkey(*),
        user:users!direct_messages_user_fkey(*)
        `
      )
      .eq('id', messageId)
      .single();

    if (messageError || !updatedMessage) {
      console.log('DIRECT MESSAGE ERROR: ', messageError);
      return res.status(404).json({ error: 'Message not found' });
    }

    res?.socket?.server?.io?.emit('direct-message:update', updatedMessage);
    return res.status(200).json({ message: updatedMessage });
  } catch (error) {
    console.log('DIRECT MESSAGE ERROR: ', error);
    return res.status(500).json({ error: 'Error sending message' });
  }
}

async function updateMessageContent(
  supabase: SupabaseClient,
  messageId: string,
  content: string
) {
  await supabase
    .from('direct_messages')
    .update({
      content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', messageId)
    .select(
      `*, 
      user_one:users!direct_messages_user_one_fkey(*), 
      user_two:users!direct_messages_user_two_fkey(*)
    `
    )
    .single();
}

async function deleteMessage(supabase: SupabaseClient, messageId: string) {
  await supabase
    .from('direct_messages')
    .update({
      content: 'This message has been deleted',
      file_url: null,
      is_deleted: true,
    })
    .eq('id', messageId)
    .select(
      `*, 
        user_one:users!direct_messages_user_one_fkey(*), 
        user_two:users!direct_messages_user_two_fkey(*)
      `
    )
    .single();
}
