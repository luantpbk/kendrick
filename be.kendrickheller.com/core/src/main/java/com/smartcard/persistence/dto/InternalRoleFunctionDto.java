package com.smartcard.persistence.dto;

import java.io.Serializable;
import java.util.Map;

import com.smartcard.common.EnumActionType;

public class InternalRoleFunctionDto implements Serializable{
	private static final long serialVersionUID = 6979423914940057294L;
	
	private Long roleId;
	
	private Long functionId;
	
	private Integer permision;
	
	private Map<EnumActionType, Boolean> actions;
	

	public Long getRoleId() {
		return roleId;
	}

	public void setRoleId(Long roleId) {
		this.roleId = roleId;
	}

	public Long getFunctionId() {
		return functionId;
	}

	public void setFunctionId(Long functionId) {
		this.functionId = functionId;
	}
	
	public Integer getPermision() {
		return permision;
	}

	public void setPermision(Integer permision) {
		this.permision = permision;
	}
	


	public Map<EnumActionType, Boolean> getActions() {
		return actions;
	}

	public void setActions(Map<EnumActionType, Boolean> actions) {
		this.actions = actions;
	}
	
}
