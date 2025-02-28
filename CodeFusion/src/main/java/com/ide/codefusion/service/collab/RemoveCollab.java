package com.ide.codefusion.service.collab;


import com.ide.codefusion.dao.collab.CollabDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

import java.io.IOException;

@WebServlet(name = "RemoveCollab", value = "/removecb")
public class RemoveCollab extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String wsName = req.getParameter("wsName");
        String email = req.getParameter("email");
        String collabEmail = req.getParameter("collabEmail");
        JSONObject response = new JSONObject();

        System.out.println("Removing Collab " + wsName + " from " + email + " from " + collabEmail);
        if (CollabDAO.removeCollab(email, wsName, collabEmail)) {
            response.put("status", "success");
            response.put("message", "Collab has been removed");

        } else {
            response.put("status", "error");
            response.put("message", "Collaborator removal failed");
        }
        resp.setContentType("application/json");
        resp.getWriter().write(response.toString());
    }
}
