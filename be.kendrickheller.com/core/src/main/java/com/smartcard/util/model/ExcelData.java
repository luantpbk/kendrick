package com.smartcard.util.model;
import java.util.ArrayList;
import java.util.List;

public class ExcelData {
	private List<String> columns;
	private ExcelStyle headerStyle;
	private List<ExcelRow> rows;

	public ExcelData() {
		this.columns = new ArrayList<String>();
		this.rows = new ArrayList<ExcelRow>();
	}

	public ExcelData(ArrayList<String> columns, List<ExcelRow> rows) {
		this.columns = columns;
		this.rows = rows;
	}

	public ExcelData(ArrayList<String> columns, List<ExcelRow> rows, ExcelStyle headerStyle) {
		this.columns = columns;
		this.rows = rows;
		this.headerStyle = headerStyle;
	}

	public int size() {
		return rows.size();
	}
	
	public int columnSize() {
		int maxColumn = this.columns.size();
		if(this.rows.size() > 0) {
			maxColumn = maxColumn > this.rows.get(0).size() ? maxColumn : this.rows.get(0).size();
		}
		return maxColumn;
	}

	public ExcelRow get(int index) {
		return rows.get(index);
	}

	public void addColumn(String columnName) {
		if (columnName == null || columnName.isEmpty()) {
			int indx = 0;
			do {
				indx++;
				columnName = "column" + indx;
			} while (columns.contains(columnName));
		}
		columns.add(columnName);

		for (ExcelRow row : rows) {
			row.createCell();
		}
	}

	public ExcelRow createRow() {
		ExcelRow row = new ExcelRow();
		rows.add(row);
		return row;
	}

	public ExcelStyle getHeaderStyle() {
		return headerStyle;
	}

	public void setHeaderStyle(ExcelStyle headerStyle) {
		this.headerStyle = headerStyle;
	}
	
	public List<String> getColumns() {
		return columns;
	}
}
