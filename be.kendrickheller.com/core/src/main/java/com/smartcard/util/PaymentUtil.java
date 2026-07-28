package com.smartcard.util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.smartcard.common.EnumGeneralError;
import com.smartcard.exception.GlobalException;

import java.util.Base64;

public class PaymentUtil {

	private final static String BASE = "https://api-m.paypal.com";
	private final static Gson gson = new GsonBuilder().create();

	

	public static String GenerateAccessToken() throws GlobalException {
		String PAYPAL_CLIENT_ID = "AR90PNiFGlhmBPxydMb1jtjPLrWkzGEXTTQJo6_8WQGKUYQPIRQFLFvk5DH-gVpYQKFaJVp7LW53ifvG";
		String PAYPAL_CLIENT_SECRET = "EMBGclAmSJL_uVUSXFeoWCFq8ELQ32g1oc402lO74hwfLRpe2yQ1523kqiaHmjj6kvJW1C8cRw0J77vY";
		String auth = Base64.getEncoder().encodeToString((PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET).getBytes());
		
		try {
			URL url = new URL(BASE + "/v1/oauth2/token");
			HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Authorization", "Basic " + auth);
			conn.setDoOutput(true);

			try (OutputStream os = conn.getOutputStream()) {
				byte[] input = "grant_type=client_credentials".getBytes("utf-8");
				os.write(input, 0, input.length);
			}
			StringBuilder response = new StringBuilder();
			try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"))) {
				String responseLine = null;
				while ((responseLine = br.readLine()) != null) {
					response.append(responseLine.trim());
				}
			}
			Type type = new TypeToken<Map<String, Object>>() {}.getType();
			Map<String, Object> result = gson.fromJson(response.toString(), type);
			
			return result.get("access_token").toString();
		} catch (Exception e) {
			throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR, e);
		}

	}
	
	public static String CreateOrder(BigDecimal money) throws GlobalException {
		String accessToken = GenerateAccessToken();
		
		Map<String, Object> amount = new HashMap<>();
		amount.put("currency_code", "USD");
		amount.put("value", money.setScale(2));
		List<Map<String, Object>> purchaseUnits = new ArrayList<>();
		Map<String, Object> unit = new HashMap<>();
		unit.put("amount", amount);
		purchaseUnits.add(unit);
		Map<String, Object> payload = new HashMap<>();
		payload.put("intent", "CAPTURE");
		payload.put("purchase_units", purchaseUnits);
		Map<String, Object> applicationContext = new HashMap<>();
		applicationContext.put("shipping_preference", "NO_SHIPPING");
		payload.put("application_context", applicationContext);
		
		try {
			URL url = new URL(BASE + "/v2/checkout/orders");
			HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Content-Type", "application/json; utf-8");
			conn.setRequestProperty("Authorization", "Bearer " + accessToken);
			conn.setDoOutput(true);

			try (OutputStream os = conn.getOutputStream()) {
				byte[] input = gson.toJson(payload).getBytes("utf-8");
				os.write(input, 0, input.length);
			}
			StringBuilder response = new StringBuilder();
			try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"))) {
				String responseLine = null;
				while ((responseLine = br.readLine()) != null) {
					response.append(responseLine.trim());
				}
			}
			Type type = new TypeToken<Map<String, Object>>() {}.getType();
			Map<String, Object> result = gson.fromJson(response.toString(), type);
			
			return result.get("id").toString();
		} catch (Exception e) {
			throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR, e);
		}

	}
	
	

	public static Map<String, Object> Capture(String id) throws GlobalException {
		String accessToken = GenerateAccessToken();
		try {
			URL url = new URL(BASE + "/v2/checkout/orders/" + id + "/capture");
			HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Content-Type", "application/json");
			conn.setRequestProperty("Authorization", "Bearer " + accessToken);
			conn.setDoOutput(true);

			StringBuilder response = new StringBuilder();
			try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"))) {
				String responseLine = null;
				while ((responseLine = br.readLine()) != null) {
					response.append(responseLine.trim());
				}
			}
			Type type = new TypeToken<Map<String, Object>>() {}.getType();
			Map<String, Object> result = gson.fromJson(response.toString(), type);
			return result;
		} catch (Exception e) {
			throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR, e);
		}

	}
}
