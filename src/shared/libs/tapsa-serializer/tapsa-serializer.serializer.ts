import { Pagination } from '@src/shared/libs/tapsa-repository/tapsa-repository.type';

import {
    PaginatedSerializable,
    Serializable,
} from './tapsa-serializer.serializable';

export abstract class BaseSerializer<Tentity, Trodto> {
    public abstract serialize(
        value: Tentity,
        outputType?: string,
    ): Promise<Trodto>;

    public abstract serializePaginated(
        value: Pagination<Tentity>,
        outputType?: string,
    ): Promise<Pagination<Trodto>>;

    public serializeCollection(
        values: Tentity[],
        outputType?: string,
    ): Promise<Trodto[]> {
        return Promise.all<Trodto>(
            values.map((v) => this.serialize(v, outputType)),
        );
    }

    public markSerializableValue(
        value: Tentity,
        outputType?: string,
    ): Serializable<Trodto> {
        return new Serializable<Trodto>(
            this.serialize.bind(this, value, outputType),
        );
    }

    public markSerializableCollection(
        values: Tentity[],
        outputType?: string,
    ): Serializable<Trodto[]> {
        return new Serializable<Trodto[]>(
            this.serializeCollection.bind(this, values, outputType),
        );
    }

    public markSerializablePaginatedValue(
        value: Pagination<Tentity>,
        outputType?: string,
    ): PaginatedSerializable<Trodto> {
        return new PaginatedSerializable<Trodto>(
            this.serializePaginated.bind(this, value, outputType),
        );
    }
}
