package com.smartcard.util.model;

import java.util.ArrayList;
import java.util.List;

public class ImportExcelMapping {
	private String sheetName;
	private int fromRow;
	private int toRow;
	private List<ImportExcelMappingField> mappingFields;

	public ImportExcelMapping() {
		mappingFields = new ArrayList<ImportExcelMappingField>();
	}

	public static String columnIndexToName(int index) {
		int quotient = (index) / 26;
		if (quotient > 0) {
			return columnIndexToName(quotient - 1) + (char) ((index % 26) + 65);
		} else {
			return "" + (char) ((index % 26) + 65);
		}
	}

	public void addField(String fieldName, String column, boolean isRequire) {
		mappingFields.add(new ImportExcelMappingField(fieldName, column, isRequire));
	}

	public ImportExcelMappingField addField() {
		ImportExcelMappingField field = new ImportExcelMappingField();
		mappingFields.add(field);
		return field;
	}

	public String getSheetName() {
		return sheetName;
	}

	public void setSheetName(String sheetName) {
		this.sheetName = sheetName;
	}

	public int getFromRow() {
		return fromRow;
	}

	public void setFromRow(int fromRow) {
		this.fromRow = fromRow;
	}

	public int getToRow() {
		return toRow;
	}

	public void setToRow(int toRow) {
		this.toRow = toRow;
	}

	public List<ImportExcelMappingField> getMappingFields() {
		return mappingFields;
	}

	public void setMappingFields(List<ImportExcelMappingField> mappingFields) {
		this.mappingFields = mappingFields;
	}

	public int size() {
		return mappingFields.size();
	}

	public ImportExcelMappingField get(int fieldIndx) {
		return mappingFields.get(fieldIndx);
	}

}
