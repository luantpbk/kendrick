package com.smartcard.persistence.dto;

import java.io.Serializable;

/**
 * The Dto class for simple email parameter
 * 
 */
public class HtmlTableColumnDto implements Serializable {
	
	private static final long serialVersionUID = 8079871323499390709L;
	private String columnTitle;
	private String columnName;
	private int dataType;
	private String columnCss;
	private String cellCss;
	
	public HtmlTableColumnDto() {
	}

	public int getDataType() {
		return dataType;
	}

	public void setDataType(int dataType) {
		this.dataType = dataType;
	}

	public String getColumnCss() {
		return columnCss;
	}

	public void setColumnCss(String columnCss) {
		this.columnCss = columnCss;
	}

	public String getColumnTitle() {
		return columnTitle;
	}

	public void setColumnTitle(String columnTitle) {
		this.columnTitle = columnTitle;
	}

	public String getColumnName() {
		return columnName;
	}

	public void setColumnName(String columnName) {
		this.columnName = columnName;
	}

	public String getCellCss() {
		return cellCss;
	}

	public void setCellCss(String cellCss) {
		this.cellCss = cellCss;
	}
	
}