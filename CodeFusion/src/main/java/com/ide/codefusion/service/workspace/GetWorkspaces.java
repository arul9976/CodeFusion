package com.ide.codefusion.service.workspace;

import com.ide.codefusion.dao.workspace.WorkspaceDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;

@WebServlet(name = "GetWorkspaces", value = "/getwslist")
public class GetWorkspaces extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");

        String userEmail = req.getParameter("email");
        System.out.println("--> " + userEmail);
        JSONArray jsonArrayRes = WorkspaceDAO.getWorkspaces(userEmail);
        JSONObject jsonObject = new JSONObject();
        if (jsonArrayRes != null) {
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write(jsonArrayRes.toString());
            return;
        }
        jsonObject.put("Code", 406);
        jsonObject.put("message", "Workspaces not found");
        resp.setStatus(406);
        resp.getWriter().write(jsonObject.toString());

    }


}
