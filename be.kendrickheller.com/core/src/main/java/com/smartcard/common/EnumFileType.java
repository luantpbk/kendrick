package com.smartcard.common;

public enum EnumFileType {
	Image(1,"images"),
	Document(2,"documents"),
	Audio(3,"audios"),
	Video(4,"videos"),
	Other(5,"other");
	
	private int value;
	private String subPath;
	private EnumFileType(int value, String subPath) {
        this.value = value;
        this.subPath = subPath;
    }
	public int getValue() {
		return value;
	}
	public String getSubPath() {
		return subPath;
	}
	
	public static EnumFileType fromId(int id) {
        for (EnumFileType type : values()) {
            if (type.getValue() == id) {
                return type;
            }
        }
        return null;
    }
}
