package com.smartcard.automapper;

import com.fasterxml.jackson.annotation.JsonIgnore;

public interface  IMapFrom<T> {
	@JsonIgnore
	public Profile<? extends IMapFrom<T>, T> getProfile() throws NoSuchFieldException, SecurityException ;
	
}

