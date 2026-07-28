package com.smartcard.util.model;

public class ImportExcelMappingField {
	
	private String fieldName;
	private String column;
	private boolean isRequire;
	
	public ImportExcelMappingField() {
	}
	
	public ImportExcelMappingField(String fieldName, String column, boolean isRequire) {
		this.fieldName = fieldName;
		this.column = column;
		this.isRequire = isRequire;
	}
	
	public String getFieldName() {
		return fieldName;
	}
	public void setFieldName(String fieldName) {
		this.fieldName = fieldName;
	}
	public String getColumn() {
		return column;
	}
	public void setColumn(String column) {
		this.column = column;
	}
	public boolean isRequire() {
		return isRequire;
	}
	public void setRequire(boolean isRequire) {
		this.isRequire = isRequire;
	}
}
