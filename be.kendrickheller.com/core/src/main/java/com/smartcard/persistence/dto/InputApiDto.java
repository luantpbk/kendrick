package com.smartcard.persistence.dto;

public class InputApiDto {
	private String router;
	private Integer methodId;
	
	public InputApiDto() {
	}
	
	public InputApiDto(String router, Integer methodId) {
		this.router = router;
		this.methodId = methodId;
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
}
