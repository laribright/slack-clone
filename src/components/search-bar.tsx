import { FC } from 'react';

import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import {
  MdOutlineAdminPanelSettings,
  MdOutlineAssistantPhoto,
} from 'react-icons/md';
import { toast } from 'sonner';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Channel, Workspace } from '@/types/app';
import { useColorPrefrences } from '@/providers/color-prefrences';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from './ui/button';
import {
  addChannelToUser,
  updateChannelMembers,
  updateChannelRegulators,
} from '@/actions/channels';

type SearchBarProps = {
  currentWorkspaceData: Workspace;
  currentChannelData?: Channel;
  loggedInUserId: string;
};

const SearchBar: FC<SearchBarProps> = ({
  currentWorkspaceData,
  loggedInUserId,
  currentChannelData,
}) => {
  const { color } = useColorPrefrences();
  const router = useRouter();

  let backGroundColor = 'bg-[#7a4a7f] dark:bg-[#311834]';
  if (color === 'green') {
    backGroundColor = 'bg-green-200 dark:bg-green-900';
  } else if (color === 'blue') {
    backGroundColor = 'bg-blue-200 dark:bg-blue-900';
  }

  const isChannelMember = (memberId: string) => {
    return currentChannelData?.members?.includes(memberId) ?? false;
  };

  const isRegulator = (memberId: string) => {
    return currentChannelData?.regulators?.includes(memberId) ?? false;
  };

  const isChannelCreator = (memberId: string) => {
    return currentChannelData?.user_id === memberId;
  };

  const addUserToChannel = async (userId: string, channelId: string) => {
    // Add user to channel
    await updateChannelMembers(channelId, userId);

    // Add channel to user's channels
    await addChannelToUser(userId, channelId);

    router.refresh();
    toast.success('User added to channel');
  };

  const makeUserRegulator = async (userId: string, channelId: string) => {
    await updateChannelRegulators(userId, channelId);
    router.refresh();
    toast.success('User is now a regulator');
  };

  return (
    <div
      className={cn(
        'absolute h-10 w-[500px] px-3 top-2 rounded-md',
        backGroundColor
      )}
    >
      <Popover>
        <PopoverTrigger className='flex items-center space-x-2 w-full h-full'>
          <Search size={20} className='text-black dark:text-white' />
          <span className='text-sm text-black dark:text-white'>
            Search #{currentChannelData?.name ?? 'channel'}
          </span>
        </PopoverTrigger>
        <PopoverContent className='w-[500px]'>
          <ScrollArea className='rounded-md max-h-96'>
            {currentWorkspaceData?.members?.map(member => {
              return (
                <div
                  key={member.id}
                  className='flex items-center my-2 justify-between'
                >
                  <div className='flex items-center p-2'>
                    <span className='mr-2 text-sm text-black dark:text-white'>
                      {member?.name ?? member?.email}
                    </span>
                    {isRegulator(member.id) && (
                      <MdOutlineAssistantPhoto className='w-5 h-5' />
                    )}
                    {isChannelCreator(member.id) && (
                      <MdOutlineAdminPanelSettings className='w-5 h-5' />
                    )}
                  </div>

                  <div className='flex gap-x-2'>
                    {loggedInUserId !== member.id &&
                      !isRegulator(member.id) &&
                      isChannelMember(member.id) && (
                        <Button
                          className='text-[10px]'
                          size='sm'
                          variant='destructive'
                          onClick={() =>
                            makeUserRegulator(
                              member.id,
                              currentChannelData?.id!
                            )
                          }
                        >
                          Assign Regulator
                        </Button>
                      )}

                    {!isChannelMember(member.id) && (
                      <Button
                        className='text-[10px]'
                        size='sm'
                        disabled={isChannelMember(member.id)}
                        onClick={() =>
                          addUserToChannel(member.id, currentChannelData?.id!)
                        }
                      >
                        Add to Channel
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchBar;
