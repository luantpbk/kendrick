package com.smartcard.util.model;
import org.apache.poi.ss.usermodel.CellType;

public class ExcelCell {
	private Object value;
	private ExcelStyle style;
	private CellType cellType;
	private boolean isDate = false;
	
	public ExcelCell() {
	}
	
	public ExcelCell(Object value, CellType cellType) {
		this.value = value;
		this.cellType = cellType;
	}
		
	public Object getValue() {
		return value;
	}
	
	public void setValue(Object value) {
		this.value = value;
	}
	
	public CellType getCellType() {
		return cellType;
	}

	public void setCellType(CellType cellType) {
		this.cellType = cellType;
	}

	public boolean isDate() {
		return isDate;
	}

	public void setDate(boolean isDate) {
		this.isDate = isDate;
	}

	public ExcelStyle getStyle() {
		return style;
	}

	public void setStyle(ExcelStyle style) {
		this.style = style;
	}
}
