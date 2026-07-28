package com.smartcard.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import com.smartcard.common.EnumDataType;
import com.smartcard.persistence.dto.HtmlSimpleParameterDto;
import com.smartcard.persistence.dto.HtmlTableColumnDto;
import com.smartcard.persistence.dto.HtmlTableParameterDto;

public class Util {
	public static String mergeContent(String content,
			List<HtmlSimpleParameterDto> simplePrameters, 
			List<HtmlTableParameterDto> tableParameters, 
			Map<String, Object> simpleData, Map<String, 
			List<Map<String, Object>>> tableData) {
		String mergeContent = content;
		for(HtmlSimpleParameterDto param: simplePrameters) {
			Object value = simpleData.get(param.getParameterName());
			String strValue = EnumDataType.get(param.getDataType()).convert(value);
			mergeContent = mergeContent.replace(param.getParameterName(), strValue);
		}
		
		for(HtmlTableParameterDto param: tableParameters) {
			List<Map<String, Object>> data = tableData.containsKey(param.getTableName())? tableData.get(param.getTableName()) : new ArrayList<Map<String, Object>>();
			StringBuilder strTable = new StringBuilder("<table style=\"");
			strTable.append(param.getTableCss());
			strTable.append("\"><tr style=\"");
			strTable.append(param.getRowCss());
			strTable.append("\">");
			
			for(HtmlTableColumnDto column: param.getColumns()) {
				strTable.append("<th style=\"");
				strTable.append(column.getColumnCss());
				strTable.append("\">");
				strTable.append(column.getColumnTitle());
				strTable.append("</th>");
			}

			strTable.append("</tr>");
			for(Map<String, Object> row: data) {
				strTable.append("<tr style=\"");
				strTable.append(param.getRowCss());
				strTable.append("\">");
				for(HtmlTableColumnDto column: param.getColumns()) {
					strTable.append("<td style=\"");
					strTable.append(column.getCellCss());
					strTable.append("\">");
					Object value = row.get(column.getColumnName());
					String strValue = EnumDataType.get(column.getDataType()).convert(value);
					strTable.append(strValue);
					strTable.append("</td>");
				}
				strTable.append("</tr>");
			}
			if(data.isEmpty()) {
				strTable.append("<tr style=\"");
				strTable.append(param.getRowCss());
				strTable.append("\"><td colspan=");
				strTable.append(param.getColumns().size());
				strTable.append("> Không tồn tại bản ghi nào</tr>");
			}
			strTable.append("</table>");
			
			mergeContent = mergeContent.replace(param.getTableName(), strTable);
		}
		
		return mergeContent;
	}
	
	
}
