package com.smartcard.persistence.dto;

import java.io.Serializable;
import com.smartcard.persistence.dto.BaseDto;

public class InternalApiFunctionDto extends BaseDto implements Serializable{

	private static final long serialVersionUID = 3278490011744337876L;
	private Long apiId;
	private Long functionId;
	
	public Long getApiId() {
		return apiId;
	}
	public void setApiId(Long apiId) {
		this.apiId = apiId;
	}
	public Long getFunctionId() {
		return functionId;
	}
	public void setFunctionId(Long functionId) {
		this.functionId = functionId;
	}
}
