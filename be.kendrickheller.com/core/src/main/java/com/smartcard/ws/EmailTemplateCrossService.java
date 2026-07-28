package com.smartcard.ws;

import java.lang.reflect.Type;

import com.google.gson.reflect.TypeToken;
import com.smartcard.exception.GlobalException;
import com.smartcard.persistence.dto.InternalEmailTemplateDto;
import com.smartcard.util.PropertyUtil;

public class EmailTemplateCrossService {
	private final static PropertyUtil prop = new PropertyUtil();
	private final static String SERVICE = prop.get("cms-service");
	
	public static InternalEmailTemplateDto getEmailTemplateByKey(String key) throws GlobalException {
		Type type = new TypeToken<InternalEmailTemplateDto>() {}.getType();
		InternalEmailTemplateDto emailTemplate = HttpCrossService.getService().get(type, SERVICE + "/rest-api/internal-email-template/key/" + key);
		return emailTemplate;
	}
}
