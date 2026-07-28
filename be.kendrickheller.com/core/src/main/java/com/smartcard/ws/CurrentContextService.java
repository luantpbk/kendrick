package com.smartcard.ws;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import com.google.gson.Gson;
import com.google.gson.internal.LinkedTreeMap;
import com.google.gson.reflect.TypeToken;
import com.smartcard.common.EnumGeneralError;
import com.smartcard.exception.GlobalException;
import com.smartcard.persistence.dto.InternalRoleDto;
import com.smartcard.security.filter.JwtTokenHelper;

import io.jsonwebtoken.Claims;

public final class CurrentContextService implements AutoCloseable {
	
	private static ThreadLocal<CurrentContextService> instance = new ThreadLocal<>();
	private HttpServletRequest httpRequest;
	private JwtTokenHelper tokenHelper = new JwtTokenHelper();
	private Gson gson = new Gson();
	
	private CurrentContextService(HttpServletRequest request) {
        this.httpRequest = request;
    }
	
	public static CurrentContextService create(HttpServletRequest request) {
		CurrentContextService context = new CurrentContextService(request);
        instance.set(context);
        return context;
    }
	
	public static CurrentContextService getCurrentContext() {
        return instance.get();
    }
	
	 @Override    
    public void close() {
        instance.remove();
    }
	
	public Long getLoginId() throws GlobalException {
		return new Long(getLoginClaims().getId());
	}
	
	public String getLoginName() throws GlobalException {
		return getLoginClaims().getAudience();
	}
	
	public String getUserType() throws GlobalException {
		return getLoginClaims().get("userType", String.class);
	}
	
	public String getFullName() throws GlobalException {
		return getLoginClaims().get("fullName", String.class);
	}
	
	public Claims getLoginClaims() throws GlobalException {
		try {
			String token = httpRequest.getHeader("Authorization");
			if(token == null || token.equals("")){
				throw new GlobalException(EnumGeneralError.UNAUTHORIZED);
			}
			Claims claims = tokenHelper.parseJWT(token);
			return claims;
		} catch (Exception e) {
			throw new GlobalException(EnumGeneralError.UNAUTHORIZED, e);
		}
	}
	
	public Boolean checkRole(String roleName) throws GlobalException {
		List<InternalRoleDto> listRole = getUserRoleList(getLoginClaims());
		if(listRole == null || listRole.size() ==0){
			return false;
		}
		for(InternalRoleDto dto: listRole){
			System.out.println("Role name: "  + dto.getRoleName());
			if(dto.getRoleName() != null && roleName.equals(dto.getRoleName())){
				return true;
			}
		}
		return false;
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List<InternalRoleDto> getUserRoleList(Claims claims) {
		List<LinkedTreeMap> userRoleList1 = gson.fromJson(claims.get("ROLES").toString(), List.class);
		List<InternalRoleDto> userRoleList = new ArrayList<InternalRoleDto>();
		for(LinkedTreeMap m:userRoleList1){
			InternalRoleDto dto = new InternalRoleDto();
			dto.setRoleId(new Double(m.get("roleId").toString()).longValue());
			dto.setRoleName(m.get("roleName").toString());
			dto.setRoleType(new Double(m.get("roleType").toString()).intValue());
			dto.setDescription(m.get("description").toString());
			userRoleList.add(dto);
		}
		return userRoleList;
	}
	
	public boolean loginIsAdmin() throws GlobalException {
		Claims claims = getLoginClaims(); 
		String rolesJSON = (String)claims.get("ROLES");
		Gson g = new Gson();
		Type listType = new TypeToken<ArrayList<InternalRoleDto>>(){}.getType();
		List<InternalRoleDto> userRoleList = g.fromJson(rolesJSON, listType); 
		if(userRoleList == null || userRoleList.size() == 0){
			return false;
		}
		System.out.println(new Gson().toJson(userRoleList));
		for(InternalRoleDto d: userRoleList){
			String roleName = d.getRoleName();
			if(roleName != null && roleName.equals("ADMIN")){
				return true;
			}
		}
		return false;
	}
}
