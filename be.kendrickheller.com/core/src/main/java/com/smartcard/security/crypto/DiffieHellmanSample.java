package com.smartcard.security.crypto;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.security.AlgorithmParameterGenerator;
import java.security.AlgorithmParameters;
import java.security.GeneralSecurityException;
import java.security.InvalidKeyException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyAgreement;
import javax.crypto.SecretKey;
import javax.crypto.spec.DHParameterSpec;

public class DiffieHellmanSample {
	private static Cipher cipher;
	
	static void decryptFile(byte[] input, File output, SecretKey key) 
        throws IOException, GeneralSecurityException {

        cipher.init(Cipher.DECRYPT_MODE, key);
        writeToFile(output, cipher.doFinal(input));

    }
//	private static SecretKey combine(PrivateKey private1, PublicKey public1) 
//			throws NoSuchAlgorithmException, InvalidKeyException  {
//		KeyAgreement ka = KeyAgreement.getInstance("DH");
//		ka.init(private1);
//		ka.doPhase(public1, true);
//		SecretKey secretKey = ka.generateSecret("AES");
//		return secretKey;
//	}
	
	private static SecretKey combine(PrivateKey private1, PublicKey public1, PublicKey public2) 
			throws NoSuchAlgorithmException, InvalidKeyException  {
		KeyAgreement ka = KeyAgreement.getInstance("DH");
		ka.init(private1);
		ka.doPhase(public1, true);
		ka.doPhase(public2, true);
		SecretKey secretKey = ka.generateSecret("AES");
		return secretKey;
	}
	
	private static void writeToFile(File output, byte[] toWrite) 
	        throws IllegalBlockSizeException, BadPaddingException, IOException{

	        output.getParentFile().mkdirs();
	        FileOutputStream fos = new FileOutputStream(output);
	        fos.write(toWrite);
	        fos.flush();
	        fos.close();
	        System.out.println("The file was successfully encrypted and stored in: " + output.getPath());

	    }
	public static byte[] getFileInBytes(File f) throws IOException{

        FileInputStream fis = new FileInputStream(f);
        byte[] fbytes = new byte[(int) f.length()];
        fis.read(fbytes);
        fis.close();
        return fbytes;

    }
	
	public static void main(String[] args) throws IOException, GeneralSecurityException {
		KeyPairGenerator keyGen = KeyPairGenerator.getInstance("DH");
		AlgorithmParameterGenerator paramGen = AlgorithmParameterGenerator
		    .getInstance("DH");
		paramGen.init(1024);
	
		// Generate the parameters
		AlgorithmParameters params = paramGen.generateParameters();
		DHParameterSpec dhSpec = (DHParameterSpec) params
		    .getParameterSpec(DHParameterSpec.class);
	
		keyGen.initialize(dhSpec);
	
		KeyPair alice_key = keyGen.generateKeyPair();
		KeyPair bob_key = keyGen.generateKeyPair();
		KeyPair nghia_key = keyGen.generateKeyPair();
	
		SecretKey secretKey = combine(alice_key.getPrivate(),
		    bob_key.getPublic(), nghia_key.getPublic());
			
		cipher = Cipher.getInstance("AES");      
		cipher.init(Cipher.ENCRYPT_MODE, secretKey);
		File originalFile = new File("confidential.txt");
		File output = new File("EncryptedFiles/encryptedFile1");
        writeToFile(output, cipher.doFinal(getFileInBytes(originalFile)));
        
        //=================================================
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);
		File originalFile2 = new File("confidential.txt");
		File output2 = new File("EncryptedFiles/encryptedFile2");
        writeToFile(output2, DiffieHellmanSample.cipher.doFinal(getFileInBytes(originalFile2)));

        
        //==============================
        // Decrypt use the same secreteKey to decrypt both files 
        File output11 = new File("DecryptedFiles/decryptedFile1");
        cipher.init(Cipher.DECRYPT_MODE, secretKey);
        decryptFile(getFileInBytes(output), output11, secretKey);
        
        File output4 = new File("DecryptedFiles/decryptedFile2");
        cipher.init(Cipher.DECRYPT_MODE, secretKey);
        decryptFile(getFileInBytes(output2), output4, secretKey);
	}
}
