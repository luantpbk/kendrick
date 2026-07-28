package com.smartcard.util;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.Base64;
import com.google.api.services.gmail.Gmail;
import com.smartcard.common.EnumGeneralError;
import com.smartcard.exception.GlobalException;
import com.smartcard.persistence.dto.HtmlSimpleParameterDto;
import com.smartcard.persistence.dto.HtmlTableParameterDto;
import com.smartcard.persistence.dto.InternalEmailDto;
import com.smartcard.persistence.dto.InternalEmailTemplateDto;
import com.smartcard.ws.EmailTemplateCrossService;

public class MailSenderUtil {
	static SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
	private final static PropertyUtil prop = new PropertyUtil();
	private final static String SUPPORT_EMAIL = prop.get("support.email");
	private final static String SERVICE_ACCOUNT_USER_EMAIL = prop.get("smtp.gserviceaccount");
	private final static String SERVICE_ACCOUNT_PRIVATE_KEY_FROMP12FILE = prop.get("smtp.accountprivatekey");
	private final static String SERVICE_ACCOUNT_SCOPES = prop.get("smtp.accountscopes");
	private final static String SMTP_USER_NAME = prop.get("smtp.username");
	private final static String SMTP_PASSWORD = prop.get("smtp.password");
	private final static String SMTP_HOST = prop.get("smtp.host");
	private final static String SMTP_PORT = prop.get("smtp.port");
	private final static String SMTP_AUTH = prop.get("smtp.auth");
	private final static String SMTP_STARTTLS = prop.get("smtp.starttls.enable");
	
	public MailSenderUtil() {
	}

	public static void sendMailWithFileAttach(String toEmail, String subject, String content, String filePath)
			throws MessagingException, IOException, GeneralSecurityException {
		Properties props = new Properties();
		Session session = Session.getDefaultInstance(props, null);
		if (toEmail == null) toEmail = SUPPORT_EMAIL;
		MimeMessage message = new MimeMessage(session);
		message.setFrom(new InternetAddress(SUPPORT_EMAIL));
		message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
		message.setSubject(subject, "utf-8");
		MimeBodyPart messageBodyPart = new MimeBodyPart();
		Multipart multipart = new MimeMultipart();
		messageBodyPart = new MimeBodyPart();
		String fileName = "Backup data file on: " + MailSenderUtil.df.format(new Date());
		DataSource source = new FileDataSource(filePath);
		messageBodyPart.setDataHandler(new DataHandler(source));
		messageBodyPart.setFileName(fileName);
		multipart.addBodyPart(messageBodyPart);
		message.setContent(multipart, "text/html; charset=utf-8");
		final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
		final JsonFactory JSON_FACTORY = new JacksonFactory();
        Gmail service = new Gmail.Builder(HTTP_TRANSPORT, JSON_FACTORY, MailSenderUtil.getCredentials(HTTP_TRANSPORT, JSON_FACTORY))
                .setApplicationName("Identity Management System ")
                .build();
     
		com.google.api.services.gmail.model.Message message2 = createMessageWithEmail(message);
		message2 = service.users().messages().send("me", message2).execute();
	}

	/**
	 * Create a MimeMessage using the parameters provided.
	 *
	 * @param to       email address of the receiver
	 * @param from     email address of the sender, the mailbox account
	 * @param subject  subject of the email
	 * @param bodyText body text of the email
	 * @return the MimeMessage to be used to send email
	 * @throws MessagingException
	 */
	public static MimeMessage createEmail(String to, String from, String subject, String bodyText)
			throws MessagingException {
		Properties props = new Properties();
		Session session = Session.getDefaultInstance(props, null);
		MimeMessage email = new MimeMessage(session);
		email.setFrom(new InternetAddress(from));
		email.addRecipient(javax.mail.Message.RecipientType.TO, new InternetAddress(to));
		email.setSubject(subject, "utf-8");
		email.setText(bodyText);
		
		return email;
	}

	private static GoogleCredential getCredentials(final HttpTransport httpTransport,
			final JsonFactory jsonFactory) throws IOException, GeneralSecurityException {
		GoogleCredential credential = new GoogleCredential.Builder()
				.setTransport(httpTransport)
				.setJsonFactory(jsonFactory)
				.setServiceAccountId(SERVICE_ACCOUNT_USER_EMAIL)
				.setServiceAccountPrivateKeyFromP12File(new File(SERVICE_ACCOUNT_PRIVATE_KEY_FROMP12FILE))
				.setServiceAccountScopes(Collections.singleton(SERVICE_ACCOUNT_SCOPES))
				.setServiceAccountUser(SMTP_USER_NAME)
				.build();
		credential.refreshToken();
		return credential;
	}
	
	/**
	 * Create a message from an email.
	 *
	 * @param emailContent Email to be set to raw of message
	 * @return a message containing a base64url encoded email
	 * @throws IOException
	 * @throws MessagingException
	 */
	public static com.google.api.services.gmail.model.Message createMessageWithEmail(MimeMessage emailContent) throws MessagingException, IOException {
		ByteArrayOutputStream buffer = new ByteArrayOutputStream();
		emailContent.writeTo(buffer);
		byte[] bytes = buffer.toByteArray();
		String encodedEmail = Base64.encodeBase64URLSafeString(bytes);
		com.google.api.services.gmail.model.Message message = new com.google.api.services.gmail.model.Message();
		message.setRaw(encodedEmail);
		return message;
	}

	public static com.google.api.services.gmail.model.Message sendMail(String userEmail, String mailSubject, String mailContent) throws GlobalException {
		try {
			System.out.println("=============Send email to: " + userEmail);
			System.out.println("=============Config: " + SMTP_USER_NAME);
			System.out.println("=============Config: " + SERVICE_ACCOUNT_USER_EMAIL);
			System.out.println("=============Config: " + SERVICE_ACCOUNT_PRIVATE_KEY_FROMP12FILE);
			System.out.println("=============Config: " + SERVICE_ACCOUNT_SCOPES);
			final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
			final JsonFactory JSON_FACTORY = new JacksonFactory();
	        Gmail service = new Gmail.Builder(HTTP_TRANSPORT, JSON_FACTORY, MailSenderUtil.getCredentials(HTTP_TRANSPORT, JSON_FACTORY))
	                .setApplicationName("Identity Management System ")
	                .build();
	        MimeMessage mimeMsg = MailSenderUtil.createEmail(userEmail, SMTP_USER_NAME, mailSubject, mailContent);
	        mimeMsg.setContent(mailContent, "text/html; charset=utf-8");
			com.google.api.services.gmail.model.Message message = createMessageWithEmail(mimeMsg);
			message = service.users().messages().send("me", message).execute();
			System.out.println("Send email message id: " + message.getId());
			System.out.println(message.toPrettyString());
			return message;
		} catch (GoogleJsonResponseException  e) {
			throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR, e.getDetails().getMessage());
		} catch (Throwable e) {
			throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR, e);
		}
	}
	
	
	public static void sendPersonalMail(String userEmail, String mailSubject, String mailContent) throws GlobalException {
		try {
		  	Properties props = new Properties();
	        props.put("mail.smtp.host", SMTP_HOST);
	        props.put("mail.smtp.port", SMTP_PORT);
	        props.put("mail.smtp.auth", SMTP_AUTH);
	        props.put("mail.smtp.starttls.enable", SMTP_STARTTLS); //enable STARTTLS
	        Session session = Session.getInstance(props, new javax.mail.Authenticator() {
	            protected PasswordAuthentication getPasswordAuthentication() {
	                return new PasswordAuthentication(SMTP_USER_NAME, SMTP_PASSWORD);
	            }
	        });
	        MimeMessage message = new MimeMessage(session);
	        message.setFrom(new InternetAddress(SMTP_USER_NAME));
	        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(userEmail, false));
	        message.setSubject(mailSubject);
	        message.setContent(mailContent, "text/html; charset=utf-8");
	        Transport.send(message);
	        System.out.println("Gui mail thanh cong");
		} catch (MessagingException e) {
			throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR, e);
		}
	}

 	public static InternalEmailDto getEmailContent(String emailTemplateKey, Map<String, Object> simpleData, Map<String, List<Map<String, Object>>> tableData) throws GlobalException {
		InternalEmailTemplateDto template = EmailTemplateCrossService.getEmailTemplateByKey(emailTemplateKey);
		if(template == null) throw new GlobalException(EnumGeneralError.INVALID_PARAM, "Mẫu email không tồn tại");
		String content = template.getEmailTemplateValue();
		List<HtmlSimpleParameterDto> simplePrameters = template.getEmailSimpleParameter();
		List<HtmlTableParameterDto> tableParameters = template.getEmailTableParameter();
		content = Util.mergeContent(content, simplePrameters, tableParameters, simpleData, tableData);
		InternalEmailDto email = new InternalEmailDto();
		email.setEmailTemplateId(template.getEmailTemplateId());
		email.setEmailTitle(template.getEmailTemplateTitle());
		email.setEmailValue(content);
		email.setDescription(template.getDescription());
		return email;
	}
 	
 	public static boolean isValidEmailAddress(String email) {
 	   boolean result = true;
 	   try {
 	      InternetAddress emailAddr = new InternetAddress(email);
 	      emailAddr.validate();
 	   } catch (AddressException ex) {
 	      result = false;
 	   }
 	   return result;
 	}
}
