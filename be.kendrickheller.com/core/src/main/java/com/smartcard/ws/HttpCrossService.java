package com.smartcard.ws;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.security.cert.X509Certificate;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.smartcard.common.EnumGeneralError;
import com.smartcard.exception.GlobalException;
import com.smartcard.util.PropertyUtil;

public final class HttpCrossService implements AutoCloseable {
	
	private static ThreadLocal<HttpCrossService> instance = new ThreadLocal<>();
	private Gson gson = new GsonBuilder().setDateFormat("yyyy/MM/dd").create();
	private PropertyUtil propertyUtil = new PropertyUtil();
	
	private HttpCrossService() {
		
    }
	
	public static HttpCrossService getService() {
		if (instance.get() == null) {
			HttpCrossService context = new HttpCrossService();
	        instance.set(context);
        }
        return instance.get();
    }
	
	 @Override    
    public void close() {
        instance.remove();
    }
	 
	private  <T> T connect(Type type, String relativeUrl, String method, Object data) throws GlobalException {
		try {
			URL url =new URL( String.format("%s/%s", propertyUtil.get("endpoint"), relativeUrl));
			
			/* Start of Fix */
			TrustManager[] trustAllCerts = new TrustManager[] { 
        		new X509TrustManager() {
		            public java.security.cert.X509Certificate[] getAcceptedIssuers() { return null; }
		            @SuppressWarnings("unused")
					public void checkClientTrusted(X509Certificate[] certs, String authType) { }
		            @SuppressWarnings("unused")
					public void checkServerTrusted(X509Certificate[] certs, String authType) { }
					@Override
					public void checkClientTrusted(java.security.cert.X509Certificate[] arg0, String arg1)
							throws CertificateException {
						// TODO Auto-generated method stub
						
					}
					@Override
					public void checkServerTrusted(java.security.cert.X509Certificate[] arg0, String arg1)
							throws CertificateException {
						// TODO Auto-generated method stub
						
					}
	
		        }
    		};

	        SSLContext sc = SSLContext.getInstance("SSL");
	        sc.init(null, trustAllCerts, new java.security.SecureRandom());
	        HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

	        // Create all-trusting host name verifier
	        HostnameVerifier allHostsValid = new HostnameVerifier() {
	            public boolean verify(String hostname, SSLSession session) { return true; }
	        };
	        // Install the all-trusting host verifier
	        HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);
	        /* End of the fix*/
	        
	        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
	        conn.setRequestMethod(method);
	        conn.setRequestProperty("Content-Type", "application/json; utf-8");
	        conn.setDoOutput(true);
	        if(data != null) {
	        	String body = gson.toJson(data);
	 	        
	 	        try(OutputStream os = conn.getOutputStream()) {
	 	            byte[] input = body.getBytes("utf-8");
	 	            os.write(input, 0, input.length);			
	 	        }
	        }
		    StringBuilder response = new StringBuilder();
	        try(BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"))) {
			    String responseLine = null;
			    while ((responseLine = br.readLine()) != null) {
			        response.append(responseLine.trim());
			    }
			    System.out.println("Response from server: \n" + response);
	        }
	        String strResponse = response.toString();
	        if(strResponse.isEmpty()) return null;
	        T result = gson.fromJson(strResponse, type);

	        return result;
		} catch(IOException | NoSuchAlgorithmException | KeyManagementException e) {
			throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR, e);
		}
		
	}
	 
	 
	public <T> T get(Type type, String relativeUrl) throws GlobalException {
		return connect(type, relativeUrl, "GET", null);
	}
	 
	public <T> T post(Type type, String relativeUrl, Object data) throws GlobalException {
		return connect(type, relativeUrl, "POST", data);
	}
}
