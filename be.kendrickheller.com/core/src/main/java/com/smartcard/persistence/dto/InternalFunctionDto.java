package com.smartcard.persistence.dto;

import java.io.Serializable;
import com.smartcard.persistence.dto.BaseDto;


public class InternalFunctionDto extends BaseDto implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long functionId;
	
	private Long moduleId;

	private String functionName;
	
	private String description;

	public InternalFunctionDto() {
	}

	public Long getFunctionId() {
		return functionId;
	}

	public void setFunctionId(Long functionId) {
		this.functionId = functionId;
	}

	public String getFunctionName() {
		return functionName;
	}

	public void setFunctionName(String functionName) {
		this.functionName = functionName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Long getModuleId() {
		return moduleId;
	}

	public void setModuleId(Long moduleId) {
		this.moduleId = moduleId;
	}

	@Override
	public boolean equals(Object obj) {
		if(!(obj instanceof InternalFunctionDto)){
			return false;
		}else{
			InternalFunctionDto dto = (InternalFunctionDto)obj;
			return dto.getFunctionId() == this.getFunctionId() && dto.getFunctionName() == this.getFunctionName()
					&& dto.getDescription() == this.getDescription();
		}
	}	
}