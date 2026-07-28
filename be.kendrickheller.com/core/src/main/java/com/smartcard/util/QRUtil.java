package com.smartcard.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.NotFoundException;
import com.google.zxing.Result;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.oned.Code128Writer;
import com.google.zxing.qrcode.QRCodeWriter;
import com.smartcard.common.EnumGeneralError;
import com.smartcard.exception.GlobalException;
import com.smartcard.common.CommonConstants;
import com.smartcard.common.EnumFileType;

public class QRUtil {
	public final static String QR_CODE = "qr_code";
	public final static String BARCODE = "barcode";
	private final static String UPLOAD_DIR = new PropertyUtil().get("upload.dir");
	
	private final static int QRCODE_WIDTH = 300;
	private final static int QRCODE_HEIGHT = 300;
	
	private final static int BARCODE_WIDTH = 300;
	private final static int BARCODE_HEIGHT = 150;

	public static byte[] generateQRCodeImage(String text) throws GlobalException {
		try {
			QRCodeWriter qrCodeWriter = new QRCodeWriter();
			BitMatrix bitMatrix;
			bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, QRCODE_WIDTH, QRCODE_HEIGHT);
			byte[] png;
			try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
				MatrixToImageWriter.writeToStream(bitMatrix, "PNG", baos);
				png = baos.toByteArray();
			}
			return png;
		} catch (WriterException | IOException e) {
			e.printStackTrace();
			throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR, e);
		}
	}
	
	public static byte[] generateBarcodeImage(String text, int width, int height) throws GlobalException {
		try {
			Code128Writer barcodeWriter = new Code128Writer();
			BitMatrix bitMatrix;
			if(width > 0 && height > 0) {
				bitMatrix = barcodeWriter.encode(text, BarcodeFormat.CODE_128, width, height);
			} else {
				System.out.println("text =======================" + text);
				bitMatrix = barcodeWriter.encode(text, BarcodeFormat.CODE_128, BARCODE_WIDTH, BARCODE_HEIGHT);
			}
			byte[] png;
			try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
				MatrixToImageWriter.writeToStream(bitMatrix, "PNG", baos);
				png = baos.toByteArray();
			}
			return png;
		} catch (WriterException | IOException e) {
			e.printStackTrace();
			throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR, e);
		}
	}
	
	public static byte[] generateBarcodeImage(String text) throws GlobalException {
		return generateBarcodeImage(text, 0, 0);
	}
	
	public static String writeQRCodeImage(String text) throws GlobalException {
		return writeQRCodeImage(text, null);
	}
	
	public static String writeQRCodeImage(String text, String name) throws GlobalException {
		try {
			String systemName = (name == null || name.isEmpty()? UUID.randomUUID().toString() : name) + ".PNG" ;
			String filePath = UPLOAD_DIR + "/" + EnumFileType.Image.getSubPath() + "/" + QR_CODE + "/" + systemName;
			byte[] qrCode = generateQRCodeImage(text);
			FileUtil.writeFile(qrCode, filePath);
			return systemName;
		} catch (IOException | GlobalException e) {
			e.printStackTrace();
			throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR, e);
		}
	}
	
	public static String writeBarcodeImage(String text, String name, int width, int height) throws GlobalException {
		try {
			String systemName = (name == null || name.isEmpty()? UUID.randomUUID().toString() : name) + ".PNG" ;
			String filePath = UPLOAD_DIR + "/" + EnumFileType.Image.getSubPath() + "/" + BARCODE + "/" + systemName;
			byte[] qrCode = generateBarcodeImage(text, width, height);
			FileUtil.writeFile(qrCode, filePath);
			return systemName;
		} catch (IOException | GlobalException e) {
			e.printStackTrace();
			throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR, e);
		}
	}
	
	public static boolean isExistedFile(String name) throws GlobalException {
		try {
			String filePath = UPLOAD_DIR + "/" + EnumFileType.Image.getSubPath() + "/" + QR_CODE + "/" + name;
			return FileUtil.isExistedFile(filePath);
		} catch (IOException e) {
			e.printStackTrace();
			throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR, e);
		}
	}
	
	public static boolean isExistedBarcode(String name) throws GlobalException {
		try {
			String filePath = UPLOAD_DIR + "/" + EnumFileType.Image.getSubPath() + "/" + BARCODE + "/" + name;
			return FileUtil.isExistedFile(filePath);
		} catch (IOException e) {
			e.printStackTrace();
			throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR, e);
		}
	}

	public static String readQRCode(MultipartFormDataInput input) throws GlobalException {
		try {
			Map<String, List<InputPart>> uploadForm = input.getFormDataMap();
			List<InputPart> inputParts = uploadForm.get(CommonConstants.UPLOADED_FILE_PARAMETER_NAME);
			InputPart inputPart = inputParts.get(0);
			InputStream inputStream = inputPart.getBody(InputStream.class, null);

			BinaryBitmap binaryBitmap = new BinaryBitmap(
					new HybridBinarizer(new BufferedImageLuminanceSource(ImageIO.read(inputStream))));
			Result result = new MultiFormatReader().decode(binaryBitmap);
			return result.getText();
		} catch (IOException | NotFoundException e) {
			e.printStackTrace();
			throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR, e);
		}

	}
}
