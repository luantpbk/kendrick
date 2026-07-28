package com.smartcard.persistence.dto;

import java.io.Serializable;


/**
 * The persistent class for the user_role database table.
 * 
 */
public class InternalUserRoleDto implements Serializable {
	private static final long serialVersionUID = 1L;
	
	private Long roleId;
	private Long userId;

	public Long getRoleId() {
		return roleId;
	}

	public void setRoleId(Long roleId) {
		this.roleId = roleId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}
}