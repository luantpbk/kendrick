package com.smartcard.persistence.dto;

import java.io.Serializable;
import java.util.List;

/**
 * The PageData.
 * 
 */
public class PageDataDto<T> implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -6193524832235970267L;
	private Long count;
	private List<T> items;
	private Object extraInfo;
	
	public PageDataDto(Long count, List<T> items)
	{
		this.count = count;
		this.items = items;
	}
	
	public PageDataDto(Long count, List<T> items, Object extraInfo)
	{
		this.count = count;
		this.items = items;
		this.extraInfo = extraInfo;
	}
	
	public Long getCount() {
		return count;
	}
	public void setCount(Long count) {
		this.count = count;
	}
	public List<T> getItems() {
		return items;
	}
	public void setItems(List<T> items) {
		this.items = items;
	}

	public Object getExtraInfo() {
		return extraInfo;
	}

	public void setExtraInfo(Object extra) {
		this.extraInfo = extra;
	}
	
}