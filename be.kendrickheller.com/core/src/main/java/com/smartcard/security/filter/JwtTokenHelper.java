package com.smartcard.security.filter;

import java.io.UnsupportedEncodingException;

import com.smartcard.common.EnumGeneralError;
import com.smartcard.exception.GlobalException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;


public class JwtTokenHelper {
	protected String secreteKey = "jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=";
	
	public Claims parseJWT(String jwt) throws GlobalException {
		try {
			Claims claims = null;
			String tmpToken = new String(jwt);
			if(jwt.indexOf(" ") != -1) {
				tmpToken = jwt.split(" ")[1];
			}
			claims = Jwts.parser().setSigningKey(secreteKey.getBytes("UTF-8")).parseClaimsJws(tmpToken).getBody();
			return claims;
		} catch (SignatureException | ExpiredJwtException | UnsupportedJwtException | MalformedJwtException
				| IllegalArgumentException | UnsupportedEncodingException e) {
			throw new GlobalException(EnumGeneralError.UNAUTHORIZED);
		}
	}
	
	public Claims parseAccessToken(String token) throws GlobalException {
		try {
			Claims claims = null;
			claims = Jwts.parser().setSigningKey(secreteKey.getBytes("UTF-8")).parseClaimsJws(token).getBody();
			return claims;
		} catch (SignatureException | ExpiredJwtException | UnsupportedJwtException | MalformedJwtException
				| IllegalArgumentException | UnsupportedEncodingException e) {
			throw new GlobalException(EnumGeneralError.UNAUTHORIZED);
		}
	}
	
	public Boolean isTokenExpired(String token) throws GlobalException{
		String tmpToken = new String(token);
		if(token.indexOf(" ") != -1) {
			tmpToken = token.split(" ")[1];
		}
		try {
			Jwts.parser().setSigningKey(secreteKey.getBytes("UTF-8")).parseClaimsJws(tmpToken).getBody();
		} catch (Exception e) {
			throw new GlobalException(EnumGeneralError.UNAUTHORIZED);
		}
		return false;
	}
}
