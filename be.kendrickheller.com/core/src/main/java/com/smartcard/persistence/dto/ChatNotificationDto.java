package com.smartcard.persistence.dto;

import java.io.Serializable;
import java.util.UUID;


/**
 * The Dto class for the chat notification database table.
 * 
 */
public class ChatNotificationDto implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -7178409894707051752L;
	
	private String message;
	private Long receiverId;
	private Long senderId;
	private UUID roomId;
	private Long badge;
	
	public ChatNotificationDto() {
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Long getReceiverId() {
		return receiverId;
	}

	public void setReceiverId(Long receiverId) {
		this.receiverId = receiverId;
	}

	public Long getSenderId() {
		return senderId;
	}

	public void setSenderId(Long senderId) {
		this.senderId = senderId;
	}

	public UUID getRoomId() {
		return roomId;
	}

	public void setRoomId(UUID roomId) {
		this.roomId = roomId;
	}

	public Long getBadge() {
		return badge;
	}

	public void setBadge(Long badge) {
		this.badge = badge;
	}

}