package codeFusionClasses;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class Test
 */
//@WebServlet("/Test")
public class Test extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Test() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServleHttpServletRequest request1=(HttpServletRequest)request;
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
tRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
//		String email=
		JavaSendEmail.sendMail("allinroshya@gmail.com", "1540");
		response.getWriter().write("Send.....");
	}

}
