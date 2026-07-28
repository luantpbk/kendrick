package com.smartcard.util;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.RenderingHints;
import java.awt.geom.AffineTransform;
import java.awt.image.AffineTransformOp;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.imageio.ImageIO;
import javax.ws.rs.core.MultivaluedMap;
import org.apache.commons.io.IOUtils;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import com.drew.imaging.ImageMetadataReader;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.MetadataException;
import com.drew.metadata.exif.ExifIFD0Directory;
import com.smartcard.common.EnumGeneralError;
import com.smartcard.exception.GlobalException;
import com.smartcard.common.CommonConstants;
import com.smartcard.common.EnumFileType;
//import com.smartcard.common.EnumImageType;
import com.smartcard.persistence.dto.InternalFileInfo;
import com.smartcard.util.model.ExcelSheetData;

public class FileUtil implements Serializable {

	public static class ImageInformation {
		public final int orientation;
		public final int width;
		public final int height;

		public ImageInformation(int orientation, int width, int height) {
			this.orientation = orientation;
			this.width = width;
			this.height = height;
		}
	}

	/**
	 * 
	 */
	private static final long serialVersionUID = -2674611298460958979L;
	private final static String UPLOAD_DIR = new PropertyUtil().get("upload.dir");
	private static int THUMB_WIDTH = Integer.parseInt(new PropertyUtil().get("thumb.width"));
	private static int MESSENGER_IMAGE_WIDTH = Integer.parseInt(new PropertyUtil().get("messenger.image.width"));

	private static String getFileName(MultivaluedMap<String, String> headers) {
		String[] contentDisposition = headers.getFirst("Content-Disposition").split(";");
		for (String filename : contentDisposition) {
			if ((filename.trim().startsWith("filename"))) {
				String[] name = filename.split("=");
				String finalFileName = sanitizeFilename(name[1]);
				return finalFileName;
			}
		}
		return "unknown";
	}

	private static String sanitizeFilename(String s) {
		return s.trim().replaceAll("\"", "");
	}

	public static void writeFile(byte[] content, String pathFile) throws IOException {
		File file = new File(pathFile);
		System.out.println("FileUtil.writeFile =======================" + pathFile);
		if (!file.exists()) {
			file.createNewFile();
		}
		FileOutputStream fop = new FileOutputStream(file);
		fop.write(content);
		fop.flush();
		fop.close();
		
	}
	
	public static boolean isExistedFile(String pathFile) throws IOException {
		File file = new File(pathFile);
		return file.exists();
	}

	public static ImageInformation readImageInformation(File imageFile, int width, int height) throws GlobalException {
		try {
			Metadata metadata = ImageMetadataReader.readMetadata(imageFile);
			Directory directory = metadata.getFirstDirectoryOfType(ExifIFD0Directory.class);
			int orientation = directory != null ? directory.getInt(ExifIFD0Directory.TAG_ORIENTATION) : 1;
			return new ImageInformation(orientation, width, height);
		} catch (MetadataException | ImageProcessingException | IOException e) {
			return new ImageInformation(1, width, height);
		}
	}

	public static ImageInformation readImageInformation(InputStream imageStream, int width, int height)
			throws GlobalException {
		try {
			Metadata metadata = ImageMetadataReader.readMetadata(imageStream);
			Directory directory = metadata.getFirstDirectoryOfType(ExifIFD0Directory.class);
			int orientation = directory != null ? directory.getInt(ExifIFD0Directory.TAG_ORIENTATION) : 1;
			return new ImageInformation(orientation, width, height);
		} catch (MetadataException | ImageProcessingException | IOException e) {
			return new ImageInformation(1, width, height);
		}
	}

	public static AffineTransform getExifTransformation(ImageInformation info) {
		AffineTransform t = new AffineTransform();
		switch (info.orientation) {
		case 1:
			break;
		case 2: // Flip X
			t.scale(-1.0, 1.0);
			t.translate(-info.width, 0);
			break;
		case 3: // PI rotation
			t.translate(info.width, info.height);
			t.rotate(Math.PI);
			break;
		case 4: // Flip Y
			t.scale(1.0, -1.0);
			t.translate(0, -info.height);
			break;
		case 5: // - PI/2 and Flip X
			t.rotate(-Math.PI / 2);
			t.scale(-1.0, 1.0);
			break;
		case 6: // -PI/2 and -width
			t.translate(info.height, 0);
			t.rotate(Math.PI / 2);
			break;
		case 7: // PI/2 and Flip
			t.scale(-1.0, 1.0);
			t.translate(-info.height, 0);
			t.translate(0, info.width);
			t.rotate(3 * Math.PI / 2);
			break;
		case 8: // PI / 2
			t.translate(0, info.width);
			t.rotate(3 * Math.PI / 2);
			break;
		}
		return t;
	}

	public static BufferedImage transformImage(BufferedImage image, AffineTransform transform) {
		AffineTransformOp op = new AffineTransformOp(transform, AffineTransformOp.TYPE_BICUBIC);
		BufferedImage destinationImage = op.createCompatibleDestImage(image,
				(image.getType() == BufferedImage.TYPE_BYTE_GRAY) ? image.getColorModel() : null);
		Graphics2D g = destinationImage.createGraphics();
		g.setBackground(Color.WHITE);
		g.clearRect(0, 0, destinationImage.getWidth(), destinationImage.getHeight());
		destinationImage = op.filter(image, destinationImage);
		return destinationImage;
	}

	public static Map<String, InputPart> getFileData(MultipartFormDataInput input) {
		Map<String, List<InputPart>> uploadForm = input.getFormDataMap();
		List<InputPart> inputParts = uploadForm.get(CommonConstants.UPLOADED_FILE_PARAMETER_NAME);
		return inputParts.stream().collect(Collectors.toMap(i -> {
			MultivaluedMap<String, String> headers = i.getHeaders();
			String fullName = getFileName(headers);
			String fileName = fullName.lastIndexOf(".") > 0 ? fullName.substring(0, fullName.lastIndexOf("."))
					: fullName;
			return fileName;
		}, i -> i));
	}

	public static List<InternalFileInfo> upload(int objectType, String subPath, EnumFileType fileType,
			MultipartFormDataInput input) throws GlobalException {
		Map<String, List<InputPart>> uploadForm = input.getFormDataMap();
		List<InputPart> inputParts = uploadForm.get(CommonConstants.UPLOADED_FILE_PARAMETER_NAME);
		return upload(objectType, subPath, fileType, inputParts);
	}
	
	public static int getSize(MultipartFormDataInput input) throws GlobalException {
		Map<String, List<InputPart>> uploadForm = input.getFormDataMap();
		List<InputPart> inputParts = uploadForm.get(CommonConstants.UPLOADED_FILE_PARAMETER_NAME);
		int size = 0;
		for (InputPart inputPart : inputParts) {
			try {
				InputStream inputStream = inputPart.getBody(InputStream.class, null);
				byte[] bytes = IOUtils.toByteArray(inputStream);
				size += bytes.length;
				
			} catch (IOException e) {
				e.printStackTrace();
				throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR, e);
			}
		
		}
		return size;
	}
	
	public static List<InternalFileInfo> upload(int objectType, String subPath, EnumFileType fileType,
			List<InputPart> inputParts) throws GlobalException {
		List<InternalFileInfo> fileInfos = new ArrayList<InternalFileInfo>();
		for (InputPart inputPart : inputParts) {
			try {
				InternalFileInfo fileInfo = new InternalFileInfo();
				MultivaluedMap<String, String> headers = inputPart.getHeaders();
				String fullName = getFileName(headers);
				System.out.println("File name ======================= " + fullName);
				String fileName = fullName.lastIndexOf(".") > 0 ? fullName.substring(0, fullName.lastIndexOf("."))
						: fullName;
				String ext = fullName.lastIndexOf(".") > 0 ? fullName.substring(fullName.lastIndexOf(".") + 1) : "";
				String systemName = !ext.isEmpty() ? UUID.randomUUID().toString() + "." + ext : UUID.randomUUID().toString();
				fileInfo.setFileName(fileName);
				fileInfo.setSystemName(systemName);
				fileInfo.setFileTypeId(fileType.getValue());
				fileInfo.setObjectType(objectType);
				InputStream inputStream = inputPart.getBody(InputStream.class, null);
				byte[] bytes = IOUtils.toByteArray(inputStream);
				String filePath = UPLOAD_DIR + "/" + fileType.getSubPath() + "/" + subPath + "/"
						+ systemName;
				writeFile(bytes, filePath);
				if (fileType.equals(EnumFileType.Image)) {
					System.out.println("Start generate thumbnail avata =======================");
					// Xoay ảnh theo metadata
					BufferedImage sourceImg = ImageIO.read(new File(filePath));
					int width = sourceImg.getWidth();
					int height = sourceImg.getHeight();
					ImageInformation imageInformation = readImageInformation(new File(filePath), width, height);
					AffineTransform transform = getExifTransformation(imageInformation);
					sourceImg = transformImage(sourceImg, transform);
					
					BufferedImage thumbImg = resizeImageMultiStep(sourceImg, THUMB_WIDTH);
					System.out.println("End generate thumbnail avata =======================");
					String thumbPath = UPLOAD_DIR + "/" + fileType.getSubPath() + "/" + subPath + "/"
							+ CommonConstants.THUMB_FILE_FOLDER_NAME + "/" + systemName;
					ImageIO.write(thumbImg, ext, Files.newOutputStream(Paths.get(thumbPath)));
					System.out.println("Write thumbnail avata =======================" + thumbPath);
				}
				fileInfos.add(fileInfo);
			} catch (IOException e) {
				e.printStackTrace();
				throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR, e);
			}
		}
		return fileInfos;
	}
	
	public static BufferedImage resizeImageMultiStep(BufferedImage sourceImg, int targetWidth) {
        int currentWidth = sourceImg.getWidth();
        int currentHeight = sourceImg.getHeight();
        int targetHeight = targetWidth * currentHeight / currentWidth;
        BufferedImage img = sourceImg;
        do {
            int nextWidth = currentWidth / 2;
            if (nextWidth < targetWidth) {
                nextWidth = targetWidth;
            }

            int nextHeight = currentHeight / 2;
            if (nextHeight < targetHeight) {
                nextHeight = targetHeight;
            }

            BufferedImage tmp = new BufferedImage(nextWidth, nextHeight, BufferedImage.TYPE_INT_RGB);
            Graphics2D g2 = tmp.createGraphics();
            g2.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
            g2.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            g2.drawImage(img, 0, 0, nextWidth, nextHeight, null);
            g2.dispose();

            img = tmp;
            currentWidth = nextWidth;
            currentHeight = nextHeight;

        } while (currentWidth != targetWidth || currentHeight != targetHeight);

        return img;
    }

	public static List<String> upload(String subPath, EnumFileType fileType,
			MultipartFormDataInput input) throws GlobalException {
		Map<String, List<InputPart>> uploadForm = input.getFormDataMap();
		List<InputPart> inputParts = uploadForm.get(CommonConstants.UPLOADED_FILE_PARAMETER_NAME);
		List<String> fileNames = new ArrayList<String>();
		for (InputPart inputPart : inputParts) {
			try {
				MultivaluedMap<String, String> headers = inputPart.getHeaders();
				String fullName = getFileName(headers);
				System.out.println("File name ======================= " + fullName);
				String ext = fullName.lastIndexOf(".") > 0 ? fullName.substring(fullName.lastIndexOf(".") + 1) : "";
				String uuid = UUID.randomUUID().toString();
				String tempName = !ext.isEmpty() ? uuid + "temp." + ext : uuid;
				String systemName = !ext.isEmpty() ? uuid + "." + ext : uuid;
				InputStream inputStream = inputPart.getBody(InputStream.class, null);
				String filePath = UPLOAD_DIR + "/" + fileType.getSubPath() + "/" + subPath + "/"
						+ systemName;
				String tempPath = UPLOAD_DIR + "/" + fileType.getSubPath() + "/" + subPath + "/"
						+ tempName;
				byte[] bytes = IOUtils.toByteArray(inputStream);
				writeFile(bytes, tempPath);
				File file = new File(tempPath);
				
				BufferedImage sourceImg = ImageIO.read(file);
				// Xoay ảnh theo metadata
				int width = sourceImg.getWidth();
				int height = sourceImg.getHeight();
				ImageInformation imageInformation = readImageInformation(file, width, height);
				AffineTransform transform = getExifTransformation(imageInformation);
				sourceImg = transformImage(sourceImg, transform);
				width = sourceImg.getWidth();
				height = sourceImg.getHeight();
				
				BufferedImage resizeImg = new BufferedImage(MESSENGER_IMAGE_WIDTH, MESSENGER_IMAGE_WIDTH * height / width,
						BufferedImage.TYPE_INT_RGB);
				resizeImg.createGraphics().drawImage(sourceImg.getScaledInstance(MESSENGER_IMAGE_WIDTH,
						MESSENGER_IMAGE_WIDTH * height / width, Image.SCALE_SMOOTH), 0, 0, null);
				ImageIO.write(resizeImg, ext, Files.newOutputStream(Paths.get(filePath)));
				
				// Tạo thumb
				String thumbPath = UPLOAD_DIR + "/" + fileType.getSubPath() + "/" + subPath + "/thumb/"
						+ systemName;
				BufferedImage thumbImg = new BufferedImage(THUMB_WIDTH, THUMB_WIDTH * height / width,
						BufferedImage.TYPE_INT_RGB);
				thumbImg.createGraphics().drawImage(
						sourceImg.getScaledInstance(THUMB_WIDTH, THUMB_WIDTH * height / width, Image.SCALE_SMOOTH), 0, 0,
						null);
				ImageIO.write(thumbImg, ext, Files.newOutputStream(Paths.get(thumbPath)));
				
				file.delete();
				fileNames.add(systemName);
			} catch (IOException e) {
				e.printStackTrace();
				throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR, e);
			}
		}
		return fileNames;
	}

	public static List<ExcelSheetData> readSheet(MultipartFormDataInput input, String sheetName, Integer fromRowNum,
			Integer toRowNum, Integer maxRows, Integer titleRowNum) throws GlobalException {
		ExcelReader reader = getReader(input);
		List<ExcelSheetData> result = reader.readSheet(sheetName, fromRowNum, toRowNum, maxRows, titleRowNum);
		return result;
	}

	public static List<String> getSheets(MultipartFormDataInput input) throws GlobalException {
		ExcelReader reader = getReader(input);
		List<String> result = reader.getSheets();
		return result;
	}

	public static ExcelReader getReader(MultipartFormDataInput input) throws GlobalException {
		try {
			Map<String, List<InputPart>> uploadForm = input.getFormDataMap();
			List<InputPart> inputParts = uploadForm.get(CommonConstants.UPLOADED_FILE_PARAMETER_NAME);
			InputPart inputPart = inputParts.get(0);
			MultivaluedMap<String, String> headers = inputPart.getHeaders();
			String fileName = getFileName(headers);
			InputStream inputStream = inputPart.getBody(InputStream.class, null);
			ExcelReader reader = new ExcelReader(inputStream, fileName);
			return reader;
		} catch (IOException e) {
			e.printStackTrace();
			throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR, e);
		}
	}

}
