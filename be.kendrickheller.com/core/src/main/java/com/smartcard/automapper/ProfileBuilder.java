package com.smartcard.automapper;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

public class ProfileBuilder<D, S> {
	private Map<Field, MapPair<S, D, ?>> profile;
	private Map<Field, MapPair<D, S, ?>> reverseProfile;
	
	public ProfileBuilder() {
		profile = new HashMap<Field, MapPair<S, D, ?>>();
		reverseProfile = new HashMap<Field, MapPair<D, S, ?>>();
	}

	public <V> ProfileBuilder<D, S> addMember(Field dest, IFrom<S, V> from, ITo<D, V> to) {
		profile.put(dest, new MapPair<S, D, V>(from, to));
		return this;
	}
	
	public <V> ProfileBuilder<D, S> addMemberReverse (Field dest, IFrom<D, V> from, ITo<S, V> to) {
		reverseProfile.put(dest, (MapPair<D, S, V>) new MapPair<D, S, V>(from, to));
		return this;
	}
	
	public Profile<D, S> build() {
		return new Profile<D, S>(profile, reverseProfile);
	}
	
}
