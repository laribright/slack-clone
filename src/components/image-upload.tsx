import Image from 'next/image';
import { ImCancelCircle } from 'react-icons/im';

import { useCreateWorkspaceValues } from '@/hooks/create-workspace-values';
import { UploadDropzone } from '@/lib/uploadthing';

const ImageUpload = () => {
  const { imageUrl, updateImageUrl } = useCreateWorkspaceValues();

  if (imageUrl) {
    return (
      <div className='flex items-center justify-center h-32 w-32 relative'>
        <Image
          src={imageUrl}
          className='object-cover w-full h-full rounded-md'
          alt='workspace'
          width={320}
          height={320}
        />
        <ImCancelCircle
          size={30}
          onClick={() => updateImageUrl('')}
          className='absolute cursor-pointer -right-2 -top-2 z-10 hover:scale-110'
        />
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint='workspaceImage'
      onClientUploadComplete={res => {
        updateImageUrl(res?.[0].url);
      }}
      onUploadError={err => console.log(err)}
    />
  );
};

export default ImageUpload;
