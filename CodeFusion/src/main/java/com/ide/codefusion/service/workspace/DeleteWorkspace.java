package com.ide.codefusion.service.workspace;


import com.ide.codefusion.dao.workspace.WorkspaceDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

import java.io.IOException;

@WebServlet(name = "DeleteWorkspace", value = "/deleteWs")
public class DeleteWorkspace extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        String wsName = req.getParameter("wsName");
        String email = req.getParameter("email");
        boolean result = WorkspaceDAO.deleteWorkspace(wsName, email);
        JSONObject jsonResponse = new JSONObject();
        System.out.println("Workspace " + wsName + " Email " + email);
        if (result) {
            resp.setStatus(200);
            jsonResponse.put("status", "success");
            jsonResponse.put("message", "Workspace deleted successfully");
        } else {
            resp.setStatus(406);
            jsonResponse.put("status", "error");
            jsonResponse.put("message", "Workspace deletion failed");
        }
        resp.getWriter().write(jsonResponse.toString());
    }
}
