package com.ide.codefusion.service.signinup;

import com.ide.codefusion.utils.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

import java.io.IOException;

@WebServlet(name = "JWTLogin", value = "/jwtLogin")
public class JWTLogin extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final JwtUtil jwtUtil = new JwtUtil();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        System.out.println("doPost jwtLogin");
        StringBuilder sb = new StringBuilder();
        String line;

        while ((line = req.getReader().readLine()) != null) {
            sb.append(line);
        }
        JSONObject jsonObject = new JSONObject(sb.toString());
        String token = jsonObject.getString("token");

        System.out.println("JWTLogin " + token);
        resp.setContentType("application/json");
        JSONObject userObj = new JSONObject();
        try {
            userObj = jwtUtil.getUsernameFromToken(token);
            System.out.println("User Details " + userObj.toString());
            if (userObj != null) {
                resp.setStatus(200);
                resp.getWriter().write(userObj.toString());
            }

        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
            userObj.put("status", 406);
            userObj.put("error", e.getMessage());
            resp.getWriter().write(userObj.toString());
        }
    }
}
