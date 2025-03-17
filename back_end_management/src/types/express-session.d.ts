import { SessionData } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: { id: string; email: string };
  }
}

declare module 'express' {
  interface Request {
    session: SessionData;
  }
}
