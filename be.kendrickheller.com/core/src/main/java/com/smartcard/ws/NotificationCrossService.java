package com.smartcard.ws;

import java.lang.reflect.Type;

import com.google.gson.reflect.TypeToken;
import com.smartcard.exception.GlobalException;
import com.smartcard.persistence.dto.ChatNotificationDto;
import com.smartcard.util.PropertyUtil;

public class NotificationCrossService {
	private final static PropertyUtil prop = new PropertyUtil();
	private final static String SERVICE = prop.get("cms-service");
	
	public static Boolean notifyChat(ChatNotificationDto chatNotification) throws GlobalException {
		Type type = new TypeToken<Boolean>() {}.getType();
		Boolean result = HttpCrossService.getService()
				.post(type, SERVICE + "/rest-api/internal-notification/chat", chatNotification);
		return result;
	}
}
