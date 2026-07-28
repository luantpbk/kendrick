package com.smartcard.util.model;

import java.io.Serializable;

public class AssignPropertyResult implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -614568324748669206L;
	private boolean isAssign;
	private Object value;

	public AssignPropertyResult() {
		this.isAssign = false;
	}

	public AssignPropertyResult(boolean isAssign, Object value) {
		this.isAssign = isAssign;
		this.value = value;
	}

	public boolean isAssign() {
		return isAssign;
	}

	public void setAssign(boolean isAssign) {
		this.isAssign = isAssign;
	}

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}

}
