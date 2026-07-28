package com.smartcard.automapper;

public class MapPair<S, D, V> {
	public IFrom<S, V> source;
	public ITo<D, V> dest;
	
	public MapPair(IFrom<S, V> source,  ITo<D, V> dest) {
		this.source = source;
		this.dest = dest;
	}
}
