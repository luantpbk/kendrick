package com.smartcard.common;

public enum EnumUserType {
    TALKER("TALKER"),
	USER("USER");
	
	private String value;
	
	private EnumUserType(String value) {
        this.value = value;
    }
     
    public String getValue() {
        return value;
    }
}
