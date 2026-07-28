package com.smartcard.security.crypto;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
//import javax.ejb.Stateless;

import org.apache.commons.net.util.Base64;

//@Stateless
public class SymCryptoUtil {
	
	private Cipher cipher;
    /**
     * Get original SecretKey from file.
     * @return
     * @throws IOException
     */
    public SecretKeySpec getKey(String patientId) throws IOException{
    	byte[] keyBytes = Files.readAllBytes(new File("/OneKey/secretKey"+ "_" + patientId).toPath());
    	SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "AES");
    	return secretKey;
    }
    
    public String encrypt(byte[] input, String patientId) 
            throws IOException, GeneralSecurityException {
    	this.cipher = Cipher.getInstance("AES");
    	this.cipher.init(Cipher.ENCRYPT_MODE, getKey(patientId));
    	byte[] ret = this.cipher.doFinal(input);
        return Base64.encodeBase64String(ret);

    }
    
    public String decrypt(byte[] input, String patientId) 
        throws IOException, GeneralSecurityException {
    	this.cipher = Cipher.getInstance("AES");
    	this.cipher.init(Cipher.DECRYPT_MODE, getKey(patientId));
    	byte[] ret = this.cipher.doFinal(input);
        return new String(ret, "UTF-8");

    }
    public String decryptBase64(byte[] input, String patientId) 
            throws IOException, GeneralSecurityException {
    	
        	this.cipher = Cipher.getInstance("AES");
        	this.cipher.init(Cipher.DECRYPT_MODE, getKey(patientId));
        	byte[] a = Base64.decodeBase64(input);
        	byte[] ret = this.cipher.doFinal(a);
            return new String(ret, "UTF-8");

        }
    /**
     * Get secrete key as Base64 encoded string
     * @return
     * @throws IOException
     */
    public String getKeyAsBase64String(String patientId) throws IOException{
    	byte[] keyBytes = Files.readAllBytes(new File("/OneKey/secretKey"+ "_" + patientId).toPath());
    	SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "AES");
    	return Base64.encodeBase64String(secretKey.getEncoded());
    }

    /**
     * Write byte array to file
     * @param path
     * @param key
     * @throws IOException
     */
    private void writeToFile(String path, byte[] key) throws IOException {

        File f = new File(path);
        f.getParentFile().mkdirs();

        FileOutputStream fos = new FileOutputStream(f);
        fos.write(key);
        fos.flush();
        fos.close();
    }
    
    /**
     * Save secrete key from base64 encoded string.
     * @param encodedBase64Str
     * @throws IOException
     */
    public void saveFromBase64(String encodedBase64Str, String patientId) throws IOException {
    	writeToFile("/OneKey/secretKey" + "_" + patientId, Base64.decodeBase64(encodedBase64Str));
    }
    
    
    /**
     * Initialize secret key.
     * @throws IOException
     */
    public void createSecretKey(String patientId) throws IOException {
    	File f = new File("/OneKey/secretKey"+ "_" + patientId);
    	if(!f.exists()) {
    		
    		SecureRandom rnd = new SecureRandom();
            byte [] key = new byte [16];
            rnd.nextBytes(key);
            SecretKeySpec secretKey = new SecretKeySpec(key, "AES");
    		writeToFile("/OneKey/secretKey"+ "_" + patientId, secretKey.getEncoded());
    	}
    	
    }
    
    public static void main(String[] args) throws Exception{
    	SymCryptoUtil sc = new SymCryptoUtil();
    	AsymCryptoUtil ac = new AsymCryptoUtil();
    	
    	sc.createSecretKey("nghianv");
//    	sc.createSecretKey("longld");
    	
    	// Encode/Encrypt loginId
//    	System.out.println(URLEncoder.encode(sc.encrypt("longld".getBytes("UTF-8"), "nghianv"), "UTF-8"));
//    	String origin = sc.getKeyAsBase64String("longld");
//    	System.out.println("origin "+origin);
//    	String s = ac.encryptTextByPublicKey(origin, ac.getPublicKey());
//    	System.out.println(s);
//    	
//    	String urlEncodeS = URLEncoder.encode(s, "UTF-8"); 
//    	System.out.println(urlEncodeS);
//    	
//    	String urlDecodeSecretKey = URLDecoder.decode(urlEncodeS, "UTF-8");
//    	System.out.println(urlDecodeSecretKey);
//		String fromU = ac.decryptTextByPrivateKey(urlDecodeSecretKey, ac.getPrivateKey());
//
//		System.out.println(fromU);
//    	System.out.println(fromU.length());
//    	System.out.println(origin);
    }
}
