package com.smartcard.util.model;

import java.awt.Color;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFFont;

public class ExcelStyle {
	private Color color;
	private int size = 14;
	private boolean isBold = false;
	private boolean isItalic = false;
	private boolean wrapped = true;
	private HorizontalAlignment horizontalAlignment = HorizontalAlignment.LEFT;
	private short rotation = 0;
	
	public final static ExcelStyle TITLE = new ExcelStyle().setSize(16).setBold(true)
			.setHorizontalAlignment(HorizontalAlignment.CENTER);
	public final static ExcelStyle HEADER_GRAY = new ExcelStyle().setColor(Color.GRAY).setSize(14).setBold(false)
			.setHorizontalAlignment(HorizontalAlignment.CENTER);
	public final static ExcelStyle HEADER_LIGHT_GRAY = new ExcelStyle().setColor(Color.LIGHT_GRAY).setSize(12).setBold(false)
			.setHorizontalAlignment(HorizontalAlignment.CENTER);
	public final static ExcelStyle VERTICAL_160_HEADER_GRAY = new ExcelStyle().setColor(Color.GRAY).setSize(14).setBold(false)
			.setHorizontalAlignment(HorizontalAlignment.CENTER).setRotation((short) 160);
	
	public ExcelStyle() {
	}

	public CellStyle build(Workbook hssfwb) {
		XSSFCellStyle style = (XSSFCellStyle) hssfwb.createCellStyle();
		if (this.color != null) {
			style.setFillForegroundColor(new XSSFColor(this.color));
			style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		}
		XSSFFont font = (XSSFFont) hssfwb.createFont();
		font.setFontHeightInPoints((short) this.size);
		font.setBold(isBold);
		font.setItalic(isItalic);
		style.setFont(font);
		style.setRotation(rotation);
		style.setAlignment(horizontalAlignment);
		style.setWrapText(wrapped);
		return style;
	}

	public ExcelStyle setColor(Color color) {
		this.color = color;
		return this;
	}

	public ExcelStyle setSize(int size) {
		this.size = size;
		return this;
	}

	public ExcelStyle setBold(boolean isBold) {
		this.isBold = isBold;
		return this;
	}

	public ExcelStyle setItalic(boolean isItalic) {
		this.isItalic = isItalic;
		return this;
	}
	
	public ExcelStyle setWrapped(boolean wrapped) {
		this.wrapped = wrapped;
		return this;
	}

	public ExcelStyle setHorizontalAlignment(HorizontalAlignment horizontalAlignment) {
		this.horizontalAlignment = horizontalAlignment;
		return this;
	}
	
	public ExcelStyle setRotation(short rotation) {
		this.rotation = rotation;
		return this;
	}
}
