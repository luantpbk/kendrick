package com.smartcard.automapper;

import java.lang.reflect.Field;
import java.util.Map;

public class Profile<D, S> {
	private Map<Field, MapPair<S, D, ?>> profile;
	private Map<Field, MapPair<D, S, ?>> reverseProfile;
	
	public Profile(Map<Field, MapPair<S, D, ?>> profile, Map<Field, MapPair<D, S, ?>> reverseProfile) {
		this.profile = profile;
		this.reverseProfile = reverseProfile;
	}
	
	public Map<Field, MapPair<S, D, ?>> getProfile() {
		return profile;
	}
	
	public Map<Field, MapPair<D, S, ?>> getReverseProfile() {
		return reverseProfile;
	}
}
