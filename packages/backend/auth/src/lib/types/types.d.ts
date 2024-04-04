declare namespace Express {
  export interface Request {
    user: import('@shared').User;
  }
  export interface Response {
    user: import('@shared').User;
  }
}
