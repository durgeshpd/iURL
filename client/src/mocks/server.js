import { setupServer } from 'msw/node';
import { authHandlers } from './handlers/authHandlers';
import { userHandlers } from './handlers/userHandlers';
import { urlHandlers } from './handlers/urlHandlers';

export const server = setupServer(
  ...authHandlers,
  ...userHandlers,
  ...urlHandlers
);
