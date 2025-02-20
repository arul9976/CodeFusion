package com.ide.codefusion.service;

import com.ide.codefusion.dao.UserDAO;
import com.ide.codefusion.utils.SendOTP;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

import java.io.IOException;
import java.util.Random;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

@WebServlet(name = "emailotp", value = "/otp")
public class EmailOTP extends HttpServlet {

    UserDAO userDAO = new UserDAO();
    private String host;
    private String port;
    private String user;
    private String pass;

    @Override
    public void init() throws ServletException {
        ServletContext context = getServletContext();
        host = context.getInitParameter("host");
        port = context.getInitParameter("port");
        user = context.getInitParameter("user");
        pass = context.getInitParameter("pass");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String email = req.getAttribute("username").toString();
        String otp = generateOTP();
        JSONObject jsonResponse = new JSONObject();
        try {
            SendOTP sendOTP = new SendOTP(host, port, user, pass);
            System.out.println("Email " + email);
            Future<Boolean> result = sendOTP.sendOtpEmailAsync(email, otp);
            Boolean sent = result.get(30, TimeUnit.SECONDS);

            if (sent) {
                jsonResponse.put("message", "OTP SENT SUCCESSFULLY");

            } else {
                jsonResponse.put("message", "Failed to send OTP email. Please try again.");
                resp.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);

            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
            jsonResponse.put("message", "OTP SENT FAILED WITH EXCEPTION");
        }
        resp.getWriter().write(jsonResponse.toString());


    }


    private String generateOTP() {
        Random rand = new Random();
        int otp = rand.nextInt(999999);
        return String.format("%06d", otp); // Ensure OTP is always 6 digits
    }
}
