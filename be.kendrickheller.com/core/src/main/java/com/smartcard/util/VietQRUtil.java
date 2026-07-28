package com.smartcard.util;

import java.util.Map;


public class VietQRUtil {
	private final static PropertyUtil properties = new PropertyUtil();
	
	private final static String BANK_CODE = properties.get("bank-code");
	private final static String BANK_BIN = properties.get("bank-bin");
	private final static String BANK_ACCOUNT = properties.get("bank-account");
	
	public static String genTranferCode(String amount, String message, String bankCode, String bankBin, String bankAccount) {
		 Map<String, String> bankIdByCode = EzyMapBuilder
		            .mapBuilder()
		            .put(bankCode, bankBin)
		            .toMap();
		        String bankId = bankIdByCode.get(bankCode);
		        StringBuilder part12Builder = new StringBuilder()
		            .append("00")
		            .append(String.format("%02d", bankId.length()))
		            .append(bankId)
		            .append("01")
		            .append(String.format("%02d", bankAccount.length()))
		            .append(bankAccount);
		        StringBuilder part11Builder = new StringBuilder()
		            .append("0010A000000727")
		            .append("01")
		            .append(String.format("%02d", part12Builder.length()))
		            .append(part12Builder)
		            .append("0208QRIBFTTA");
		        StringBuilder part1Builder = new StringBuilder()
		            .append("38")
		            .append(String.format("%02d", part11Builder.length()))
		            .append(part11Builder);
		        StringBuilder part21Builder = new StringBuilder()
		            .append("08")
		            .append(String.format("%02d", message.length()))
		            .append(message);
		        String part2 = new StringBuilder()
		            .append("5303704")
		            .append("54")
		            .append(String.format("%02d", amount.length()))
		            .append(amount)
		            .append("5802VN")
		            .append("62")
		            .append(String.format("%02d", part21Builder.length()))
		            .append(part21Builder)
		            .toString();
		        StringBuilder builder = new StringBuilder()
		            .append("000201")
		            .append("010212")
		            .append(part1Builder)
		            .append(part2)
		            .append("6304");
		        String qrcodeContent = builder
		            .append(generateCheckSum(builder.toString()).toUpperCase())
		            .toString();
		        
		        return qrcodeContent;
	}
	
    public static String genTranferCode(String amount, String message) {
       return genTranferCode(amount, message, BANK_CODE, BANK_BIN, BANK_ACCOUNT);
    }
    

    private static String generateCheckSum(String text) {
        int crc = 0xFFFF;          // initial value
        int polynomial = 0x1021;   // 0001 0000 0010 0001  (0, 5, 12)
        byte[] bytes = text.getBytes();
        for (byte b : bytes) {
            for (int i = 0; i < 8; i++) {
                boolean bit = ((b   >> (7-i) & 1) == 1);
                boolean c15 = ((crc >> 15    & 1) == 1);
                crc <<= 1;
                if (c15 ^ bit) crc ^= polynomial;
            }
        }
        return Integer.toHexString(crc & 0xFFFF);
    }
}