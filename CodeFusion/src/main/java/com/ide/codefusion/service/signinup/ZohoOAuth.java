package com.ide.codefusion.service.signinup;

import com.ide.codefusion.dao.UserDAO;
import com.ide.codefusion.model.User;
import com.ide.codefusion.utils.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;


@WebServlet(name = "zohoauth", value = "/oauth/zoho")
public class ZohoOAuth extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private static final String CLIENT_ID = "1000.YZIO79J63RMUBZCFWYHKHNB3VGE53E";
    private static final String CLIENT_SECRET = "1de94f1fb64526c25f3cfb266c8f0d55663c86d129";
    private static final String REDIRECT_URI = "http://localhost:3001/codefusion/zohoredirect";
    private static final String TOKEN_URL = "https://accounts.zoho.com/oauth/v2/token";

    private final JwtUtil jwtUtil = new JwtUtil();
    private final UserDAO userDAO = new UserDAO(); // C

    private static String getAccessToken(String authorizationCode) throws IOException {
        String postData = "client_id=" + CLIENT_ID +
                "&client_secret=" + CLIENT_SECRET +
                "&grant_type=authorization_code" +
                "&redirect_uri=" + REDIRECT_URI +
                "&code=" + authorizationCode;

        URL url = new URL(TOKEN_URL);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setDoOutput(true);
        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

        try (OutputStream os = connection.getOutputStream()) {
            byte[] input = postData.getBytes("utf-8");
            os.write(input, 0, input.length);
        }

        int responseCode = connection.getResponseCode();
        System.out.println("Response Code: " + responseCode);
        if (responseCode == HttpURLConnection.HTTP_OK) { // success
            try (BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    response.append(line);
                }
                System.out.println("Response: " + response.toString());
                String responseString = response.toString();
                String key = "id_token";
                System.out.println(responseString.indexOf(key));
                int startIndex = responseString.indexOf(key) + key.length() + 3;
                int endIndex = responseString.indexOf(",", startIndex) - 1;
                if (endIndex == -1) {
                    endIndex = responseString.indexOf("}", startIndex);
                }
                System.out.println(startIndex + "    " + endIndex);
                String jwt = responseString.substring(startIndex, endIndex).trim();
                String payload = jwt.split("\\.")[1];
                String decodedPayload = base64UrlDecode(payload);
                System.out.println("Decoded payload: " + decodedPayload);
                return extract_email(decodedPayload);
            }
        } else {
            System.out.println("Error: " + responseCode);
        }
        return null;
    }

    private static String base64UrlDecode(String base64Url) {
        // Replace URL-specific characters with standard Base64 characters
        String base64 = base64Url.replace('-', '+').replace('_', '/');

        // Add padding if necessary (Base64 requires padding)
        int paddingLength = 4 - (base64.length() % 4);
        if (paddingLength < 4) {
            base64 = base64 + "=".repeat(paddingLength);
        }

        // Decode the Base64 string
        byte[] decodedBytes = Base64.getDecoder().decode(base64);

        // Convert decoded bytes to a string (assuming UTF-8 encoding)
        return new String(decodedBytes, StandardCharsets.UTF_8);
    }

    public static String extract_email(String decoded) {
        String key = "\"email\"";
        int startIndex = decoded.indexOf(key) + key.length() + 2;
        String jwt = decoded.substring(startIndex, decoded.length() - 2).trim();
        System.out.println(jwt);
        return jwt;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
//        System.out.println("Response on Zoho Redirect: " + resp.toString());
        String code = req.getParameter("code");
        System.out.println("Response Code: " + code);
        String email = getAccessToken(code);
        System.out.println("Returning out: " + email);

        User user = userDAO.findByEmail(email);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setUserName(email.split("@")[0]);
            user.setPassword("ZOHO");
            user.setAuthProvider("ZOHO");
            user.setNickname((user.getUserName().charAt(0) + "").toUpperCase() + user.getUserName().substring(1));
//            user.setAuthProviderId(userId);
            if (!userDAO.save(user)) {
                resp.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
                return;
            }
        }
        resp.setContentType("application/json");
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", user.getEmail());
        claims.put("username", user.getUserName());
        claims.put("name", user.getNickname());
        claims.put("ProfilePic", user.getProfilePic());
        String token = jwtUtil.generateToken(email, claims);


        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("token", token);
        jsonResponse.put("email", user.getEmail());
        jsonResponse.put("username", user.getUserName());
        jsonResponse.put("profilePic", user.getProfilePic());
        jsonResponse.put("name", user.getNickname());

        resp.getWriter().write(jsonResponse.toString());
    }
}
