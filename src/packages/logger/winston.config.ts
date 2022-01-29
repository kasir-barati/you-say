import { registerAs } from '@nestjs/config';
import { format, transports } from 'winston';
import {
    utilities as nestWinstonModuleUtilities,
    WinstonModuleOptions,
} from 'nest-winston';

export default registerAs(
    'loggerConfigs',
    (): WinstonModuleOptions | never => ({
        format: format.combine(format.timestamp()),
        transports: [
            new transports.Console({
                format: format.combine(
                    format.timestamp(),
                    nestWinstonModuleUtilities.format.nestLike(),
                ),
            }),
            new transports.File({
                format: format.combine(
                    format.timestamp(),
                    nestWinstonModuleUtilities.format.nestLike(),
                ),
                filename: 'app.log',
            }),
        ],
    }),
);

const moreCustomizedWinstonModuleOptions = [
    new transports.Console({
        format: format.printf((args) => {
            const {
                level,
                context,
                timestamp,
                message,
                stack,
                trace,
            } = args;
            let text = '';
            if (level === 'error') {
                if (stack[0] != undefined || trace != undefined) {
                    console.log(stack);
                    const lines =
                        trace != undefined
                            ? trace.split('\n')
                            : stack[0].split('\n');
                    lines[0] = message + ' ' + lines[0];
                    text = lines.join('\n');
                } else {
                    text = message;
                }
            } else if (level === 'info') {
                text = message;
            } else if (level === 'warn') {
                text = message;
            } else if (level === 'debug') {
                text = message;
            } else if (level === 'verbose') {
                text = message;
            }

            return `${`[Petgro] ${process.pid}   -`} ${new Date(
                timestamp,
            ).toLocaleString()}   ${
                context ? '[' + context + ']' : ''
            } ${text}`;
        }),
    }),
];
