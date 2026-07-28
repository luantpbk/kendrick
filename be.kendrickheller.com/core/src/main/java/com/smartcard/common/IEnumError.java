package com.smartcard.common;

import javax.ws.rs.core.Response.Status;

public interface IEnumError {
    public String getCode();
    public String getMessage();
    public Status getStatus();
}
