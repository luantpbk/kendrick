package com.smartcard.common;

public enum EnumHttpMethod {
	GET(1, "GET"),
    POST(2, "POST"),
	PUT(3, "PUT"),
	DELETE(4, "DELETE");
	
	private int value;
	private String method;
	
	private EnumHttpMethod(int value, String method) {
		this.value = value;
		this.method = method;
	}
	
	public int getValue() {
        return value;
    }
	
	public String getMethod() {
        return method;
    }
	
	public static EnumHttpMethod findByMethod(String method){
	    for(EnumHttpMethod m : values()){
	        if( m.getMethod().equals(method)){
	            return m;
	        }
	    }
	    return null;
	}
}
