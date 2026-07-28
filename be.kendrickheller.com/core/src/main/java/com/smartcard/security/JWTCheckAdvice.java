package com.smartcard.security;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.Priority;
import javax.interceptor.AroundInvoke;
import javax.interceptor.Interceptor;
import javax.interceptor.InvocationContext;

import com.smartcard.annotation.interceptor.JWTCheck;


/**
 * intercepter for loging method
 * 
 * @author nghianv
 *
 */
@JWTCheck
@Interceptor
@Priority(Interceptor.Priority.APPLICATION)
public class JWTCheckAdvice implements Serializable{
	public static final Logger logger = Logger.getLogger(JWTCheckAdvice.class.getCanonicalName());
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:s.S");
	private static final long serialVersionUID = -7000847734263313686L;

	/**
	 * write log begin and end method
	 * 
	 * @param joinPoint instance of {@link InvocationContext}
	 * @return object of current method
	 * @throws Exception
	 */
	@AroundInvoke
	public Object writeLog(InvocationContext joinPoint) throws Exception {
		
        /* Get the name of the method being invoked. */			
        String operationName = joinPoint.getMethod().getName();			
        /* Get the name of the object being invoked. */			
        String objectName = joinPoint.getTarget().getClass().getCanonicalName();
		logger.log(Level.INFO, "Logging Interceptor: BEGIN method " + objectName + "." + operationName + sdf.format(new Date()));
		Object obj = joinPoint.proceed();
		logger.log(Level.INFO, "Logging Interceptor END method " + objectName + "." + operationName + sdf.format(new Date()));
		return obj;
	}
}
