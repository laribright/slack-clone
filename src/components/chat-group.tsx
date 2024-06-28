'use client';

import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import Sidebar from '@/components/sidebar';
import { Channel, User, Workspace } from '@/types/app';
import InfoSection from '@/components/info-section';
import ChatHeader from '@/components/chat-header';
import TextEditor from '@/components/text-editor';
import ChatMessages from '@/components/chat-messages';
import SearchBar from '@/components/search-bar';
import VideoChat from './video-chat';

type ChatGroupProps = {
  type: 'Channel' | 'DirectMessage';
  socketUrl: string;
  apiUrl: string;
  headerTitle: string;
  chatId: string;
  socketQuery: Record<string, string>;
  paramKey: 'channelId' | 'recipientId';
  paramValue: string;
  userData: User;
  currentWorkspaceData: Workspace;
  currentChannelData: Channel | undefined;
  userWorkspaceData: Workspace[];
  userWorkspaceChannels: Channel[];
  slug: string;
};

const ChatGroup: FC<ChatGroupProps> = ({
  apiUrl,
  chatId,
  headerTitle,
  paramKey,
  paramValue,
  socketQuery,
  socketUrl,
  type,
  currentChannelData,
  currentWorkspaceData,
  slug,
  userData,
  userWorkspaceChannels,
  userWorkspaceData,
}) => {
  const [isVideoCall, setIsVideoCall] = useState<boolean>(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const callParam = searchParams?.get('call');
    setIsVideoCall(callParam === 'true');
  }, [searchParams, chatId]);

  return (
    <>
      <div className='h-[calc(100vh-256px)] overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-[6px] [&::-webkit-scrollbar-thumb]:bg-foreground/60 [&::-webkit-scrollbar-track]:bg-none [&::-webkit-scrollbar]:w-2'>
        <Sidebar
          currentWorkspaceData={currentWorkspaceData}
          userData={userData}
          userWorksapcesData={userWorkspaceData as Workspace[]}
        />
        <InfoSection
          currentWorkspaceData={currentWorkspaceData}
          userData={userData}
          userWorkspaceChannels={userWorkspaceChannels}
          currentChannelId={
            type === 'Channel' ? currentChannelData?.id : undefined
          }
        />
        <SearchBar
          currentWorkspaceData={currentWorkspaceData}
          currentChannelData={currentChannelData}
          loggedInUserId={userData.id}
        />
        <div className='p-4 relative w-full overflow-hidden'>
          <ChatHeader title={headerTitle} chatId={chatId} userData={userData} />

          <div className='mt-10'>
            {!isVideoCall && (
              <ChatMessages
                userData={userData}
                name={currentChannelData?.name ?? 'USERNAME'}
                workspaceData={currentWorkspaceData}
                chatId={chatId}
                type={type}
                apiUrl={apiUrl}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
                paramKey={paramKey}
                paramValue={paramValue}
                channelData={currentChannelData}
              />
            )}
            {isVideoCall && (
              <VideoChat
                chatId={type === 'Channel' ? currentChannelData?.id! : chatId}
                userData={userData}
              />
            )}
          </div>
        </div>
      </div>
      <div className='m-4'>
        {!isVideoCall && (
          <TextEditor
            apiUrl={socketUrl}
            channel={currentChannelData}
            type={type}
            userData={userData}
            workspaceData={currentWorkspaceData}
            recipientId={type === 'DirectMessage' ? chatId : undefined}
          />
        )}
      </div>
    </>
  );
};

export default ChatGroup;
