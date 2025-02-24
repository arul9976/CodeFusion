package com.ide.codefusion.service.workspace;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ide.codefusion.dao.workspace.WorkspaceDAO;
import com.ide.codefusion.model.Workspace;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

import java.io.IOException;

@WebServlet(name = "createworkspace", value = "/createworkspace")
public class CreateWorkspace extends HttpServlet {


    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        resp.setContentType("application/json");
        JSONObject resJson = new JSONObject();
        ObjectMapper mapper = new ObjectMapper();
        Workspace workspace = mapper.readValue(req.getReader(), Workspace.class);

        if (workspace != null && WorkspaceDAO.createWorkspace(workspace)) {
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resJson.put("message", "Workspace created");

        }else {
            resp.setStatus(404);
            resJson.put("message", "Workspace Details not Valid");
        }
        resp.getWriter().write(resJson.toString());
    }
}
