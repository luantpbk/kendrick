package com.smartcard.automapper;

public interface IFrom<S, V> {
	public V from(S source);
}
