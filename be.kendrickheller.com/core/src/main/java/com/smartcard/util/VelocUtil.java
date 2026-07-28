package com.smartcard.util;

import java.io.StringWriter;
import java.util.Map;

import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.runtime.RuntimeConstants;
import org.apache.velocity.runtime.log.NullLogChute;
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader;
public class VelocUtil {
	public static String mergeContent(Map<String, Object> map, String templatePath) {
		VelocityEngine ve = new VelocityEngine();
		
		ve.setProperty(RuntimeConstants.RESOURCE_LOADER, "classpath"); 
        ve.setProperty("classpath.resource.loader.class", ClasspathResourceLoader.class.getName());
        ve.setProperty("runtime.log.logsystem.class", NullLogChute.class.getName());
        ve.init();
        
        VelocityContext context = new VelocityContext();
        
        context.put("entity", map);
        
        Template t = ve.getTemplate( templatePath, "UTF-8");

        StringWriter writer = new StringWriter();
        t.merge( context, writer );
        return writer.toString();
	}
	
	
	
	
}
