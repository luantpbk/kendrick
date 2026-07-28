package com.smartcard.util;

public interface EzyBuilder<T> {

    /**
     * build a product.
     *
     * @return the constructed product
     */
    T build();
}