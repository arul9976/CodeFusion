package com.ide.codefusion.service.workspace;

import com.ide.codefusion.dao.workspace.WorkspaceDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet(name = "CheckWorkspaceExists", value = "/checkws")
public class CheckWorkspaceExists extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String wsName = req.getParameter("wsName");
        String email = req.getParameter("email");

        if (WorkspaceDAO.isWorkspaceExist(wsName, email)) {
            resp.getWriter().write("{\"error\":\"Workspace already exists\"}");
            return;
        } else {
        }
        resp.getWriter().write("{\"error\":\"Workspace does not exist\"}");

    }
}
