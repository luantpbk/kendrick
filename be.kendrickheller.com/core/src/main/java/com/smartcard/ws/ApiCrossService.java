package com.smartcard.ws;

import java.lang.reflect.Type;
import java.util.List;

import com.google.gson.reflect.TypeToken;
import com.smartcard.exception.GlobalException;
import com.smartcard.persistence.dto.InputApiDto;
import com.smartcard.persistence.dto.InternalApiDto;
import com.smartcard.persistence.dto.InternalFunctionDto;
import com.smartcard.util.PropertyUtil;

public class ApiCrossService {
	private final static PropertyUtil prop = new PropertyUtil();
	private final static String SERVICE = prop.get("idm-service");
	
	public static InternalApiDto getApi(InputApiDto data) throws GlobalException {
		Type type = new TypeToken<InternalApiDto>() {}.getType();
		InternalApiDto api = HttpCrossService.getService().post(type, SERVICE + "/rest-api/internal-api", data);
		return api;
	}
	
	public static List<InternalFunctionDto> getFunctions(Long id) throws GlobalException {
		Type type = new TypeToken<List<InternalFunctionDto>>() {}.getType();
		List<InternalFunctionDto> functions = HttpCrossService.getService().get(type, SERVICE + "/rest-api/internal-api/" + id + "/function");
		return functions;
	}
}
