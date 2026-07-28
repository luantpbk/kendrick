package com.smartcard.security.digest;


public class MD5PasswordEncoder extends MessageDigestPasswordEncoder {
	public static final String MD5_ALGORITHM = "MD5";
	
	/**
	 * Create an instance of SHS-256 password encoder with hex encoding.
	 */
	public MD5PasswordEncoder() {
		super(MD5_ALGORITHM);
	}

	/**
	 * Create an instance of SHS-256 password encoder with base64 or hex encoding.
	 * @param encodeHashAsBase64 true if using base64 encoding else using hex encoding.
	 * @throws IllegalArgumentException
	 */
	public MD5PasswordEncoder(boolean encodeHashAsBase64) throws IllegalArgumentException {
		super(MD5_ALGORITHM, encodeHashAsBase64);
	}
}
