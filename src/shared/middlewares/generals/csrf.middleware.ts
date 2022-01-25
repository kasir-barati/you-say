import { NextFunction, Request, Response } from 'express';

export function csrfMiddleware(
    req: any,
    res: Response,
    next: NextFunction,
) {
    const token = req.csrfToken();
    res.cookie('XSRF-TOKEN', token);

    next();
}
