import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
    PaginatedSerializable,
    Serializable,
} from './tapsa-serializer.serializable';

@Injectable()
export class SerializerInterceptor implements NestInterceptor {
    private async serializeResponse(response: any): Promise<any> {
        if (typeof response !== 'object' || response === null) {
            return of(response);
        } else if (
            response instanceof Serializable ||
            response instanceof PaginatedSerializable
        ) {
            const result = await response.serialize();

            return result;
        } else {
            const serializedProperties = await Promise.all(
                Object.keys(response).map(async (key) => {
                    const value = response[key];

                    if (
                        !(
                            value instanceof Serializable ||
                            value instanceof PaginatedSerializable
                        )
                    ) {
                        return {
                            key,
                            value,
                        };
                    }

                    const serializedValue = await value.serialize();

                    return {
                        key,
                        value: serializedValue,
                    };
                }),
            );

            return serializedProperties.reduce((result, { key, value }) => {
                result[key] = value;

                return result;
            }, {});
        }
    }

    private toSerialize(data: any): boolean {
        const types = ['string', 'boolean', 'number'];

        return !types.find((type) => typeof data === type);
    }

    public intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        return next.handle().pipe(
            switchMap((response) => {
                if (
                    response === undefined ||
                    response === null ||
                    !this.toSerialize(response)
                ) {
                    return of(response);
                }
                return from(this.serializeResponse(response));
            }),
        );
    }
}
