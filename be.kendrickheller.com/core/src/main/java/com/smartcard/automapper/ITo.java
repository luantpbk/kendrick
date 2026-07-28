package com.smartcard.automapper;

public interface ITo<D, V> {
	public void to(D dest, V value);
}
