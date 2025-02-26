package com.ide.codefusion.service.collab;

import com.ide.codefusion.dao.collab.CollabDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONArray;

import java.io.IOException;

@WebServlet(name = "GetCollaborators", value = "/getCollabs")
public class GetCollaborators extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String wsName = req.getParameter("wsName");
        String email = req.getParameter("email");
        System.out.println(wsName + " " + email);
        JSONArray collaborators = CollabDAO.getCollaborators(wsName, email);
        System.out.println(collaborators.toString());
        resp.getWriter().write(collaborators.toString());
    }
}
