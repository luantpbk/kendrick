package com.smartcard.security.crypto;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.file.Files;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import org.apache.commons.codec.binary.Base64;

//@Stateless
public class AsymCryptoUtil {
	protected PrivateKey getPrivateKey() throws Exception {
		byte[] keyBytes = Files.readAllBytes(new File("/KeyPair/privateKey").toPath());
		PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
		KeyFactory kf = KeyFactory.getInstance("RSA");//
		return kf.generatePrivate(spec);
	}

	protected PublicKey getPublicKey() throws Exception {
		byte[] keyBytes = Files.readAllBytes(new File("/KeyPair/publicKey").toPath());
		X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
		KeyFactory kf = KeyFactory.getInstance("RSA");
		return kf.generatePublic(spec);
	}
	
	private void write2File(String path, byte[] bytes) throws IOException {
		File f = new File(path);
		f.getParentFile().mkdirs();
		
		FileOutputStream fos = new FileOutputStream(f);
		fos.write(bytes);
		fos.flush();
		fos.close();
	}
	
	public void initKeyPair() throws IOException, NoSuchAlgorithmException {
		KeyPairGenerator keyGen =  KeyPairGenerator.getInstance("RSA");
		keyGen.initialize(2048);
		KeyPair keyPair = keyGen.generateKeyPair();
		write2File("/KeyPair/publicKey", keyPair.getPublic().getEncoded());
		write2File("/KeyPair/privateKey", keyPair.getPrivate().getEncoded());
		
	}

	public String encryptTextAsBase64ByPrivateKey(String msg, PrivateKey key) 
			throws NoSuchAlgorithmException, NoSuchPaddingException,
			UnsupportedEncodingException, IllegalBlockSizeException, 
			BadPaddingException, InvalidKeyException {
		if(key == null) {
			try {
				key = getPrivateKey();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		Cipher cipher = Cipher.getInstance("RSA");
		cipher.init(Cipher.ENCRYPT_MODE, key);
		return Base64.encodeBase64String(cipher.doFinal(msg.getBytes("UTF-8")));
	}

	public String encryptTextAsBase64ByPublicKey(String msg, PublicKey key) 
			throws NoSuchAlgorithmException, NoSuchPaddingException,
			UnsupportedEncodingException, IllegalBlockSizeException, 
			BadPaddingException, InvalidKeyException {
		if(key == null) {
			try {
				key = getPublicKey();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		Cipher cipher = Cipher.getInstance("RSA");
		cipher.init(Cipher.ENCRYPT_MODE, key);
		return Base64.encodeBase64String(cipher.doFinal(msg.getBytes("UTF-8")));
	}
	
	/**
	 * Using public key to decrypt Base64 string to plain string
	 * @param msg
	 * @param key
	 * @return
	 * @throws InvalidKeyException
	 * @throws UnsupportedEncodingException
	 * @throws IllegalBlockSizeException
	 * @throws BadPaddingException
	 * @throws NoSuchAlgorithmException
	 * @throws NoSuchPaddingException
	 */
	public String decryptBase64TextByPublicKey(String msg, PublicKey key)
			throws InvalidKeyException, UnsupportedEncodingException, 
			IllegalBlockSizeException, BadPaddingException, NoSuchAlgorithmException, NoSuchPaddingException {
		if(key == null) {
			try {
				key = getPublicKey();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		Cipher cipher = Cipher.getInstance("RSA");
		cipher.init(Cipher.DECRYPT_MODE, key);
		return new String(cipher.doFinal(Base64.decodeBase64(msg)), "UTF-8");
	}
	
	/**
	 * Using public key to decrypt normal encrypted string to plain string
	 * @param msg
	 * @param key
	 * @return
	 * @throws InvalidKeyException
	 * @throws UnsupportedEncodingException
	 * @throws IllegalBlockSizeException
	 * @throws BadPaddingException
	 * @throws NoSuchAlgorithmException
	 * @throws NoSuchPaddingException
	 */
	public String decryptNormalTextByPublicKey(String msg, PublicKey key)
			throws InvalidKeyException, UnsupportedEncodingException, 
			IllegalBlockSizeException, BadPaddingException, NoSuchAlgorithmException, NoSuchPaddingException {
		if(key == null) {
			try {
				key = getPublicKey();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		Cipher cipher = Cipher.getInstance("RSA");
		cipher.init(Cipher.DECRYPT_MODE, key);
		return new String(cipher.doFinal(msg.getBytes("UTF-8")), "UTF-8");
	}

	/**
	 * Using private key to decrypt Base64 string to plain string
	 * @param msg
	 * @param key
	 * @return
	 * @throws InvalidKeyException
	 * @throws UnsupportedEncodingException
	 * @throws IllegalBlockSizeException
	 * @throws BadPaddingException
	 * @throws NoSuchAlgorithmException
	 * @throws NoSuchPaddingException
	 */
	public String decryptBase64TextByPrivateKey(String msg, PrivateKey key)
			throws InvalidKeyException, UnsupportedEncodingException, 
			IllegalBlockSizeException, BadPaddingException, NoSuchAlgorithmException, NoSuchPaddingException {
		if(key == null) {
			try {
				key = getPrivateKey();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		Cipher cipher = Cipher.getInstance("RSA");
		cipher.init(Cipher.DECRYPT_MODE, key);
		return new String(cipher.doFinal(Base64.decodeBase64(msg)), "UTF-8");
	}
	
	/**
	 * Using private key to decrypt normal encrypted (not encode with base64) string to plain string
	 * @param msg
	 * @param key
	 * @return
	 * @throws InvalidKeyException
	 * @throws UnsupportedEncodingException
	 * @throws IllegalBlockSizeException
	 * @throws BadPaddingException
	 * @throws NoSuchAlgorithmException
	 * @throws NoSuchPaddingException
	 */
	public String decryptNormalTextByPrivateKey(String msg, PrivateKey key)
			throws InvalidKeyException, UnsupportedEncodingException, 
			IllegalBlockSizeException, BadPaddingException, NoSuchAlgorithmException, NoSuchPaddingException {
		if(key == null) {
			try {
				key = getPrivateKey();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		Cipher cipher = Cipher.getInstance("RSA");
		cipher.init(Cipher.DECRYPT_MODE, key);
		return new String(cipher.doFinal(msg.getBytes("UTF-8")), "UTF-8");
	}
	
	public String toBase64String(Key k) {
		return Base64.encodeBase64String(k.getEncoded());
	}
	
	public static PublicKey decodePublicKey(byte[] encodedKey)
	{
	    try
	    {
	    	X509EncodedKeySpec spec = new X509EncodedKeySpec(encodedKey);
	        KeyFactory keyfactory = KeyFactory.getInstance("RSA");
	        return keyfactory.generatePublic(spec);
	    }
	    catch (NoSuchAlgorithmException var3)
	    {
	    	var3.printStackTrace();
	    }
	    catch (InvalidKeySpecException var4)
	    {
	    	var4.printStackTrace();
	    }
	    return null;
	}
	
	public static PrivateKey decodePrivateKey(byte[] encodedKey)
	{
	    try
	    {
	    	PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(encodedKey);
	        KeyFactory keyfactory = KeyFactory.getInstance("RSA");
	        return keyfactory.generatePrivate(spec);
	    }
	    catch (NoSuchAlgorithmException var3)
	    {
	    	var3.printStackTrace();
	    }
	    catch (InvalidKeySpecException var4)
	    {
	    	var4.printStackTrace();
	    }
	    return null;
	}
	
	public static void main(String[] args) throws Exception {
		AsymCryptoUtil ac = new AsymCryptoUtil();
		ac.initKeyPair();
//		PrivateKey privateKey = ac.getPrivate("KeyPair/privateKey");
		
//		String base64EncodeString = Base64.encodeBase64String(privateKey.getEncoded());
//		System.out.println(base64EncodeString);
//		
//		PrivateKey privateKey2 = decodePrivateKey(Base64.decodeBase64(base64EncodeString));
//		System.out.println(privateKey.equals(privateKey2));
		
//		PublicKey publicKey = ac.getPublic("KeyPair/publicKey");
//		String b2 = Base64.encodeBase64String(publicKey.getEncoded());
//		System.out.println(b2);
//		
//		PublicKey publicKey2 = decodePublicKey(Base64.decodeBase64(b2));
//		
//		System.out.println(publicKey.equals(publicKey2));
		
//		String msg = "Cryptography 1: mã hóa private key, giải mã public key!";
//		String decrypted_msg = ac.decryptTextByPublicKey(encrypted_msg, publicKey);
//		String encrypted_msg = ac.encryptTextByPrivateKey(msg, privateKey);
//		System.out.println("Original Message: " + msg + 
//			"\nEncrypted Message: " + encrypted_msg
//			+ "\nDecrypted Message: " + decrypted_msg);
//
//		msg = "Cryptography 2: Mã hóa bằng public key, giải mã bằng private key!";
//		encrypted_msg = ac.encryptTextByPublicKey(msg, publicKey);
//		decrypted_msg = ac.decryptTextByPrivateKey(encrypted_msg, privateKey);
//		
//		System.out.println("====================================\n"+
//				"Original Message: " + msg + 
//			"\nEncrypted Message: " + encrypted_msg
//			+ "\nDecrypted Message: " + decrypted_msg);
//		
//		// File encrypt/decrypt
//		if (new File("KeyPair/text.txt").exists()) {
//			ac.encryptFile(ac.getFileInBytes(new File("KeyPair/text.txt")), 
//				new File("KeyPair/text_encrypted.txt"),privateKey);
//			ac.decryptFile(ac.getFileInBytes(new File("KeyPair/text_encrypted.txt")),
//				new File("KeyPair/text_decrypted.txt"), publicKey);
//		} else {
//			System.out.println("Create a file text.txt under folder KeyPair");
//		}
	}
}