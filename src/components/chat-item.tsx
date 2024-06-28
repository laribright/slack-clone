import { FC, useEffect, useState } from 'react';

import { Channel, User } from '@/types/app';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Typography from '@/components/ui/typography';
import {
  MdOutlineAdminPanelSettings,
  MdOutlineAssistantPhoto,
} from 'react-icons/md';
import { useChatFile } from '@/hooks/use-chat-file';
import Link from 'next/link';
import Image from 'next/image';
import { Form, FormControl, FormField, FormItem } from './ui/form';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Edit, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import axios from 'axios';

type ChatItemProps = {
  id: string;
  content: string | null;
  user: User;
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentUser: User;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
  channelData?: Channel;
};

const formSchema = z.object({
  content: z.string().min(2),
});

const ChatItem: FC<ChatItemProps> = ({
  content,
  currentUser,
  deleted,
  id,
  isUpdated,
  socketQuery,
  socketUrl,
  timestamp,
  user,
  channelData,
  fileUrl,
}) => {
  const { publicUrl, fileType } = useChatFile(fileUrl!);
  const [isEditing, setIsEditing] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content ?? '',
    },
  });

  const isSuperAdmin = currentUser.id === channelData?.user_id;
  const isRegulator =
    channelData?.regulators?.includes(currentUser.id) ?? false;
  const isOwner = currentUser.id === user.id;
  const canDeleteMessage = !deleted && (isOwner || isSuperAdmin || isRegulator);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPdf = fileType === 'pdf' && fileUrl;
  const isImage = fileType === 'image' && fileUrl;
  const isLoading = form.formState.isSubmitting;

  useEffect(() => form.reset({ content: content ?? '' }), [content, form]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const onSubmit = async ({ content }: z.infer<typeof formSchema>) => {
    const url = `${socketUrl}/${id}?${new URLSearchParams(socketQuery)}`;
    await axios.patch(url, { content });
    setIsEditing(false);
    form.reset();
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const url = `${socketUrl}/${id}?${new URLSearchParams(socketQuery)}`;
    await axios.delete(url);
    setIsDeleting(false);
    setOpenDeleteDialog(false);
  };

  const FilePreview = () => (
    <>
      {isImage && (
        <Link
          href={publicUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-28 w-48'
        >
          <Image
            src={publicUrl}
            alt={content ?? ''}
            fill
            className='object-cover'
          />
        </Link>
      )}
      {isPdf && (
        <div className='flex flex-col items-start justify-center gap-2 px-2 py-1 border rounded-md shadow bg-white dark:bg-gray-800'>
          <Typography
            variant='p'
            text='shared a file'
            className='text-lg font-semibold text-gray-700 dark:text-gray-200'
          />
          <Link
            href={publicUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-300 ease-in-out'
          >
            View PDF
          </Link>
        </div>
      )}
    </>
  );

  const EditableContent = () =>
    isEditing ? (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset
            className='flex items-center w-full gap-x-2 pt-2'
            disabled={isLoading}
          >
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormControl>
                    <Input
                      className='p-2 border-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                      placeholder='edited message'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button size='sm'>Save</Button>
          </fieldset>
        </form>
        <span className='text-[10px]'>Press ESC to cancel, enter to save</span>
      </Form>
    ) : (
      <div
        className={cn('text-sm', { 'text-xs opacity-90 italic': deleted })}
        dangerouslySetInnerHTML={{ __html: content ?? '' }}
      />
    );

  const DeleteDialog = () => (
    <Dialog
      onOpenChange={() => setOpenDeleteDialog(!openDeleteDialog)}
      open={openDeleteDialog}
    >
      <DialogTrigger>
        <Trash size={20} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            message.
          </DialogDescription>
          <div className='text-center'>
            {isPdf && (
              <div className='items-start justify-center gap-3 relative'>
                <Typography variant='p' text='Shared a PDF file' />
                <Link
                  href={publicUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 hover:underline'
                >
                  View PDF
                </Link>
              </div>
            )}
            {!fileUrl && !isEditing && (
              <div
                className='text-sm'
                dangerouslySetInnerHTML={{ __html: content ?? '' }}
              />
            )}
            {isImage && (
              <Link
                href={publicUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48 mx-auto'
              >
                <Image
                  src={publicUrl}
                  alt={content ?? ''}
                  fill
                  className='object-cover'
                />
              </Link>
            )}
          </div>
        </DialogHeader>

        <div className='flex flex-col gap-2'>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            className='w-full'
            variant='secondary'
            disabled={isDeleting}
          >
            No, Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className='w-full'
            variant='destructive'
            disabled={isDeleting}
          >
            Yes, Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className='relative group flex items-center hover:bg-black/5 px-1 py-2 rounded transition w-full'>
      <div className='flex gap-x-2'>
        <div className='cursor-pointer hover:drop-shadow-md transition'>
          <Avatar>
            <AvatarImage
              src={user.avatar_url}
              alt={user.name ?? user.email}
              className='object-cover w-full h-full'
            />
            <AvatarFallback className='bg-neutral-700'>
              <Typography variant='p' text={user.name?.slice(0, 2) ?? 'UN'} />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className='flex flex-col w-full'>
          <div className='flex items-center gap-x-2'>
            <Typography
              variant='p'
              text={user.name ?? user.email}
              className='font-semibold text-sm hover:underline cursor-pointer'
            />
            {isSuperAdmin && (
              <MdOutlineAdminPanelSettings className='w-5 h-5' />
            )}
            {isRegulator && <MdOutlineAssistantPhoto className='w-5 h-5' />}
            {isUpdated && !deleted && <span className='text-xs'>(edited)</span>}
            <span>{timestamp}</span>
          </div>
          <FilePreview />
          {!fileUrl && <EditableContent />}
        </div>
      </div>

      {canDeleteMessage && (
        <div className='hidden absolute group-hover:flex flex-row gap-2 border bg-white dark:bg-black dark:text-white text-black rounded-md p-2 top-0 -translate-y-1/3 right-0'>
          <DeleteDialog />
          {canEditMessage && (
            <Edit
              className='cursor-pointer'
              size={20}
              onClick={() => setIsEditing(true)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ChatItem;
