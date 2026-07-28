package com.smartcard.common;

import java.util.HashMap;
import java.util.Map;

public enum EnumActionType {
    View(1),
    Add(2),
	Edit(4),
	Delete(8),
	Confirm(16);
	
	private int value;
	
	private static final Map<Integer, EnumActionType> lookup = new HashMap<Integer, EnumActionType>();

    static {
        for (EnumActionType e : EnumActionType.values()) {
            lookup.put(e.getValue(), e);
        }
    }
	
	private EnumActionType(int value) {
		this.value = value;
	}
	
	public int getValue() {
        return value;
    }
	
	public static EnumActionType get(int value) {
		return lookup.get(value);
	}
}
