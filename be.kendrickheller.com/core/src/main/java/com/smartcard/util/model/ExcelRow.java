package com.smartcard.util.model;

import java.util.ArrayList;
import java.util.List;

public class ExcelRow {
	private List<ExcelCell> cells;

	public ExcelRow() {
		cells = new ArrayList<ExcelCell>();
	}

	public ExcelRow(List<ExcelCell> cells) {
		this.cells = cells;
	}

	public int size() {
		return cells.size();
	}

	public ExcelCell get(int index) {
		return cells.get(index);
	}

	public void add(ExcelCell value) {
		cells.add(value);
	}

	public ExcelCell createCell() {
		ExcelCell cell = new ExcelCell();
		cells.add(cell);
		return cell;
	}
}
