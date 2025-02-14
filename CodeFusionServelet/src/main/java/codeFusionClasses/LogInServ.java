package codeFusionClasses;

import java.io.BufferedReader;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import dAO.LogInDAO;
import dAO.SignUpDAO;

/**
 * Servlet implementation class LogInServ
 */
//@WebServlet("/LogInServ")
public class LogInServ extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public LogInServ() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		BufferedReader reader = request.getReader();
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }

        try {
            JSONObject jsonData = new JSONObject(sb.toString());
            String email = jsonData.getString("email");
            String password = jsonData.getString("password");

            String encodedPassword = PasswordEncryption.encodePassword(password);
            User user = LogInDAO.userCheck(email, encodedPassword);

            response.setContentType("application/json");
            if (user != null) {
                String sessionId = String.valueOf(System.currentTimeMillis());

                Cookie userCookie = new Cookie("userID", String.valueOf(user.getUserId()));
                Cookie sessionCookie = new Cookie("SessionID", sessionId);

                userCookie.setPath("/");
                sessionCookie.setPath("/");


                response.addCookie(userCookie);
                response.addCookie(sessionCookie);

                SignUpDAO.addSession(user.getUserId(), sessionId);
                JSONObject responseObject = new JSONObject();
                responseObject.put("message", "Login successful!");
                responseObject.put("userId", user.getUserId());
                responseObject.put("sessionId", sessionId);
                response.getWriter().write(responseObject.toString());
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\": \"Invalid credentials\"}");
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Invalid request\"}");
        }
	}

}
