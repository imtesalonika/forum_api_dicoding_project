const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const UserDataEntity = require('../../../Domains/users/entities/UserDataEntity');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user and return registered user correctly', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      await userRepositoryPostgres.addUser(registerUser);

      const users = await UsersTableTestHelper.findUsersById('user-123');
      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: 'user-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
      }));
    });
  });

  describe('getPasswordByUsername', () => {
    it('should throw InvariantError when user not found', () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      return expect(userRepositoryPostgres.getPasswordByUsername('dicoding'))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should return username password when user is found', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret_password',
      });

      const password = await userRepositoryPostgres.getPasswordByUsername('dicoding');
      expect(password).toBe('secret_password');
    });
  });

  describe('getIdByUsername', () => {
    it('should throw InvariantError when user not found', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      await expect(userRepositoryPostgres.getIdByUsername('dicoding'))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should return user id correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'dicoding' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      const userId = await userRepositoryPostgres.getIdByUsername('dicoding');

      expect(userId).toEqual('user-321');
    });
  });

  describe('getUserDataById function', () => {
    it('should throw NotFoundError when user not found', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      const nonExistentUserId = 'user-nonexistent';

      await expect(userRepositoryPostgres.getUserDataById(nonExistentUserId))
        .rejects
        .toThrowError(NotFoundError);
      await expect(userRepositoryPostgres.getUserDataById(nonExistentUserId))
        .rejects
        .toThrowError(`user dengan id ${nonExistentUserId} tidak ditemukan`);
    });

    it('should return UserDataEntity correctly when user is found', async () => {
      const userId = 'user-getdata123';
      const userData = {
        id: userId,
        username: 'getdatatester',
        password: 'secret_password',
        fullname: 'Get Data Tester Fullname',
      };
      await UsersTableTestHelper.addUser(userData);
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      const retrievedUserData = await userRepositoryPostgres.getUserDataById(userId);

      expect(retrievedUserData).toBeInstanceOf(UserDataEntity);
      expect(retrievedUserData.id).toEqual(userData.id);
      expect(retrievedUserData.username).toEqual(userData.username);
      expect(retrievedUserData.fullname).toEqual(userData.fullname);
    });
  });
});