import { FaPlus } from 'react-icons/fa6';
import slugify from 'slugify';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import Typography from '@/components/ui/typography';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import ImageUpload from '@/components/image-upload';
import { createWorkspace } from '@/actions/create-workspace';
import { useCreateWorkspaceValues } from '@/hooks/create-workspace-values';
import { useState } from 'react';

const CreateWorkspace = () => {
  const router = useRouter();
  const { imageUrl, updateImageUrl } = useCreateWorkspaceValues();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    name: z.string().min(2, {
      message: 'Workspace name should be at least 2 characters long',
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit({ name }: z.infer<typeof formSchema>) {
    const slug = slugify(name, { lower: true });
    const invite_code = uuidv4();
    setIsSubmitting(true);

    const result = await createWorkspace({ name, slug, invite_code, imageUrl });

    setIsSubmitting(false);

    if (result?.error) {
      console.error(result.error);
    }

    form.reset();
    updateImageUrl('');
    setIsOpen(false);
    router.refresh();
    toast.success('Workspace created successfully');
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => setIsOpen(prevValue => !prevValue)}
    >
      <DialogTrigger>
        <div className='flex items-center gap-2 p-2'>
          <Button variant='secondary'>
            <FaPlus />
          </Button>
          <Typography variant='p' text='Add Workspace' />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='my-4'>
            <Typography variant='h4' text='Create workspace' />
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Typography text='Name' variant='p' />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Your company name' {...field} />
                  </FormControl>
                  <FormDescription>
                    <Typography
                      variant='p'
                      text='This is your workspace name'
                    />
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ImageUpload />

            <Button disabled={isSubmitting} type='submit'>
              <Typography variant='p' text='Submit' />
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspace;
