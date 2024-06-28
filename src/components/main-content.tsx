'use client';

import { useTheme } from 'next-themes';
import { FC, ReactNode } from 'react';

import { useColorPrefrences } from '@/providers/color-prefrences';
import { cn } from '@/lib/utils';

const MainContent: FC<{ children: ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const { color } = useColorPrefrences();

  let backgroundColor = 'bg-primary-dark';
  if (color === 'green') {
    backgroundColor = 'bg-green-700';
  } else if (color === 'blue') {
    backgroundColor = 'bg-blue-700';
  }

  return (
    <div
      className={cn('md:px-2 md:pb-2 md:pt-14 md:h-screen', backgroundColor)}
    >
      <main
        className={cn(
          'md:ml-[280px] lg:ml-[420px] md:h-full overflow-y-hidden',
          theme === 'dark' ? 'bg-[#232529]' : 'bg-white'
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default MainContent;
