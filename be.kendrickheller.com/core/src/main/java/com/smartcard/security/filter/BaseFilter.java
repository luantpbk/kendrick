package com.smartcard.security.filter;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.smartcard.ws.CurrentContextService;

public class BaseFilter implements Filter {
	
	private static final String ENCODING = "UTF-8";

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
			throws IOException, ServletException {
		request.setCharacterEncoding(ENCODING);
        response.setCharacterEncoding(ENCODING);    
        HttpServletRequest httpRequest = ((HttpServletRequest) request);
		HttpServletResponse res = (HttpServletResponse) response;
        // SUPPORT CORS
        res.addHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.addHeader("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE");
        res.addHeader("Access-Control-Max-Age", "36000");
        res.setHeader("Access-Control-Allow-Headers", 
        		"Access-Control-Allow-Headers,Authorization,Access-Control-Allow-Origin,Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        if ( httpRequest.getMethod().equals("OPTIONS") ) {
        	res.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        try (CurrentContextService context = CurrentContextService.create(httpRequest)) {
            chain.doFilter(httpRequest, response);
        }
	}

	public void init(FilterConfig fConfig) throws ServletException {
	}
	
	public void destroy() {
	}
}
