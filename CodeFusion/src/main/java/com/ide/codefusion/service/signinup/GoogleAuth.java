package com.ide.codefusion.service.signinup;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.ide.codefusion.dao.UserDAO;
import com.ide.codefusion.model.GoogleLogin;
import com.ide.codefusion.model.User;
import com.ide.codefusion.utils.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

import java.io.IOException;
import java.util.Collections;

@WebServlet(name = "googleauth", value = "/oauth/google")
public class GoogleAuth extends HttpServlet {

    private static final String CLIENT_ID = "872496089913-tfpd35a3gk8mnac86t3ea46n0pcpk7ah.apps.googleusercontent.com";
    private final JwtUtil jwtUtil = new JwtUtil();
    private final UserDAO userDAO = new UserDAO(); // Create this class for user data operations

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        GoogleLogin googleLogin = objectMapper.readValue(request.getReader(), GoogleLogin.class);

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(CLIENT_ID))
                .build();

        try {
            GoogleIdToken idToken = verifier.verify(googleLogin.getToken());
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                String email = payload.getEmail();
                String picture = (String) payload.get("picture");
                System.out.println("Picture : " + picture);
//                String profilePic = payload.get
                // Get user's Google ID, name, profile picture etc.
                String userId = payload.getSubject();

                // Create or fetch user
                User user = userDAO.findByEmail(email);
                if (user == null) {
                    user = new User();
                    user.setEmail(email);
                    user.setUserName((String) payload.get("name"));
                    user.setProfilePic(picture);
                    user.setPassword("GOOGLE");
                    user.setAuthProvider("GOOGLE");
                    user.setAuthProviderId(userId);
                    if (!userDAO.save(user)) {
                        response.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
                        return;
                    }
                }
                response.setContentType("application/json");
                String token = jwtUtil.generateToken(email);
                String nkName = user.getUserName().split(" ")[0];
                JSONObject jsonResponse = new JSONObject();
                jsonResponse.put("token", token);
                jsonResponse.put("email", user.getEmail());
                jsonResponse.put("username", user.getEmail().split("@")[0]);
                jsonResponse.put("profilePic", user.getProfilePic());
                jsonResponse.put("name", (nkName.charAt(0) + "").toUpperCase() + nkName.substring(1));

                response.getWriter().write(jsonResponse.toString());
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid ID token");
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error processing Google authentication");
        }
    }
}
