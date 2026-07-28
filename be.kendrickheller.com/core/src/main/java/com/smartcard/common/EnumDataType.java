package com.smartcard.common;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

public enum EnumDataType {
	Text(1),
	Int(2),
	Date(3),
	PhoneNumber(4),
	Email(5),
	Boolean(6),
	Percentage(7),
	BigInt(8),
	JPY(9),
	Month(10),
	QuarterOfYear(11),
	Year(12),
	DateRange(13),
	Image(14),
	Option(15),
	HTML(16),
	Ratio(17),
	Link(18),
	Decimal(19),
	VND(20)
	;
	
	private int value;
	private String datePattern = "yyyy/MM/dd";
	private String timeZone = "JST";
	private String numberPattern = "#,###.####";
	
	private static final Map<Integer, EnumDataType> lookup = new HashMap<Integer, EnumDataType>();

    static {
        for (EnumDataType e : EnumDataType.values()) {
            lookup.put(e.getValue(), e);
        }
    }
	
    public static EnumDataType valueOf(int value) {
		return lookup.get(value);
	}
    
	private EnumDataType(int value) {
        this.value = value;
    }
     
    public int getValue() {
        return value;
    }

    public void setDatePattern(String pattern) {
    	this.datePattern = pattern;
    }
    
    public void setTimeZone(String timeZone) {
    	this.timeZone = timeZone;
    }
    
    public void setNumberPattern(String pattern) {
    	this.numberPattern = pattern;
    }
    
	public static EnumDataType get(int value) {
		return lookup.get(value);
	}
	
	public String convert(Object value) {
	
		DateFormat df = new SimpleDateFormat(this.datePattern);
		df.setTimeZone(TimeZone.getTimeZone(this.timeZone));
		DecimalFormat nf = new DecimalFormat(this.numberPattern);
		String str = "";
		if(value != null)
			switch (this) {
				case Date:
					str = df.format(value);
					break;
				case Int:
					str = nf.format((int)value);
					break;
				case BigInt:
					str = nf.format((long)value);
					break;
				case JPY:
					str = String.format("%s ¥", nf.format((BigDecimal)value));
					break;
				case Percentage:
					str = String.format("%f /%", value);  
					break;
				case Boolean:
					str = (boolean)value? "✓" : "❌";
					break;
				case Month:
				case QuarterOfYear:
				case Year:
					str = String.format("%d", value);  
					break;
				case Image:
					str = "<img src='" + value + "' width='48px' height='64px'/>";
					break;
				case Link:
					str = "<a href='" + value + "'>Link</a>";
					break;
				case Decimal:
					str = nf.format((BigDecimal)value);  
					break;
				case VND:
					str = String.format("%s đ", nf.format((BigDecimal)value));
					break;
				default:
					str = String.format("%s", value);
					break;
			}
		
		return str;
	}
	
	public Object convert(String strValue) {
		DateFormat df = new SimpleDateFormat(this.datePattern);
		df.setTimeZone(TimeZone.getTimeZone(this.timeZone));
		Object value = null;
		if(strValue != null && !strValue.isEmpty())
			try {
				switch (this) {
					case Date:
						value = df.parseObject(strValue);
						break;
					case Int:
					case Month:
					case QuarterOfYear:
					case Year:
						value = Integer.parseInt(strValue);
						break;
					case BigInt:
						value = Long.parseLong(strValue);
						break;
					case JPY:
						value = new BigDecimal(strValue);
						break;
					case Percentage:
						value = Float.parseFloat(strValue);  
						break;
					case Boolean:
						value = strValue.equals("true") ? true : false;
						break;
					case Decimal:
						value = new BigDecimal(strValue);  
						break;
					case VND:
						value = new BigDecimal(strValue);  
						break;
					default:
						value = strValue;
						break;
				}
			} catch (ParseException e) {
				value = null;
			}
		return value;
	}
}
