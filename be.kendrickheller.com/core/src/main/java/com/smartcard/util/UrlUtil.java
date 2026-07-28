package com.smartcard.util;

import java.util.HashMap;
import java.util.Map;

public class UrlUtil {
	   // Getting query params
    public static Map<String, String> getQueryMap(String query) {
        Map<String, String> map = new HashMap<String, String>();
        if (query != null) {
            String[] params = query.split("&");
            for (String param : params) {
                String[] nameval = param.split("=");
                map.put(nameval[0], nameval.length > 1? nameval[1] : "");
            }
        }
        return map;
    }
}
