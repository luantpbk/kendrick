package com.smartcard.persistence.dto;

import java.io.Serializable;

public class SessionInfoDto extends BaseDto implements Serializable {
	private static final long serialVersionUID = -2803403572656548033L;

	private String sessionInfoId;
	
	private Long userId;
	
	private String loginName;
	
	private String refreshToken;
	
	private String userType;
	
	public String getSessionInfoId() {
		return sessionInfoId;
	}

	public void setSessionInfoId(String sessionInfoId) {
		this.sessionInfoId = sessionInfoId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getLoginName() {
		return loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	public String getRefreshToken() {
		return refreshToken;
	}

	public void setRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
	}

	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}
}
