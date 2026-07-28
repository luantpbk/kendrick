package com.smartcard.ws;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.smartcard.annotation.interceptor.AllowAnonymous;

@Path("/common")
@AllowAnonymous
public class CommonService {
	@Path("/date-time")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSystemTime() {
		return Response.status(Response.Status.OK).entity(new Long(System.currentTimeMillis())).build();
	}
}
