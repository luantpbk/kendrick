package com.smartcard.common;

import java.io.Serializable;

public class ErrorResponseDto implements Serializable {
	private static final long serialVersionUID = 1L;

	private String errorCode;
	
	private String errorMessage;
	
	public ErrorResponseDto() {
		
	}

	public ErrorResponseDto(IEnumError err) {
		this.errorCode =  err.getCode();
		this.errorMessage =  err.getMessage();
	}
	
	public ErrorResponseDto(IEnumError err, String message) {
		this.errorCode =  err.getCode();
		this.errorMessage = message == null || message.isEmpty() ? err.getMessage() : message;
	}
	
	public String getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}
	
}