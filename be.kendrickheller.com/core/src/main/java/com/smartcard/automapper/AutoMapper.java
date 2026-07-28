package com.smartcard.automapper;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import org.apache.commons.beanutils.BeanUtilsBean;

import com.smartcard.annotation.interceptor.IgnoreNullMapper;
import com.smartcard.common.EnumGeneralError;
import com.smartcard.exception.GlobalException;

public class AutoMapper {
	
	public static class MapperBeanUtilsBean<S,D> extends BeanUtilsBean{
		private final List<Field> sourceFields;
	    private final List<Field> destFields;
	    private final Profile<?,?> profile;
	    
	    public MapperBeanUtilsBean(Class<S> sourceClass, Class<D> destClass, Profile<?,?> profile, boolean ignoreNullValue) {
	    	super();
	    	this.sourceFields = new ArrayList<Field>();
	    	Collections.addAll(this.sourceFields, sourceClass.getDeclaredFields());
	    	Class<?> superClass = sourceClass.getSuperclass();
	    	while(superClass != null) {
		    	Collections.addAll(this.sourceFields, superClass.getDeclaredFields());
		    	superClass = superClass.getSuperclass();
	    	}
	    	this.destFields = new ArrayList<Field>();
	    	Collections.addAll(this.destFields, destClass.getDeclaredFields());
	    	superClass = destClass.getSuperclass();
	    	while(superClass != null) {
		    	Collections.addAll(this.destFields, superClass.getDeclaredFields());
		    	superClass = superClass.getSuperclass();
	    	}
	    	this.profile = profile;
	    }
	    
	    private Field findByFieldName(final List<Field> fields, final String fieldName) {
			for (Field sf : fields) {
				String name = sf.getName();
				if(name.equals(fieldName)) return sf;
			}
			return null;
		}
	    
		@SuppressWarnings({ "unused", "unchecked" })
		@Override
		public void copyProperty(Object dest, String name, Object value) throws IllegalAccessException, InvocationTargetException {
			Field sf = findByFieldName(this.sourceFields, name);
			Field df = findByFieldName(this.destFields, name);
			if(sf == null || df == null) return;
			IgnoreNullMapper sAnnotation = sf.getAnnotation(IgnoreNullMapper.class);
			IgnoreNullMapper dAnnotation = sf.getAnnotation(IgnoreNullMapper.class);
			if(sAnnotation != null && dAnnotation != null && value == null) return;
			if(profile != null && (profile.getProfile().containsKey(df) || profile.getReverseProfile().containsKey(df))) return;
			try {
				if(!sf.getType().equals(df.getType())) {
					if(AutoMapper.checkMapFrom(sf.getType(), df.getType()) || AutoMapper.checkMapFrom(df.getType(), sf.getType())) {
						super.copyProperty(dest, name, AutoMapper.map(value, df.getType()));
					}
					return;
				}
				if(Collection.class.isAssignableFrom(df.getType())) {
					ParameterizedType slt = (ParameterizedType) sf.getGenericType();
			        Class<?> sClass = (Class<?>) slt.getActualTypeArguments()[0];
			        ParameterizedType dlt = (ParameterizedType) df.getGenericType();
			        Class<?> dClass = (Class<?>) dlt.getActualTypeArguments()[0];
			        super.copyProperty(dest, name, AutoMapper.map(List.class.cast(value), dClass));
					return;
				}
			} catch (IllegalArgumentException | GlobalException e) {
				return;
			}
			super.copyProperty(dest, name, value);
		}
	}
	
	private static Boolean checkMapFrom(Class<?> toClass, Class<?> fromClass) {
		Type[] types = toClass.getGenericInterfaces();
		for (Type type : types) {
    		if(type instanceof ParameterizedType) {
				ParameterizedType parameterizedType = (ParameterizedType) type;
				Type[] actualTypes = parameterizedType.getActualTypeArguments();
				for(Type actualType : actualTypes) {
					if(actualType.equals(fromClass)) {
						return true;
					}
				}
			}
		}
		return false;
	}
	 
	public static <S, D> D map(final S source, final Class<D> destClass) throws GlobalException {
		D dest;
		try {
			dest = destClass.getDeclaredConstructor().newInstance();
			return map(source, dest);
		} catch (InstantiationException | IllegalAccessException | IllegalArgumentException | InvocationTargetException | NoSuchMethodException | SecurityException e) {
			throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR, e);
		}
	}
	
	@SuppressWarnings({"unchecked" })
	public static <S, D> D map(final S source, D dest) throws GlobalException {
		if(source == null || dest == null) return null;
		Class<D> destClass = (Class<D>) dest.getClass();
		try {
			Profile<?,?> profile = null;
			if(source instanceof IMapFrom) {
				profile = IMapFrom.class.cast(source).getProfile();
			} 
			if(dest instanceof IMapFrom) {
				profile = IMapFrom.class.cast(dest).getProfile();
			}
			MapperBeanUtilsBean<S, D> beanUtil = new MapperBeanUtilsBean<S, D>((Class<S>)source.getClass(), destClass, profile, true);
			beanUtil.copyProperties(dest, source);
			
			if(profile != null) {
				Map<Field, ?> members = source instanceof IMapFrom ? profile.getReverseProfile() : profile.getProfile();
				for(Entry<Field, ?> entry : members.entrySet()) {
					Object value = MapPair.class.cast(entry.getValue()).source.from(source);
					MapPair.class.cast(entry.getValue()).dest.to(dest, value);
				}
			}
		} catch (IllegalAccessException | InvocationTargetException | NoSuchFieldException | SecurityException e) {
			throw new GlobalException(EnumGeneralError.INTERNAL_SERVER_ERROR, e);
		} 
		return dest;
	}
	
	public static <S, D> List<D> map(final List<S> source, final Class<D> destClass) throws GlobalException {
		if(source == null) return null;
		List<D> dest = new ArrayList<D>();
		int length = source.size();
		for(int indx = 0; indx < length; indx++) {
			D destItem = map(source.get(indx), destClass);
			dest.add(destItem);
		}
		return dest;
	}
	
	public static Field findDeclaredField(Class<?> clazz, String fieldName) {
	    Class<?> current = clazz;
	    do {
	       try {
	           return current.getDeclaredField(fieldName);
	       } catch(Exception e) {}
	    } while((current = current.getSuperclass()) != null);
	    return null;
	}

	public static void ignore() {
		return;
	}
}
