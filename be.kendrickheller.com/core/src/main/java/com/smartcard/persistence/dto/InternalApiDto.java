package com.smartcard.persistence.dto;

import java.io.Serializable;
import com.smartcard.persistence.dto.BaseDto;

public class InternalApiDto extends BaseDto implements Serializable{

	private static final long serialVersionUID = 3278490011744337876L;
	private Long apiId;
	private String router;
	private Integer methodId;
	private Integer actionTypeId;

	public Long getApiId() {
		return apiId;
	}

	public void setApiId(Long apiId) {
		this.apiId = apiId;
	}

	public String getRouter() {
		return router;
	}

	public void setRouter(String router) {
		this.router = router;
	}

	public Integer getMethodId() {
		return methodId;
	}

	public void setMethodId(Integer methodId) {
		this.methodId = methodId;
	}

	public Integer getActionTypeId() {
		return actionTypeId;
	}

	public void setActionTypeId(Integer actionTypeId) {
		this.actionTypeId = actionTypeId;
	}
}
