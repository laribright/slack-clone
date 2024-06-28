import { NextApiRequest } from 'next';
import { Server as NetServer } from 'http';
import { Server as SockerServer } from 'socket.io';

import { SockerIoApiResponse } from '@/types/app';

const initializeSocketServer = (httpServer: NetServer): SockerServer => {
  const path = '/api/web-socket/io';
  return new SockerServer(httpServer, {
    path,
    addTrailingSlash: false,
  });
};

const handler = async (req: NextApiRequest, res: SockerIoApiResponse) => {
  if (!res.socket.server.io) {
    res.socket.server.io = initializeSocketServer(
      res.socket.server.io as unknown as NetServer
    );
  }

  res.end();
};

export default handler;
