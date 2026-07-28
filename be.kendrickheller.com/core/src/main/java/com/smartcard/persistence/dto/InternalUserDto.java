package com.smartcard.persistence.dto;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;


/**
 * The persistent class for the tbl_user database table.
 * 
 */
public class InternalUserDto extends BaseDto implements Serializable {


	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Long userId;

	@JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy/MM/dd", timezone="JST")
	private Date birthday;

	private String email;

	private String fullName;

	private Long groupId;

	private String langId;

	private String loginName;

	private String password;
	
	private String currentPassword;
	
	private String confirmPassword;

	private String telephone;
	
	private String mainAddress;
	
	private String facebookId;
	
	private String googleId;
	
	private String appleId;
	
	private String twitterId;
	
	private Integer cmtnd;
	
	private Integer cccd;
	
	private Integer mobile;
	
	private byte[] avata;
	
	private String avataUrl;
	
	private Integer sex;
	
	private String occupation;
	
	private String fbAccessToken;
	
	private String googleAccessToken;
	
	private String appleAccessToken;
	
	private String cover;
	
	private String loginNameHash;
	
	private String refreshToken;

	public String getRefreshToken() {
		return refreshToken;
	}

	public void setRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
	}

	public InternalUserDto() {
	}

	public Date getBirthday() {
		return this.birthday;
	}

	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getFullName() {
		return this.fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public Long getGroupId() {
		return this.groupId;
	}

	public void setGroupId(Long groupId) {
		this.groupId = groupId;
	}

	public String getLangId() {
		return this.langId;
	}

	public void setLangId(String langId) {
		this.langId = langId;
	}

	public String getLoginName() {
		return this.loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getTelephone() {
		return this.telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getMainAddress() {
		return mainAddress;
	}

	public void setMainAddress(String mainAddress) {
		this.mainAddress = mainAddress;
	}

	public String getFacebookId() {
		return facebookId;
	}

	public void setFacebookId(String facebookId) {
		this.facebookId = facebookId;
	}

	public String getGoogleId() {
		return googleId;
	}

	public void setGoogleId(String googleId) {
		this.googleId = googleId;
	}

	public String getAppleId() {
		return appleId;
	}

	public void setAppleId(String appleId) {
		this.appleId = appleId;
	}

	public String getTwitterId() {
		return twitterId;
	}

	public void setTwitterId(String twitterId) {
		this.twitterId = twitterId;
	}

	public Integer getCmtnd() {
		return cmtnd;
	}

	public void setCmtnd(Integer cmtnd) {
		this.cmtnd = cmtnd;
	}

	public Integer getCccd() {
		return cccd;
	}

	public void setCccd(Integer cccd) {
		this.cccd = cccd;
	}

	public Integer getMobile() {
		return mobile;
	}

	public void setMobile(Integer mobile) {
		this.mobile = mobile;
	}

	public byte[] getAvata() {
		return avata;
	}

	public void setAvata(byte[] avata) {
		this.avata = avata;
	}

	public Integer getSex() {
		return sex;
	}

	public void setSex(Integer sex) {
		this.sex = sex;
	}

	public String getOccupation() {
		return occupation;
	}

	public void setOccupation(String occupation) {
		this.occupation = occupation;
	}

	public String getAvataUrl() {
		return avataUrl;
	}

	public void setAvataUrl(String avataUrl) {
		this.avataUrl = avataUrl;
	}

	public String getConfirmPassword() {
		return confirmPassword;
	}

	public void setConfirmPassword(String confirmPassword) {
		this.confirmPassword = confirmPassword;
	}

	public String getFbAccessToken() {
		return fbAccessToken;
	}

	public void setFbAccessToken(String fbAccessToken) {
		this.fbAccessToken = fbAccessToken;
	}

	public String getCover() {
		return cover;
	}

	public void setCover(String cover) {
		this.cover = cover;
	}

	public String getGoogleAccessToken() {
		return googleAccessToken;
	}

	public void setGoogleAccessToken(String googleAccessToken) {
		this.googleAccessToken = googleAccessToken;
	}
	
	public String getAppleAccessToken() {
		return appleAccessToken;
	}

	public void setAppleAccessToken(String appleAccessToken) {
		this.appleAccessToken = appleAccessToken;
	}
	
	public String getLoginNameHash() {
		return loginNameHash;
	}

	public void setLoginNameHash(String loginNameHash) {
		this.loginNameHash = loginNameHash;
	}
	
	@Override
	public String toString() {
		return "{email: " + this.email +", facebookId:"+ this.facebookId +", fullName:"+ this.fullName +", loginName:"+ this.loginName+"}";
	}

	public String getCurrentPassword() {
		return currentPassword;
	}

	public void setCurrentPassword(String currentPassword) {
		this.currentPassword = currentPassword;
	}	
}