package com.smartcard.persistence.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

/**
 * The Dto class for simple html parameter
 * 
 */
public class HtmlSimpleParameterDto implements Serializable {
	
	private static final long serialVersionUID = 8079871323499390709L;
	private String parameterName;
	private String description;
	private int dataType;
	
	public HtmlSimpleParameterDto() {
	}

	public int getDataType() {
		return dataType;
	}

	public void setDataType(int dataType) {
		this.dataType = dataType;
	}
	public String getParameterName() {
		return parameterName;
	}

	public void setParameterName(String parameterName) {
		this.parameterName = parameterName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	public static String p2sSimple(List<HtmlSimpleParameterDto> value) {
		Gson gson = new Gson();
		return gson.toJson(value);
	}

	public static List<HtmlSimpleParameterDto> s2pSimple(String value) {
		Gson gson = new Gson();
		Type type = new TypeToken<List<HtmlSimpleParameterDto>>() {}.getType();
		return gson.fromJson(value, type);
	}
}