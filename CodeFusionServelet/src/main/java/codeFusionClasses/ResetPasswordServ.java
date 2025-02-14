package codeFusionClasses;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import dAO.ResetDAO;

/**
 * Servlet implementation class ResetPasswordServ
 */
//@WebServlet("/ResetPasswordServ")
public class ResetPasswordServ extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public ResetPasswordServ() {
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
		response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try {
            // Read JSON request body
            BufferedReader reader = request.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            JSONObject json = new JSONObject(sb.toString());
            String email = json.getString("email");
            String otp = json.getString("otp");
            String newPassword = json.getString("password");

            // Validate OTP
            if (ResetDAO.validateOTP(email, otp)) {
                // Reset password
                boolean result = ResetDAO.resetPassword(email, newPassword);

                if (result) {
                    out.print("{ \"message\": \"Password reset successful!\" }");
                } else {
                    out.print("{ \"error\": \"Password reset failed!\" }");
                }
            } else {
                out.print("{ \"error\": \"Invalid or expired OTP!\" }");
            }
        } catch (Exception e) {
            e.printStackTrace();
            out.print("{ \"error\": \"Server Error\" }");
        }
       }
}
