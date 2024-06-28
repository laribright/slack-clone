import { RefObject, useEffect, useState } from 'react';

type UseChatScrollHandlerProps = {
  chatRef: RefObject<HTMLDivElement>;
  bottomRef: RefObject<HTMLDivElement>;
  count: number;
};

export const useChatScrollHandler = ({
  chatRef,
  bottomRef,
  count,
}: UseChatScrollHandlerProps) => {
  const [hasInitializaed, setHasInitialized] = useState(false);

  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef?.current;

    const shouldAutoScroll = () => {
      if (!hasInitializaed && bottomDiv) {
        setHasInitialized(true);
        return true;
      }

      if (!topDiv) return false;

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

      return distanceFromBottom <= 100;
    };

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [bottomRef, chatRef, hasInitializaed, count]);
};
