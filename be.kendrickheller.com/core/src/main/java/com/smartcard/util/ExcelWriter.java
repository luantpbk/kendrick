package com.smartcard.util;

import com.smartcard.common.EnumGeneralError;
import com.smartcard.exception.GlobalException;
import com.smartcard.util.model.ExcelStyle;
import com.smartcard.util.model.ExcelCell;
import com.smartcard.util.model.ExcelData;
import com.smartcard.util.model.ExcelRow;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Date;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.WorkbookUtil;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class ExcelWriter {

	private Workbook hssfwb;
	private XSSFCellStyle dateStyle;

	public ExcelWriter() {
		hssfwb = new XSSFWorkbook();
		dateStyle = (XSSFCellStyle) hssfwb.createCellStyle();
		CreationHelper createHelper = hssfwb.getCreationHelper();
		dateStyle.setDataFormat(createHelper.createDataFormat().getFormat("yyyy/MM/dd"));
	}

	public Sheet getSheet(String sheetName) {
		Sheet sheet = hssfwb.getSheet(WorkbookUtil.createSafeSheetName(sheetName));
		if (sheet == null) {
			sheet = hssfwb.createSheet(WorkbookUtil.createSafeSheetName(sheetName));
		}
		return sheet;
	}

	private void setCellValue(Row newRow, ExcelCell cellData, int column) throws GlobalException {
		Cell cell = newRow.createCell(column);
		if (cellData == null) return;
		try {
			if(cellData.getValue() != null) 
				switch (cellData.getCellType()) {
					case STRING:
						cell.setCellValue(cellData.getValue().toString());
						break;
					case BOOLEAN:
						cell.setCellValue((Boolean) cellData.getValue());
						break;
					case NUMERIC:
						if (cellData.isDate()) {
							cell.setCellValue(cellData.getValue() instanceof  Date? (Date) cellData.getValue() : new Date((Long)cellData.getValue()));
							cell.setCellStyle(dateStyle);
						} else {
							cell.setCellValue(Double.valueOf(cellData.getValue().toString()));
						}
						break;
					case FORMULA:
						cell.setCellFormula(cellData.getValue().toString());
						break;
					default:
						break;
				}
			if (cellData.getStyle() != null) {
				CellStyle cellStyle = cellData.getStyle().build(hssfwb);
				cell.setCellStyle(cellStyle);
			}
		} catch (Exception e) {
			throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR,
					String.format("Không thể định dạng giá trị %s cột %d dòng %d", cellData.getValue().toString(), column, newRow.getRowNum()));
		}
		
	}

	private Row getRow(Sheet sheet, int row) {
		Row eRow = sheet.getRow(row);
		if (eRow == null)
			eRow = sheet.createRow(row);
		return eRow;
	}

	private void setRowValue(Sheet sheet, ExcelCell[] cells, int column, int row) throws GlobalException {
		Row eRow = getRow(sheet, row);
		if (cells == null)
			return;
		for (ExcelCell cell : cells) {
			setCellValue(eRow, cell, column);
			column++;
		}
	}

	private void setRowValue(Sheet sheet, ExcelRow excelRow, int column, int row) throws GlobalException {
		Row eRow = getRow(sheet, row);
		if (excelRow == null)
			return;
		int length = excelRow.size();
		for (int indx = 0; indx < length; indx++) {
			ExcelCell cell = excelRow.get(indx);
			setCellValue(eRow, cell, column + indx);
		}
	}

	public int writeToSheet(ExcelCell cell, String sheetName, int column, int row) throws GlobalException {
		Sheet sheet = getSheet(sheetName);
		Row eRow = getRow(sheet, row);
		setCellValue(eRow, cell, column);
		// sheet.autoSizeColumn(column);
		row++;
		return row;
	}

	public int writeToSheet(ExcelCell[][] rows, String sheetName, int column, int row) throws GlobalException {
		Sheet sheet = getSheet(sheetName);
		int maxColumn = column;
		for (ExcelCell[] cells : rows) {
			maxColumn = maxColumn > column + cells.length ? maxColumn : column + cells.length;
			setRowValue(sheet, cells, column, row);
			row++;
		}

		return row;
	}

	public int writeToSheet(ExcelCell[][] dataInRows, String sheetName) throws GlobalException {
		return writeToSheet(dataInRows, sheetName, 0, 0);
	}

	private void setHeader(Sheet sheet, List<String> columns, ExcelStyle cellStyle, int column, int row) {
		Row header = sheet.createRow(row);
		for (String collumnValue : columns) {
			Cell cell = header.createCell(column);
			cell.setCellValue(collumnValue);
			if (cellStyle != null) {
				cell.setCellStyle(cellStyle.build(hssfwb));
			}
			column++;
		}
	}

	public int writeToSheet(ExcelData table, String sheetName) throws GlobalException {
		return writeToSheet(table, sheetName, true, 0, 0);
	}

	public int writeToSheet(ExcelData table, String sheetName, int column, int row) throws GlobalException {
		return writeToSheet(table, sheetName, true, column, row);
	}

	public int writeToSheet(ExcelData table, String sheetName, boolean isHeader, int column, int row) throws GlobalException {
		Sheet sheet = getSheet(sheetName);
		if (isHeader) {
			// Write header
			setHeader(sheet, table.getColumns(), table.getHeaderStyle(), column, row);
			row++;
		}

		int length = table.size();
		int indx;
		for (indx = 0; indx < length; indx++) {
			ExcelRow excelRow = table.get(indx);
			int curRow = row + indx;
			setRowValue(sheet, excelRow, column, curRow);
		}

		return row + indx;
	}

	public void addMergedRegion(String sheetName, int firstRow, int lastRow, int firstCol, int lastCol) {
		Sheet sheet = getSheet(sheetName);
		CellRangeAddress cellRangeAddress = new CellRangeAddress(firstRow, lastRow, firstCol, lastCol);
		sheet.addMergedRegion(cellRangeAddress);
	}

	public void autoSizeColumn(String sheetName, int length) {
		Sheet sheet = getSheet(sheetName);
		for (int i = 0; i < length; i++) {
			sheet.autoSizeColumn(i, true);
			int autoWidth = sheet.getColumnWidth(i);
			if(autoWidth > 10000) sheet.setColumnWidth(i, 10000);
		}
	}

	public File writeToStream() throws GlobalException {
		String fileName = "/home/thanhluan/temp.xlsx";
		//String fileName = "temp.xlsx";
		try (OutputStream os = new FileOutputStream(fileName)) {
			hssfwb.write(os);
		} catch (IOException e) {
			e.printStackTrace();
			throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR, e);
		}

		return new File(fileName);
	}
}
