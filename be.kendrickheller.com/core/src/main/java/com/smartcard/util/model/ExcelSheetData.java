package com.smartcard.util.model;

import java.util.HashMap;
import java.util.List;

public class ExcelSheetData {
	private String sheetName;
	private HashMap<String, Object> titles;
	public List<HashMap<String, Object>> rows;
	
	public ExcelSheetData(String sheetName, List<HashMap<String, Object>> rows, HashMap<String, Object> titles) {
		this.sheetName = sheetName;
		this.rows = rows;
		this.titles = titles;
	}
	
	public String getSheetName() {
		return sheetName;
	}
	
	public void setSheetName(String sheetName) {
		this.sheetName = sheetName;
	}
	
	public List<HashMap<String, Object>> getRows() {
		return rows;
	}
	
	public void setRows(List<HashMap<String, Object>> rows) {
		this.rows = rows;
	}

	public HashMap<String, Object> getTitles() {
		return titles;
	}

	public void setTitles(HashMap<String, Object> titles) {
		this.titles = titles;
	}

	public int size() {
		return rows.size();
	}

	public HashMap<String, Object> get(int rowIndx) {
		return rows.get(rowIndx);
	}
	
}
