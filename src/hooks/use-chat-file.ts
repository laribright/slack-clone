'use client';

import { useEffect, useState } from 'react';

import { supabaseBrowserClient } from '@/supabase/supabaseClient';

export const useChatFile = (filePath: string) => {
  const [publicUrl, setPublicUrl] = useState('');
  const [fileType, setFileType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const supabase = supabaseBrowserClient;

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const {
          data: { publicUrl },
        } = await supabase.storage.from('chat-files').getPublicUrl(filePath);

        if (publicUrl) {
          setPublicUrl(publicUrl);

          if (filePath.startsWith('chat/img-')) {
            setFileType('image');
          } else if (filePath.startsWith('chat/pdf-')) {
            setFileType('pdf');
          }
        }
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (filePath) {
      fetchFile();
    }
  }, [filePath, supabase.storage]);

  return { publicUrl, fileType, loading, error };
};
