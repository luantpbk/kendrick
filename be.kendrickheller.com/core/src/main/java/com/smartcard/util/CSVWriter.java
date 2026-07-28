package com.smartcard.util;
import java.io.UnsupportedEncodingException;

import com.smartcard.common.EnumGeneralError;
import com.smartcard.exception.GlobalException;
import com.smartcard.util.model.CSVData;

public class CSVWriter {
	public final static char CR  = (char) 0x0D;
	public final static char LF  = (char) 0x0A; 
	public final static String CRLF  = "" + CR + LF;
	
	public static byte[] writeData(CSVData data) throws GlobalException {
		try {
			StringBuilder builder = new StringBuilder();
	        builder.append(String.join(",", data.getColumns()));
	        builder.append(CRLF);
	        for(String[] row: data.getRows()) {
	        	 builder.append(String.join(",", row));
	        	 builder.append(CRLF);
	        }
	        
	        byte[] csvData = builder.toString().getBytes("Shift-JIS");
	        return csvData;
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR, e);
		}
        
    }
}
