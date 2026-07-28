package com.smartcard.security.filter;

import java.lang.reflect.Method;
import java.util.List;

import javax.ws.rs.Path;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.ext.Provider;

import javax.ws.rs.core.MediaType;
import com.smartcard.annotation.interceptor.AllowAnonymous;
import com.smartcard.common.EnumActionType;
import com.smartcard.common.EnumGeneralError;
import com.smartcard.common.EnumHttpMethod;
import com.smartcard.common.ErrorResponseDto;
import com.smartcard.common.IEnumError;
import com.smartcard.persistence.dto.InputApiDto;
import com.smartcard.persistence.dto.InternalApiDto;
import com.smartcard.persistence.dto.InternalFunctionDto;
import com.smartcard.persistence.dto.InternalRoleFunctionDto;
import com.smartcard.ws.ApiCrossService;
import com.smartcard.ws.UserCrossService;

import io.jsonwebtoken.Claims;

@Provider
public class AuthenticationFilter implements ContainerRequestFilter, ContainerResponseFilter {
	
	@Context private ResourceInfo resourceInfo;
	
	//ContainerRequestFilter
	@Override
    public void filter(ContainerRequestContext requestContext) {
		Class<?> clz = resourceInfo.getResourceClass();
        Method method = resourceInfo.getResourceMethod();
        AllowAnonymous clzAnnotation = clz.getAnnotation(AllowAnonymous.class);
        AllowAnonymous methodAnnotation = method.getAnnotation(AllowAnonymous.class);
        String reqMethod = requestContext.getMethod();
        UriInfo uriInfo = requestContext.getUriInfo();
        if(clzAnnotation == null && methodAnnotation == null && !reqMethod.equals("OPTIONS") && !uriInfo.getPath().contains("apiee")) {
			String token = requestContext.getHeaderString("Authorization");
        	JwtTokenHelper tokenHelper = new JwtTokenHelper();
        	IEnumError err = null;
        	try {
	     		if (token == null || token.equals("")) {
	     			err = EnumGeneralError.UNAUTHORIZED;
	     		} else if(tokenHelper.isTokenExpired(token)) {
	     			err = EnumGeneralError.TOKEN_EXPIRED;
	     		} else {
	            	// Check permision
	     			Path pathAnnotation = method.getAnnotation(Path.class);
	     			String router = uriInfo.getPath();
	     			if(pathAnnotation != null) {
	     				UriBuilder partialUriBuilder = UriBuilder.fromResource(clz).path(method);
	        	        router = partialUriBuilder.toTemplate();
	     			}
        	        
        	       
        	        EnumHttpMethod reqHttpMethod = EnumHttpMethod.findByMethod(reqMethod);
        	        InputApiDto inputApi = new InputApiDto(router, reqHttpMethod.getValue());
        	        InternalApiDto api = ApiCrossService.getApi(inputApi);
        	        //if(api == null) err = EnumGeneralError.PERMISSION_NOT_EXISTED;
        	        if(api != null) {
        	        	List<InternalFunctionDto> apiFunctions = ApiCrossService.getFunctions(api.getApiId());
            	        if(apiFunctions.isEmpty()) err = EnumGeneralError.PERMISSION_NOT_EXISTED;
            	        
            	        Claims claims = tokenHelper.parseJWT(token);
    	        		Long userId = new Long(claims.getId());
    	        		List<InternalRoleFunctionDto> userFunctions = UserCrossService.getFunctions(userId);
    	        		
    	        		boolean hasPermision = false;
    	        		for(InternalFunctionDto apiFunction : apiFunctions) {
    	        			if(hasPermision) break;
    	        			for(InternalRoleFunctionDto userFunction : userFunctions) {
    	        				if(apiFunction.getFunctionId().equals(userFunction.getFunctionId()) && userFunction.getActions().get(EnumActionType.get(api.getActionTypeId()))) {
    	        					hasPermision = true;
    	        					break;
    	        				}
    	        			}
    	        		}
    	        		
    	        		if(!hasPermision) err = EnumGeneralError.PERMISSION_ACCESS_DENIED;
        	        }
        	        
	        	}
     		} catch (Exception e) {
     			e.printStackTrace();
     			err = EnumGeneralError.UNAUTHORIZED;
			}
        	
        	
        	
        	if(err != null) {
        		ErrorResponseDto data = new ErrorResponseDto(err);
     			requestContext.abortWith(Response.ok(data).status(err.getStatus()).type(MediaType.APPLICATION_JSON).build());
        	}
        
        	
        }
    }
    //ContainerResponseFilter
	@Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) {
    
    }


}
