package com.smartcard.common;

public enum EnumDuplicateAction {
    Ignore(1),
    Update(2),
	Error(3);
	
	private int value;
	
	private EnumDuplicateAction(int value) {
		this.value = value;
	}
	
	public int getValue() {
        return value;
    }
}
