package com.ide.codefusion.service.chat;

import com.ide.codefusion.dao.chat.ChatDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

import java.io.IOException;

@WebServlet(name = "GetChats", value = "/getchats")
public class GetChats extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private ChatDAO chatDAO = new ChatDAO();


    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String oEmail = req.getParameter("oEmail");
        String wsName = req.getParameter("wsName");
        int beforeId =  Integer.parseInt(req.getParameter("beforeId"));

        resp.setContentType("application/json");

        JSONObject response = new JSONObject();
        System.out.println(oEmail + " " + wsName + " " + beforeId);
        JSONObject chats = chatDAO.getChats(oEmail, wsName, beforeId);
        if (chats != null) {
            resp.setStatus(HttpServletResponse.SC_OK);
            response.put("chats", chats);
            response.put("status", true);

        } else {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.put("status", false);
        }

        resp.getWriter().write(response.toString());

    }
}
