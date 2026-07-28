package com.smartcard.security.digest;


public class SHA256PasswordEncoder extends MessageDigestPasswordEncoder {
	public static final String SHA256_ALGORITHM = "SHA-256";
	
	/**
	 * Create an instance of SHS-256 password encoder with hex encoding.
	 */
	public SHA256PasswordEncoder() {
		super(SHA256_ALGORITHM);
	}

	/**
	 * Create an instance of SHS-256 password encoder with base64 or hex encoding.
	 * @param encodeHashAsBase64 true if using base64 encoding else using hex encoding.
	 * @throws IllegalArgumentException
	 */
	public SHA256PasswordEncoder(boolean encodeHashAsBase64) throws IllegalArgumentException {
		super(SHA256_ALGORITHM, encodeHashAsBase64);
	}
	
	public static void main(String[] args) throws Exception{
		SHA256PasswordEncoder enc = new SHA256PasswordEncoder(true);
		System.out.println(enc.encodePassword("Nghia@1275", null));
	}
}