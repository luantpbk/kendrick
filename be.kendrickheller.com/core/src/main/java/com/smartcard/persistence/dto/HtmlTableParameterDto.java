package com.smartcard.persistence.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

/**
 * The Dto class for table email parameter
 * 
 */
public class HtmlTableParameterDto implements Serializable {
	
	private static final long serialVersionUID = 8079871323499390709L;
	private String tableName;
	private List<HtmlTableColumnDto> columns;
	private String tableCss;
	private String rowCss;
	
	public String getTableCss() {
		return tableCss;
	}

	public void setTableCss(String tableCss) {
		this.tableCss = tableCss;
	}

	public HtmlTableParameterDto() {
	}

	public List<HtmlTableColumnDto> getColumns() {
		return columns;
	}

	public void setColumns(List<HtmlTableColumnDto> columns) {
		this.columns = columns;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getRowCss() {
		return rowCss;
	}

	public void setRowCss(String rowCss) {
		this.rowCss = rowCss;
	}

	public static String p2sTable(List<HtmlTableParameterDto> value) {
		Gson gson = new Gson();
		return gson.toJson(value);
	}

	public static List<HtmlTableParameterDto> s2pTable(String value) {
		Gson gson = new Gson();
		Type type = new TypeToken<List<HtmlTableParameterDto>>() {}.getType();
		return gson.fromJson(value, type);
	}
}