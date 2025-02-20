//package com.ide.codefusion.service;
//
//import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
//import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
//import com.google.api.client.http.javanet.NetHttpTransport;
//import com.google.api.client.json.gson.GsonFactory;
//import com.ide.codefusion.dao.UserDAO;
//import com.ide.codefusion.model.User;
//import com.ide.codefusion.utils.JwtUtil;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.annotation.WebServlet;
//import jakarta.servlet.http.HttpServlet;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//
//import java.io.IOException;
//import java.util.Collections;
//
//@WebServlet("/oauth/google")
//public class GoogleAuthServlet extends HttpServlet {
//
//    private static final String CLIENT_ID = "872496089913-tfpd35a3gk8mnac86t3ea46n0pcpk7ah.apps.googleusercontent.com";
//
//
//    private JwtUtil jwtUtil = new JwtUtil();
//    private UserDAO userDAO = new UserDAO(); // Create this class for user data operations
//
//    @Override
//    protected void doPost(HttpServletRequest request, HttpServletResponse response)
//            throws ServletException, IOException {
//
//        String idTokenString = request.getParameter("id_token");
//
//        System.out.println(idTokenString);
//
//        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
//                new NetHttpTransport(), new GsonFactory())
//                .setAudience(Collections.singletonList(CLIENT_ID))
//                .build();
//
//        try {
//            GoogleIdToken idToken = verifier.verify(idTokenString);
//            if (idToken != null) {
//                GoogleIdToken.Payload payload = idToken.getPayload();
//
//                String email = payload.getEmail();
//                // Get user's Google ID, name, profile picture etc.
//                String userId = payload.getSubject();
//
//                // Create or fetch user
//                User user = userDAO.findByEmail(email);
//                if (user == null) {
//                    user = new User();
//                    user.setEmail(email);
//                    user.setUserName((String) payload.get("name"));
//                    user.setAuthProvider("GOOGLE");
//                    user.setAuthProviderId(userId);
//                    userDAO.save(user);
//                }
//
//                // Generate JWT token
//                String token = jwtUtil.generateToken(email);
//
//                // Send response with JWT
//                response.setContentType("application/json");
//                response.getWriter().write("{\"token\":\"" + token + "\"}");
//            } else {
//                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//                response.getWriter().write("Invalid ID token");
//            }
//        } catch (Exception e) {
//            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
//            response.getWriter().write("Error processing Google authentication");
//        }
//    }
//}