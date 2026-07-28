package com.smartcard.persistence.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.smartcard.annotation.interceptor.IgnoreNullMapper;
import com.smartcard.util.CustomDateAndTimeSerializer;
import com.smartcard.util.CustomerDateAndTimeDeserialize;  
 
/** 
* Base Entity 
* 
* @author nghia.n.v2007@gmail.com
*/  
@MappedSuperclass  
public abstract class BaseEntity implements Serializable {	
	/**
	 * 
	 */
	private static final long serialVersionUID = 7906724825151580125L;
	
	@Column(name = "delete_flg")  
	@IgnoreNullMapper
    Integer deleteFlg;
	
	@Column(name = "created_at")  
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
	@JsonSerialize(using = CustomDateAndTimeSerializer.class)
	@JsonDeserialize(using=CustomerDateAndTimeDeserialize.class)
    @Temporal(TemporalType.TIMESTAMP)  
	@IgnoreNullMapper
    private Date createdAt;  
  
    @Size(max = 255)  
    @Column(name = "created_by", length = 255)  
	@IgnoreNullMapper
    private String createdBy;  
  
    @Column(name = "updated_at")  
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
	@JsonSerialize(using = CustomDateAndTimeSerializer.class)
	@JsonDeserialize(using=CustomerDateAndTimeDeserialize.class)
    @Temporal(TemporalType.TIMESTAMP)  
	@IgnoreNullMapper
    private Date updatedAt;  
  
    @Size(max = 255)  
    @Column(name = "updated_by", length = 255)  
	@IgnoreNullMapper
    private String updatedBy;
    
    @Column(name = "display_order")  
	@IgnoreNullMapper
    Integer displayOrder;
  
    public Date getCreatedAt() {  
            return createdAt;  
    }  
  
    public void setCreatedAt(Date createdAt) {  
            this.createdAt = createdAt;  
    }  
  
    public String getCreatedBy() {  
            return createdBy;  
    }  
  
    public void setCreatedBy(String createdBy) {  
            this.createdBy = createdBy;  
    }  
  
    public Date getUpdatedAt() {  
            return updatedAt;  
    }  
  
    public void setUpdatedAt(Date updatedAt) {  
            this.updatedAt = updatedAt;  
    }  
  
    public String getUpdatedBy() {  
            return updatedBy;  
    }  
  
    public void setUpdatedBy(String updatedBy) {  
            this.updatedBy = updatedBy;  
    }  
  
    /** 
     * Sets createdAt before insert 
     */  
    @PrePersist  
    public void setCreationDate() {  
        this.createdAt = new Date();  
    }  
  
    /** 
     * Sets updatedAt before update 
     */  
    @PreUpdate  
    public void setChangeDate() {  
        this.updatedAt = new Date();  
    }

	public Integer getDeleteFlg() {
		return deleteFlg;
	}

	public void setDeleteFlg(Integer deleteFlg) {
		this.deleteFlg = deleteFlg;
	}

	public Integer getDisplayOrder() {
		return displayOrder;
	}

	public void setDisplayOrder(Integer displayOrder) {
		this.displayOrder = displayOrder;
	}
}
