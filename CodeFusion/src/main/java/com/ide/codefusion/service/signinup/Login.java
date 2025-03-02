package com.ide.codefusion.service.signinup;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.ide.codefusion.dao.UserDAO;
import com.ide.codefusion.model.LoginUser;
import com.ide.codefusion.model.User;
import com.ide.codefusion.utils.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

import java.io.IOException;
import java.io.Serial;
import java.util.HashMap;
import java.util.Map;

/**
 * Servlet implementation class SignUpServlet
 */

@WebServlet(name = "login", value = "/login")
public class Login extends HttpServlet {

    @Serial
    private static final long serialVersionUID = 1L;

    private final UserDAO userDAO = new UserDAO();
    private final JwtUtil jwtUtil = new JwtUtil();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Show signup page
        response.getWriter().write("SignUp");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        ObjectMapper objectMapper = new ObjectMapper();

        LoginUser loginUser = objectMapper.readValue(request.getReader(), LoginUser.class);

        User user = userDAO.findByEmail((!loginUser.getEmail().isEmpty()) ? loginUser.getEmail() : loginUser.getUsername());

        if (user != null) {
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_OK);
            String token = null;
            try {

                Map<String, Object> claims = new HashMap<>();
                claims.put("email", user.getEmail());
                claims.put("username", user.getUserName());
                claims.put("name", user.getNickname());
                claims.put("ProfilePic", user.getProfilePic());
                token = jwtUtil.generateToken(user.getEmail(), claims);

            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
                System.out.println(e.getMessage());
                return;
            }


            JSONObject jsonResponse = new JSONObject();
            jsonResponse.put("profilePic", user.getProfilePic());
            jsonResponse.put("token", token);
            jsonResponse.put("email", user.getEmail());
            jsonResponse.put("username", user.getUserName());
            jsonResponse.put("name", user.getNickname());

            System.out.println("OBJ --> " + jsonResponse.toString());
            response.setHeader("Authorization", "Bearer " + token);

            response.getWriter().write(jsonResponse.toString());
            return;
        }
        response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
        response.getWriter().write("Email or Password Incorrect");
    }
}
