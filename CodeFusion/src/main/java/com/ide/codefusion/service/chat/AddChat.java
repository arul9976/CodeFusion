package com.ide.codefusion.service.chat;

import com.ide.codefusion.dao.chat.ChatDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

import java.io.IOException;


@WebServlet(name = "AddChat", value = "/addchat")
public class AddChat extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static ChatDAO chatDAO = new ChatDAO();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = req.getReader().readLine()) != null) {
            sb.append(line);
        }
        JSONObject jsonObject = new JSONObject(sb.toString());

        System.out.println(jsonObject.toString());

        JSONObject response = new JSONObject();
        resp.setContentType("application/json");
        String oEmail = jsonObject.getString("ownerEmail");
        String wsName = jsonObject.getString("wsName");
        JSONObject message = jsonObject.getJSONObject("message");

        if (chatDAO.addChat(oEmail, wsName, message)) {
            resp.setStatus(HttpServletResponse.SC_OK);
            response.put("status", true);
            response.put("message", "Chat added successfully");

        }else {
            response.put("status", false);
            response.put("message", "Error Getting Messages");
        }

        resp.getWriter().write(response.toString());

    }
}
