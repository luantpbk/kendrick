package com.smartcard.persistence.dto;
import java.io.Serializable;
import com.smartcard.persistence.dto.BaseDto;

/**
 * The Dto class for the email database table.
 * 
 */
public class InternalEmailDto extends BaseDto implements Serializable {

	private static final long serialVersionUID = -8584035029087337924L;
	private Long emailId;
	private Long emailTemplateId;
	private String emailTemplateKey;
	private String emailTitle;
	private String emailValue;
	private String receiver;
	private String description;
	
	public InternalEmailDto() {
	}
	
	public Long getEmailId() {
		return emailId;
	}
	public void setEmailId(Long emailId) {
		this.emailId = emailId;
	}
	public Long getEmailTemplateId() {
		return emailTemplateId;
	}
	public void setEmailTemplateId(Long emailTemplateId) {
		this.emailTemplateId = emailTemplateId;
	}
	public String getEmailTitle() {
		return emailTitle;
	}
	public void setEmailTitle(String emailTitle) {
		this.emailTitle = emailTitle;
	}
	public String getEmailValue() {
		return emailValue;
	}
	public void setEmailValue(String emailValue) {
		this.emailValue = emailValue;
	}
	public String getReceiver() {
		return receiver;
	}
	public void setReceiver(String receiver) {
		this.receiver = receiver;
	}

	public String getEmailTemplateKey() {
		return emailTemplateKey;
	}

	public void setEmailTemplateKey(String emailTemplateKey) {
		this.emailTemplateKey = emailTemplateKey;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
}