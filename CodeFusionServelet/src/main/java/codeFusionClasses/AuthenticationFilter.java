package codeFusionClasses;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import dAO.SignUpDAO;

/**
 * Servlet Filter implementation class AuthenticationFilter
 */
@WebFilter("/AuthenticationFilter")
public class AuthenticationFilter implements Filter {

    /**
     * Default constructor.
     */
    public AuthenticationFilter() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see Filter#destroy()
	 */
	@Override
	public void destroy() {
		// TODO Auto-generated method stub
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		 HttpServletRequest request1=(HttpServletRequest)request;
		  Cookie[] cookies=request1.getCookies();
		  int userID=0;
		  String sessionID="";
		  for (Cookie element : cookies) {
		   if(element.getName().equals("userID")){
		    userID=Integer.parseInt(element.getValue());

		   }
		   else if(element.getName().equals("SessionID"))
		   {
		   sessionID=element.getValue();
		   }

		  }

		  if(SignUpDAO.checkSession(userID, sessionID)) {

		   chain.doFilter(request1, response);

		  }
	}	/**
	 * @see Filter#init(FilterConfig)
	 */
	@Override
	public void init(FilterConfig fConfig) throws ServletException {
		// TODO Auto-generated method stub
	}

}
