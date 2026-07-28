package com.smartcard.common;

import javax.ws.rs.core.Response.Status;

public enum EnumGeneralError implements IEnumError{

	PERMISSION_ACCESS_DENIED("PERMISSION_ACCESS_DENIED", "Bạn không có quyền thực hiện hành động này.", Status.FORBIDDEN),
	UNAUTHORIZED("UNAUTHORIZED", "Bạn không có quyền đăng nhập vào hệ thống.", Status.UNAUTHORIZED),
	TOKEN_EXPIRED("TOKEN_EXPIRED", "Phiên đăng nhập quá hạn.", Status.UNAUTHORIZED),
	INVALID_PARAM("INVALID_PARAM", "Dữ liệu bị lỗi. Vui lòng thử lại sau!", Status.BAD_REQUEST),
	INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR", "Lỗi hệ thống. Vui lòng thử lại sau!", Status.INTERNAL_SERVER_ERROR),
	MAPPING_MODEL_NOT_FOUND("MAPPING_MODEL_NOT_FOUND", "Không tồn tại mapping đối tượng!", Status.INTERNAL_SERVER_ERROR),
	PERMISSION_NOT_EXISTED("PERMISSION_NOT_EXISTED", "Api chưa được phân quyền.", Status.FORBIDDEN);
	
	private String code;
	private String message;
	private Status status;
	
	private EnumGeneralError(String code, String message, Status status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
     
    public String getCode() {
        return code;
    }
    public String getMessage() {
        return message;
    }
    public Status getStatus() {
        return status;
    }
}
