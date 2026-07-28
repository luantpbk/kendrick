package com.smartcard.exception;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import com.smartcard.common.ErrorResponseDto;
import com.smartcard.common.IEnumError;

@Provider
public class GlobalExceptionHandler implements ExceptionMapper<Exception> {

	@Override
	public Response toResponse(Exception exception) {
		exception.printStackTrace();
		if(exception instanceof  GlobalException) {
			IEnumError err = ((GlobalException) exception).getError();
			String message = ((GlobalException) exception).getMessage();
			ErrorResponseDto data = new ErrorResponseDto(err, message);
			return Response.ok(data).status(err.getStatus()).build();
		}
		return Response.status(Status.INTERNAL_SERVER_ERROR).entity(exception).build();
	}

}
