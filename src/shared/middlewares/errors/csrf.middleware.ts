import { HttpStatus } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export function csrfMiddlewareError(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    console.log(err);
    console.log(req.body);
    console.log(req.query);
    console.log(req.headers);
    if (err.code !== 'EBADCSRFTOKEN') return next(err);

    // Tampered with cross-site request forgery!
    res.status(HttpStatus.FORBIDDEN).json({
        statusCode: HttpStatus.FORBIDDEN,
        message: err.message,
    });
}
