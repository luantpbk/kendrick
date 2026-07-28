package com.smartcard.util.model;

import com.smartcard.exception.GlobalException;

public interface IAssignPropertyEvent<T> {
	public AssignPropertyResult assignProperty(T entity, String propertyName, Object value) throws GlobalException;

}
