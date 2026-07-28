package com.smartcard.ws;

import java.lang.reflect.Type;
import java.util.List;

import com.google.gson.reflect.TypeToken;
import com.smartcard.exception.GlobalException;
import com.smartcard.persistence.dto.InternalRoleDto;
import com.smartcard.persistence.dto.InternalRoleFunctionDto;
import com.smartcard.persistence.dto.InternalUserDto;
import com.smartcard.util.PropertyUtil;

public class UserCrossService {
	private final static PropertyUtil prop = new PropertyUtil();
	private final static String SERVICE = prop.get("idm-service");
	
	public static List<InternalUserDto> getUserByLoginNames(List<String> loginNames) throws GlobalException {
		Type type = new TypeToken<List<InternalUserDto>>() {}.getType();
		List<InternalUserDto> users = HttpCrossService.getService().post(type, SERVICE + "/rest-api/internal-user/login-name", loginNames);
		return users;
	}
	
	public static InternalUserDto getUserById(Long id) throws GlobalException {
		Type type = new TypeToken<InternalUserDto>() {}.getType();
		InternalUserDto user = HttpCrossService.getService().get(type, SERVICE + "/rest-api/internal-user/" + id);
		return user;
	}
	
	public static List<InternalUserDto> getUserByIds(List<Long> ids) throws GlobalException {
		Type type = new TypeToken<List<InternalUserDto>>() {}.getType();
		List<InternalUserDto> users = HttpCrossService.getService().post(type, SERVICE + "/rest-api/internal-user/id", ids);
		return users;
	}
	
	public static List<InternalRoleFunctionDto> getFunctions(Long id) throws GlobalException {
		Type type = new TypeToken<List<InternalRoleFunctionDto>>() {}.getType();
		List<InternalRoleFunctionDto> functions = HttpCrossService.getService().get(type, SERVICE + "/rest-api/internal-user/" + id + "/role-function");
		return functions;
	}
	
	public static List<InternalUserDto> getUsersByRole(String roleName) throws GlobalException {
		Type type = new TypeToken<List<InternalUserDto>>() {}.getType();
		List<InternalUserDto> users = HttpCrossService.getService().get(type, SERVICE + "/rest-api/internal-user/role/" + roleName + "/user");
		return users;
	}
	
	public static InternalRoleDto getCustomerRole(Long userId) throws GlobalException {
		Type type = new TypeToken<InternalRoleDto>() {}.getType();
		InternalRoleDto role = HttpCrossService.getService().get(type, SERVICE + "/rest-api/internal-role/user/" + userId + "/customer-role");
		return role;
	}
}
