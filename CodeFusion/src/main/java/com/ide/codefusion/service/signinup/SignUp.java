package com.ide.codefusion.service.signinup;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.ide.codefusion.dao.UserDAO;
import com.ide.codefusion.model.LoginUser;
import com.ide.codefusion.model.User;
import com.ide.codefusion.utils.JwtUtil;
import com.ide.codefusion.utils.PasswordEncryption;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

import java.io.IOException;
import java.io.Serial;

/**
 * Servlet implementation class SignUpServlet
 */

@WebServlet(name = "signup", value = "/signup")
public class SignUp extends HttpServlet {

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
        System.out.println(loginUser);
        // Check if user already exists
        if (userDAO.findByEmail(loginUser.getEmail()) != null) {
            response.setStatus(HttpServletResponse.SC_CONFLICT);
            response.getWriter().write("{\"error\":\"Email already registered\"}");
            return;
        }
//        System.out.println(name + " " + password + " " + email);
        // Create new user
        loginUser.setPassword(PasswordEncryption.hashpassword(loginUser.getPassword()));
        User user = new User(loginUser.getEmail(), loginUser.getUsername(), loginUser.getPassword());
        user.setAuthProvider("LOCAL");

        response.setContentType("application/json");

        if (!userDAO.save(user)) {
            response.setStatus(HttpServletResponse.SC_CONFLICT);
            response.getWriter().write("{\"error\":\"Login failed\"}");
            return;
        }
//        // Generate JWT token
        response.setStatus(201);
        String token = jwtUtil.generateToken(user.getEmail());

        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("token", token);
        jsonResponse.put("email", user.getEmail());
        jsonResponse.put("username", user.getEmail().split("@")[0]);
        jsonResponse.put("name", user.getUserName());
        jsonResponse.put("profilePic", user.getProfilePic());
        System.out.println(jsonResponse.toString());
        response.getWriter().write(jsonResponse.toString());
    }
}
