package com.ide.codefusion.service.workspace;

import com.ide.codefusion.dao.workspace.WorkspaceDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

import java.io.IOException;
import java.io.PrintWriter;
import  java.io.Serial;

@WebServlet(name = "UpdateWorkspace", value = "/updatews")
public class UpdateWorkspace extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String userEmail = req.getParameter("email");
        String workspaceName = req.getParameter("workspaceName");
        String newWsName = req.getParameter("newWsName");

        boolean result = WorkspaceDAO.updateWorkspace(userEmail, workspaceName, newWsName);
        JSONObject jsonResponse = new JSONObject();
        if (result) {
            resp.setStatus(200);
            jsonResponse.put("status", "success");
            jsonResponse.put("message", "Workspace Updated Successfully");
        } else {
            resp.setStatus(400);
            jsonResponse.put("status", "error");
            jsonResponse.put("message", "workspace Update Failed");
        }

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();
        out.print(jsonResponse);
    }
}
