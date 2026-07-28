package com.smartcard.persistence.dto;

import java.io.Serializable;
import com.smartcard.persistence.dto.BaseDto;

public class InternalModuleDto extends BaseDto implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long functionId;
	
	private Long moduleId;

	private String moduleName;
	
	private String description;

	public InternalModuleDto() {
	}

	public Long getFunctionId() {
		return functionId;
	}

	public void setFunctionId(Long functionId) {
		this.functionId = functionId;
	}

	public String getModuleName() {
		return moduleName;
	}

	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
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
}