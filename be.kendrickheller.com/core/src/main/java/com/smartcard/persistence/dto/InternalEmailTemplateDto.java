package com.smartcard.persistence.dto;
import java.io.Serializable;
import java.util.List;
import com.smartcard.persistence.dto.BaseDto;

/**
 * The Dto class for the email_template database table.
 * 
 */
public class InternalEmailTemplateDto extends BaseDto implements Serializable {
	
	private static final long serialVersionUID = -7899334536182003026L;
	private Long emailTemplateId;
	private String emailTemplateKey;
	private String emailTemplateTitle;
	private String emailTemplateValue;
	private List<HtmlSimpleParameterDto> emailSimpleParameter;
	private List<HtmlTableParameterDto> emailTableParameter;
	private String description;
	
	public InternalEmailTemplateDto() {
	}

	public String getEmailTemplateKey() {
		return emailTemplateKey;
	}

	public void setEmailTemplateKey(String emailTemplateKey) {
		this.emailTemplateKey = emailTemplateKey;
	}
	
	public Long getEmailTemplateId() {
		return emailTemplateId;
	}

	public void setEmailTemplateId(Long emailTemplateId) {
		this.emailTemplateId = emailTemplateId;
	}

	public String getEmailTemplateTitle() {
		return emailTemplateTitle;
	}

	public void setEmailTemplateTitle(String emailTemplateTitle) {
		this.emailTemplateTitle = emailTemplateTitle;
	}

	public String getEmailTemplateValue() {
		return emailTemplateValue;
	}

	public void setEmailTemplateValue(String emailTemplateValue) {
		this.emailTemplateValue = emailTemplateValue;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<HtmlSimpleParameterDto> getEmailSimpleParameter() {
		return emailSimpleParameter;
	}

	public void setEmailSimpleParameter(List<HtmlSimpleParameterDto> emailSimpleParameter) {
		this.emailSimpleParameter = emailSimpleParameter;
	}

	public List<HtmlTableParameterDto> getEmailTableParameter() {
		return emailTableParameter;
	}

	public void setEmailTableParameter(List<HtmlTableParameterDto> emailTableParameter) {
		this.emailTableParameter = emailTableParameter;
	}
}