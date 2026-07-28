package com.smartcard.persistence.dto;

import java.io.Serializable;

/**
 * The Dto class for notification parameter
 * 
 */
public class NotificationParameterDto implements Serializable {
	
	private static final long serialVersionUID = 8079871323499390709L;
	private String parameterName;
	private String description;
	private int dataType;
	
	public NotificationParameterDto() {
	}

	public int getDataType() {
		return dataType;
	}

	public void setDataType(int dataType) {
		this.dataType = dataType;
	}
	public String getParameterName() {
		return parameterName;
	}

	public void setParameterName(String parameterName) {
		this.parameterName = parameterName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
}