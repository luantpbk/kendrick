package com.smartcard.persistence.dto;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.MappedSuperclass;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.smartcard.annotation.interceptor.IgnoreNullMapper;  
 
/** 
* Base Entity 
* 
* @author luanpt@gmail.com
*/  
@MappedSuperclass  
public abstract class BaseDto implements Serializable {	
	/**
	 * 
	 */
	private static final long serialVersionUID = 7906724825151580125L;
	
	@IgnoreNullMapper
    private String createdBy;  
  
	@IgnoreNullMapper
    private String updatedBy;  
    
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy/MM/dd", timezone="UTC")
	@IgnoreNullMapper
    private Date createdAt;  
    
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy/MM/dd", timezone="UTC")
	@IgnoreNullMapper
    private Date updatedAt;  
    
	@IgnoreNullMapper
    private Integer displayOrder;
  
	public Integer getDisplayOrder() {
		return displayOrder;
	}

	public void setDisplayOrder(Integer displayOrder) {
		this.displayOrder = displayOrder;
	}

	public String getCreatedBy() {  
            return createdBy;  
    }  
  
    public void setCreatedBy(String createdBy) {  
            this.createdBy = createdBy;  
    }  

    public String getUpdatedBy() {  
            return updatedBy;  
    }  
  
    public void setUpdatedBy(String updatedBy) {  
            this.updatedBy = updatedBy;  
    }

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public Date getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Date updatedAt) {
		this.updatedAt = updatedAt;
	}  
}
