package com.smartcard.util;

import com.smartcard.common.EnumGeneralError;
import com.smartcard.exception.GlobalException;
import com.smartcard.util.model.AssignPropertyResult;
import com.smartcard.util.model.ExcelSheetData;
import com.smartcard.util.model.IAssignPropertyEvent;
import com.smartcard.util.model.ImportExcelMapping;
import com.smartcard.util.model.ImportExcelMappingField;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.BeanUtilsBean;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.ss.usermodel.DateUtil;

public class ExcelReader {

	private Workbook hssfwb;
	private FormulaEvaluator evaluator;
	private BeanUtilsBean bean = new BeanUtilsBean();

	public ExcelReader(String filePath) throws GlobalException, FileNotFoundException {
		this(new File(filePath));
	}

	public ExcelReader(InputStream fileStream, String fileName) throws GlobalException {
		try {
			if (fileName.contains("-xls")) {
				this.hssfwb = new HSSFWorkbook(fileStream);
			} else {
				this.hssfwb = new XSSFWorkbook(fileStream);
			}
			evaluator = this.hssfwb.getCreationHelper().createFormulaEvaluator();
			fileStream.close();
		} catch (IOException e) {
			throw new GlobalException(EnumGeneralError.INVALID_PARAM, e);
		}
	}

	public ExcelReader(File file) throws GlobalException, FileNotFoundException {
		this(new FileInputStream(file), file.getName());
	}

	private Integer getIndexIfCellIsInMergedCells(Sheet sheet, int row, int column) {
		int numberOfMergedRegions = sheet.getNumMergedRegions();
		for (int i = 0; i < numberOfMergedRegions; i++) {
			CellRangeAddress mergedCell = sheet.getMergedRegion(i);
			if (mergedCell.isInRange(row, column)) {
				return i;
			}
		}
		return null;
	}

	private Object getNoneTypeValue(Cell cell) {
		Object value = "";
		try {
			value = cell.getStringCellValue();
		} catch (Exception e) {
			try {
				value = cell.getDateCellValue();
			} catch (Exception e1) {
				try {
					value = cell.getNumericCellValue();
				} catch (Exception e2) {
					try {
						value = cell.getBooleanCellValue();
					} catch (Exception e3) {
						value = String.format("Wrong value: %s", e3.getMessage());
					}
				}
			}
		}

		return value;
	}

	private Object getCellValue(Cell cell) {
		if (cell == null)
			return null;
		CellType type = cell.getCellTypeEnum();

		String formulaMessage = "";
		if (type.equals(CellType.FORMULA)) {
			try {
				evaluator.evaluateFormulaCellEnum(cell);
				type = cell.getCachedFormulaResultTypeEnum();
			} catch (Exception ex) {
				formulaMessage = cell.getCellFormula() + " => " + ex.getMessage();
			}
		}
		switch (type) {
		case BOOLEAN:
			return cell.getBooleanCellValue();
		case NUMERIC:
			if (DateUtil.isCellDateFormatted(cell)) {
				return cell.getDateCellValue();
			} else {
				return cell.getNumericCellValue();
			}
		case STRING:
			return cell.getStringCellValue();
		case FORMULA:
			return formulaMessage;

		case _NONE:
			return getNoneTypeValue(cell);

		case BLANK:
		case ERROR:
		default:
			return null;
		}
	}

	private String getExcelColumnName(int columnNumber) {
		int dividend = columnNumber;
		String columnName = "";
		int modulo;
		while (dividend > 0) {
			modulo = (dividend - 1) % 26;
			columnName = String.format("%c%s", (char) (65 + modulo), columnName);
			dividend = (int) ((dividend - modulo) / 26);
		}

		return columnName;
	}

	private Cell getCell(Sheet sheet, Row row, Integer rowIndex, Integer colNum) {
		Cell cell;
		Integer mergedCellIndex = getIndexIfCellIsInMergedCells(sheet, rowIndex, colNum);
		if (mergedCellIndex == null) {
			cell = row.getCell(colNum, Row.MissingCellPolicy.RETURN_NULL_AND_BLANK);
		} else {
			CellRangeAddress mergedCells = sheet.getMergedRegion(mergedCellIndex);
			cell = row.getCell(mergedCells.getFirstColumn(), Row.MissingCellPolicy.RETURN_NULL_AND_BLANK);
		}
		return cell;
	}

	public List<String> getSheets() {
		List<String> sheets = new ArrayList<String>();
		for (int i = 0; i < hssfwb.getNumberOfSheets(); i++) {
			Sheet sheet = hssfwb.getSheetAt(i);
			String sName = sheet.getSheetName();
			sName = sName != null ? sName.trim() : "";
			sheets.add(sName);
		}
		return sheets;
	}

	public List<ExcelSheetData> readSheet(String sheetName, Integer fromRowNum, Integer toRowNum, Integer maxRows,
			Integer titleRowNum) {
		List<ExcelSheetData> sheetDatas = new ArrayList<ExcelSheetData>();
		if (fromRowNum == null)
			fromRowNum = 1;
		Integer fromRowIndex = fromRowNum - 1;
		Integer toRowIndex = toRowNum != null && toRowNum > 0 ? toRowNum - 1 : null;
		Integer titleRowIndex = titleRowNum != null && titleRowNum > 0 ? titleRowNum - 1
				: fromRowIndex > 0 ? fromRowIndex - 1 : 0;

		for (int i = 0; i < hssfwb.getNumberOfSheets(); i++) {
			Sheet sheet = hssfwb.getSheetAt(i);
			String sName = sheet.getSheetName();
			sName = sName != null ? sName.trim() : "";
			sheetName = sheetName != null ? sheetName.trim() : "";
			if (!sheetName.isEmpty() && !sName.equals(sheetName))
				continue;
			Integer maxrowsCount = sheet.getLastRowNum();
			maxrowsCount = maxRows == null || maxRows > maxrowsCount ? sheet.getLastRowNum() + 1 : maxRows;
			List<HashMap<String, Object>> sheetData = new ArrayList<HashMap<String, Object>>();
			HashSet<String> columns = new HashSet<String>();
			// Lấy title
			HashMap<String, Object> titles = new HashMap<String, Object>();
			Row titleRow = sheet.getRow(titleRowIndex);
			if (titleRow != null) {
				int lastColumn = titleRow.getLastCellNum();
				for (int colNum = 0; colNum < lastColumn; colNum++) {
					Cell cell = getCell(sheet, titleRow, titleRowIndex, colNum);
					if (cell == null)
						continue;
					String columnName = getExcelColumnName(cell.getColumnIndex() + 1);
					if (!columns.contains(columnName))
						columns.add(columnName);
					Object titleValue = getCellValue(cell);
					titles.put(columnName, titleValue);
				}
			}

			// Lấy data
			int continuousRowEmpty = 0;
			for (int rowNum = fromRowIndex; rowNum < fromRowIndex + maxrowsCount
					&& (toRowIndex == null || rowNum <= toRowIndex); rowNum++) {
				HashMap<String, Object> rowData = new HashMap<String, Object>();
				Row row = sheet.getRow(rowNum);
				if (row == null) {
					continuousRowEmpty++;
					if (continuousRowEmpty > 100)
						break;
				} else {
					if (continuousRowEmpty > 100)
						break;
					int continuousColumnEmpty = 0;
					boolean isRowEmpty = true;
					int lastColumn = row.getLastCellNum();
					for (int colNum = 0; colNum < lastColumn; colNum++) {
						Cell cell = getCell(sheet, row, rowNum, colNum);
						if (cell == null)
							continue;
						String columnName = getExcelColumnName(cell.getColumnIndex() + 1);
						if (!columns.contains(columnName))
							columns.add(columnName);
						Object cellValue = getCellValue(cell);
						rowData.put(columnName, cellValue);
						if (cellValue == null) {
							continuousColumnEmpty++;
							if (continuousColumnEmpty > 100)
								break;
						} else {
							isRowEmpty = false;
							continuousColumnEmpty = 0;
						}
					}
					continuousRowEmpty = isRowEmpty ? continuousRowEmpty + 1 : 0;
				}

				sheetData.add(rowData);
			}

			// set default value for null column
			for (String column : columns) {
				for (HashMap<String, Object> row : sheetData) {
					if (!row.containsKey(column)) {
						row.put(column, null);
					}
				}
			}

			sheetDatas.add(new ExcelSheetData(sName, sheetData, titles));
		}
		return sheetDatas;
	}

	public <T> List<T> readSheetEntity(ImportExcelMapping mapping, Class<T> type,
			IAssignPropertyEvent<T> onAssignProperty) throws GlobalException {
		Field[] fields = type.getDeclaredFields();
		Map<Field, String> displayNames = new HashMap<Field, String>();
		for (Field field : fields) {
			displayNames.put(field, field.getName());
		}
		ExcelSheetData data = readSheet(mapping.getSheetName(), mapping.getFromRow(), mapping.getToRow(), null, null)
				.get(0);
		List<T> lstData = new ArrayList<T>();
		int rowLength = data.size();
		for (int rowIndx = 0; rowIndx < rowLength; rowIndx++) {
			HashMap<String, Object> row = data.get(rowIndx);
			boolean isIgnoreRow = false;
			T entityInfo = null;
			try {
				entityInfo = type.getDeclaredConstructor().newInstance();
			} catch (Exception e) {
				throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR);
			}

			int fieldLength = mapping.size();
			for (int fieldIndx = 0; fieldIndx < fieldLength && !isIgnoreRow; fieldIndx++) {
				ImportExcelMappingField mappingField = mapping.get(fieldIndx);
				String fieldDisplay = "";
				Object value = null;
				try {
					if (row.containsKey(mappingField.getColumn()))
						value = row.get(mappingField.getColumn());
					if (value == null && mappingField.isRequire()) {
						isIgnoreRow = true;
						break;
					}
					Field field = Arrays.stream(fields).filter(f -> f.getName().equals(mappingField.getFieldName()))
							.findAny().orElse(null);
					if (field == null)
						throw new GlobalException(EnumGeneralError.INVALID_PARAM,
								String.format("Không tìm thấy field %s", mappingField.getFieldName()));
					fieldDisplay = displayNames.get(field);
					if (mappingField.getFieldName() == null || mappingField.getFieldName().isEmpty())
						continue;
					if (onAssignProperty != null) {
						AssignPropertyResult assignResult = onAssignProperty.assignProperty(entityInfo, field.getName(),
								value);
						if (assignResult.isAssign()) {
							bean.copyProperty(entityInfo, field.getName(), assignResult.getValue());
							continue;
						}
					}
					if (value != null) {
						bean.copyProperty(entityInfo, field.getName(), value);
					}
				} catch (Exception ex) {
					throw new GlobalException(EnumGeneralError.INVALID_PARAM,
							String.format("Lỗi dòng %d cột %s \"%s\" giá trị \"%s\" %s", mapping.getFromRow() + rowIndx,
									mappingField.getColumn(), fieldDisplay, value, ex.getMessage()));
				}

			}
			if (!isIgnoreRow) {
				lstData.add(entityInfo);
			}
		}

		return lstData;
	}

}
