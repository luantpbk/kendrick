package com.smartcard.exception;

import com.smartcard.common.IEnumError;

public class GlobalException extends Exception {

	private static final long serialVersionUID = -993111018031923867L;
	private IEnumError error;
	private String message;
	
	public GlobalException(IEnumError error) {
		this.error = error;
	}
	
	public GlobalException(IEnumError error, Throwable cause) {
		super(error.getMessage(), cause);
		this.error = error;
	}
	
	public GlobalException(IEnumError error, Throwable cause, String message) {
		super(message, cause);
		this.error = error;
		this.message = message;
	}
	
	public GlobalException(IEnumError error, String message) {
		super(message);
		this.error = error;
		this.message = message;
	}
	
	public IEnumError getError() {
		return error;
	}

	public String getMessage() {
		return message;
	}
	
	
}
