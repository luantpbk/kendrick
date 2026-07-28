package com.smartcard.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

import org.apache.commons.lang.StringUtils;

public class DateUtil {
	/**
	 * yyyy/MM/dd
	 */
	public static final SimpleDateFormat df1 = new SimpleDateFormat("yyyy/MM/dd", Locale.JAPAN);

	/**
	 * MM/yyyy
	 */
	public static final SimpleDateFormat df2 = new SimpleDateFormat("MM/yyyy", Locale.JAPAN);

	/**
	 * dd-MM-yyyy
	 */
	public static final SimpleDateFormat df3 = new SimpleDateFormat("dd-MM-yyyy", Locale.JAPAN);

	/**
	 * ddMMyyyy
	 */
	public static final SimpleDateFormat df4 = new SimpleDateFormat("ddMMyyyy", Locale.JAPAN);

	/**
	 * yyyy-MM-dd
	 */
	public static final SimpleDateFormat df5 = new SimpleDateFormat("yyyy-MM-dd", Locale.JAPAN);

	/**
	 * Lấy đối tượng ngày là ngày hôm qua bắt đầu từ 9h
	 * 
	 * @return
	 */
	public static Date yesterday() {
		final Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("JST"));
		cal.add(Calendar.DATE, -1);
		cal.set(Calendar.HOUR, 9);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.AM_PM, Calendar.AM);
		return cal.getTime();
	}

	public static Date today() {
		final Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("JST"));
		cal.set(Calendar.HOUR, 9);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.AM_PM, Calendar.AM);
		return cal.getTime();
	}
	
	public static Date now() {
		final Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("JST"));
		return cal.getTime();
	}

	public static Date parse(String dateStr) {
		if (StringUtils.isEmpty(dateStr)) {
			return null;
		}
		try {
			return df1.parse(dateStr);
		} catch (ParseException e) {
			return null;
		}
	}

	public static Date atStartOfDay(Date date, String timeZone) {
		if (date == null)
			return null;
		LocalDateTime localDateTime = dateToLocalDateTime(date);
		LocalDateTime startOfDay = localDateTime.with(LocalTime.MIN);
		return localDateTimeToDate(startOfDay, timeZone);
	}

	public static Date atEndOfDay(Date date, String timeZone) {
		if (date == null)
			return null;
		LocalDateTime localDateTime = dateToLocalDateTime(date);
		LocalDateTime endOfDay = localDateTime.with(LocalTime.MAX);
		return localDateTimeToDate(endOfDay, timeZone);
	}

	private static LocalDateTime dateToLocalDateTime(Date date) {
		return LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
	}

	private static Date localDateTimeToDate(LocalDateTime localDateTime, String timeZone) {
		return Date.from(localDateTime.atZone(ZoneId.of(timeZone, ZoneId.SHORT_IDS)).toInstant());
	}

	public static Date plusDay(Date date, int day, String timeZone) {
		LocalDateTime dateTime = LocalDateTime.from(date.toInstant().atZone(ZoneId.of(timeZone))).plusDays(day);
		return Date.from(dateTime.atZone(ZoneId.of(timeZone, ZoneId.SHORT_IDS)).toInstant());
	}
	
	public static String toString(Date date, SimpleDateFormat dateFormat) {  
		String strDate = dateFormat.format(date);  
		return strDate;
	}
	
	public static String toString(Date date) {  
		String strDate = df1.format(date);  
		return strDate;
	}
}
