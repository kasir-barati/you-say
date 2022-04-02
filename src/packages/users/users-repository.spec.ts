import { UserRepository } from './users-repository';

describe('UserRepository', () => {
    it('should be defined', () => {
        expect(new UserRepository()).toBeDefined();
    });
});
