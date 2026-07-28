import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { RoleController } from '../controllers/RoleController';
import { ModuleController } from '../controllers/ModuleController';
import { FunctionController } from '../controllers/FunctionController';
import { ApiController } from '../controllers/ApiController';
import { InternalUserController } from '../controllers/InternalUserController';
import { InternalApiController } from '../controllers/InternalApiController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const idmRouter = Router();

// User
idmRouter.get('/user', UserController.findAll);
idmRouter.post('/user', UserController.create);
idmRouter.put('/user/:id', UserController.update);
idmRouter.get('/user/id/:id', UserController.getUserById);
idmRouter.get('/user/user-info', authMiddleware, UserController.getUserInfo);
idmRouter.post('/user/change-pass', authMiddleware, UserController.updatePassword);
idmRouter.post('/user/forgot/:email', UserController.forgotPassword);
idmRouter.delete('/user/id/:id', UserController.delete);
idmRouter.post('/user/search', UserController.search);
idmRouter.get('/user/load-with-paging/:limit/:offset', UserController.loadUserWithPagination);
idmRouter.post('/user/search-email', UserController.searchByEmail);
idmRouter.get('/user/search-login-name/:loginName', UserController.searchLoginName);
idmRouter.post('/user/count', UserController.count);
idmRouter.post('/user/register', UserController.register);
idmRouter.post('/user/otp/re-sent/:email', UserController.resentOtp);
idmRouter.post('/user/register-confirm-otp/:email/:otp', UserController.confirmOtp);
idmRouter.put('/user/update-profile', authMiddleware, UserController.updateProfile);
idmRouter.get('/user/:id/role', UserController.getRoles);
idmRouter.post('/user/:id/role/:roleId', UserController.addUserRole);
idmRouter.delete('/user/:id/role/:roleId', UserController.deleteUserRole);
idmRouter.get('/user/:id/role-function', UserController.getRoleFunctions);
idmRouter.get('/user/:id/function', UserController.getFunctions);

// Role
idmRouter.post('/role', RoleController.create);
idmRouter.put('/role/:id', RoleController.edit);
idmRouter.delete('/role/:id', RoleController.remove);
idmRouter.get('/role/:id', RoleController.get);
idmRouter.get('/role', RoleController.findAll);
idmRouter.post('/role/search', RoleController.search);
idmRouter.get('/role/:id/module/:moduleId/permision', RoleController.getRoleFunctions);
idmRouter.put('/role/:id/module/:moduleId/permision', RoleController.updateRoleFunctions);

// Module
idmRouter.get('/module', ModuleController.getModules);
idmRouter.get('/module/:id', ModuleController.getModule);
idmRouter.post('/module', ModuleController.createModule);
idmRouter.put('/module/:id', ModuleController.updateModule);
idmRouter.delete('/module/:id', ModuleController.deleteModule);

// Function
idmRouter.get('/function', FunctionController.getFunctions);
idmRouter.get('/function/:id', FunctionController.getFunction);
idmRouter.post('/function', FunctionController.createFunction);
idmRouter.put('/function/:id', FunctionController.updateFunction);
idmRouter.delete('/function/:id', FunctionController.deleteFunction);

// Api
idmRouter.get('/api', ApiController.getApis);
idmRouter.get('/api/:id', ApiController.getApi);
idmRouter.post('/api', ApiController.createApi);
idmRouter.put('/api/:id', ApiController.updateApi);
idmRouter.delete('/api/:id', ApiController.deleteApi);
idmRouter.get('/api/:id/function', ApiController.getApiFunctions);
idmRouter.post('/api/:id/function/:functionId', ApiController.addApiFunction);
idmRouter.delete('/api/:id/function/:functionId', ApiController.deleteApiFunction);

// InternalUser
idmRouter.post('/internal-user/login-name', InternalUserController.getByLoginNames);
idmRouter.post('/internal-user/id', InternalUserController.getByIds);
idmRouter.get('/internal-user/:id', InternalUserController.getById);
idmRouter.get('/internal-user/:id/role-function', InternalUserController.getRoleFunctions);
idmRouter.get('/internal-user/role/:roleName/user', InternalUserController.getUsersByRole);

// InternalApi
idmRouter.get('/internal-api', InternalApiController.getApi);
idmRouter.get('/internal-api/function', InternalApiController.getFunctions);
