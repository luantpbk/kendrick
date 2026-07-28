package com.smartcard.security.crypto;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.file.Files;
import java.security.GeneralSecurityException;
import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.UUID;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import org.apache.commons.codec.binary.Base64;

public class AsymmetricCryptography {
	private Cipher cipher;

	public AsymmetricCryptography() throws NoSuchAlgorithmException, NoSuchPaddingException {
		this.cipher = Cipher.getInstance("RSA");
	}

	// https://docs.oracle.com/javase/8/docs/api/java/security/spec/PKCS8EncodedKeySpec.html
	public PrivateKey getPrivate(String filename) throws Exception {
		byte[] keyBytes = Files.readAllBytes(new File(filename).toPath());
		PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
		KeyFactory kf = KeyFactory.getInstance("RSA");
		return kf.generatePrivate(spec);
	}

	// https://docs.oracle.com/javase/8/docs/api/java/security/spec/X509EncodedKeySpec.html
	public PublicKey getPublic(String filename) throws Exception {
		byte[] keyBytes = Files.readAllBytes(new File(filename).toPath());
		X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
		KeyFactory kf = KeyFactory.getInstance("RSA");
		return kf.generatePublic(spec);
	}

	public void encryptFile(byte[] input, File output, PrivateKey key) 
		throws IOException, GeneralSecurityException {
		this.cipher.init(Cipher.ENCRYPT_MODE, key);
		String s = new String(input, "UTF-8");
		writeToFile(output, this.cipher.doFinal(s.getBytes("UTF-8")));
	}
	public void decryptFile(byte[] input, File output, PublicKey key) 
			throws IOException, GeneralSecurityException {
			this.cipher.init(Cipher.DECRYPT_MODE, key);
			writeToFile(output, this.cipher.doFinal(input));
		}
	
	public String encrypt(String input) 
		throws Exception {
		PublicKey key = getPublic(System.getProperty("user.home") + "/.keyPair/publicKey");
		this.cipher.init(Cipher.ENCRYPT_MODE, key);
		return Base64.encodeBase64String(this.cipher.doFinal(input.getBytes("UTF-8")));
	}
	
	public String decrypt(String input) 
		throws Exception {
		PrivateKey key = getPrivate(System.getProperty("user.home") + "/.keyPair/privateKey");
		this.cipher.init(Cipher.DECRYPT_MODE, key);
		return new String(cipher.doFinal(Base64.decodeBase64(input)), "UTF-8");
	}

	private void writeToFile(File output, byte[] toWrite)
			throws IllegalBlockSizeException, BadPaddingException, IOException {
		FileOutputStream fos = new FileOutputStream(output);
		fos.write(toWrite);
		fos.flush();
		fos.close();
	}

	public String encryptTextByPrivateKey(String msg, PrivateKey key) 
			throws NoSuchAlgorithmException, NoSuchPaddingException,
			UnsupportedEncodingException, IllegalBlockSizeException, 
			BadPaddingException, InvalidKeyException {
		this.cipher.init(Cipher.ENCRYPT_MODE, key);
		return Base64.encodeBase64String(cipher.doFinal(msg.getBytes("UTF-8")));
	}

	public String decryptTextByPublicKey(String msg, PublicKey key)
			throws InvalidKeyException, UnsupportedEncodingException, 
			IllegalBlockSizeException, BadPaddingException {
		this.cipher.init(Cipher.DECRYPT_MODE, key);
		return new String(cipher.doFinal(Base64.decodeBase64(msg)), "UTF-8");
	}

	public String encryptTextByPublicKey(String msg, PublicKey key) 
			throws NoSuchAlgorithmException, NoSuchPaddingException,
			UnsupportedEncodingException, IllegalBlockSizeException, 
			BadPaddingException, InvalidKeyException {
		this.cipher.init(Cipher.ENCRYPT_MODE, key);
		return Base64.encodeBase64String(cipher.doFinal(msg.getBytes("UTF-8")));
	}

	public String decryptTextByPrivateKey(String msg, PrivateKey key)
			throws InvalidKeyException, UnsupportedEncodingException, 
			IllegalBlockSizeException, BadPaddingException {
		this.cipher.init(Cipher.DECRYPT_MODE, key);
		return new String(cipher.doFinal(Base64.decodeBase64(msg)), "UTF-8");
	}

	
	public byte[] getFileInBytes(File f) throws IOException {
		FileInputStream fis = new FileInputStream(f);
        
		byte[] fbytes = new byte[(int) f.length()];
		
		fis.read(fbytes);
		fis.close();
		return fbytes;
	}

	public static void main(String[] args) throws Exception {
		AsymmetricCryptography ac = new AsymmetricCryptography();
		//""
		System.out.println(ac.decrypt("iE4cuT4ycXZAI68HQ6/LH8IlQi4uscQ+dOmKKraQJFRFnbMy7Paqcc9ICQuNl1y6dOSCi9WiAwE+UsYt1Tw3OBQu28bggDElTre6k2cP8I5ZQbvc6hSBxdoJHSIJxGq0PIm+BpwBSF4HFZsZAxkp3OtCDIpt7A2/sI8+0aZBLnA="));
		System.out.println(ac.encrypt("0241bf32-dbae-48da-b2ac-1f8e3acf9918"));
//		String uuid = UUID.randomUUID().toString();
//		System.out.println(uuid);
//		String s = ac.encrypt(uuid);
//		System.out.println(s);
//		System.out.println(ac.decrypt(s));
		
		//93790df1-c620-49a7-8d00-b0c42e0e60c5 - OLD
		//4919b1a9-4352-44e8-adbc-35597014df27
		//bENNn7Qu0hYMcUNyCVpnTOQH+T509fRVQmhT42ylhLTR4o1TGyreKw3OQ/6jONZ22uFNfmFj/5aLQ4PC2Zs6OWFXxudYdS6vkmnN3ROVs60uhEy+AEDZhYnv6tyQUYKmWFBlBefiJDU/hEdyNauwaK419HoPwgMUGdtN5ACAGrA=
		
//		PrinvateKey privateKey = ac.getPrivate("KeyPair/privateKey");
//		PublicKey publicKey = ac.getPublic("KeyPair/publicKey");
//
//		String msg = "Cryptography 1: mã hóa private key, giải mã public key!";
//		String encrypted_msg = ac.encryptTextByPrivateKey(msg, privateKey);
//		String decrypted_msg = ac.decryptTextByPublicKey(encrypted_msg, publicKey);
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