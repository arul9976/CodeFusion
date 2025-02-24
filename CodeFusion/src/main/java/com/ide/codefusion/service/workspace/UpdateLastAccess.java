package com.ide.codefusion.service.workspace;

import com.ide.codefusion.dao.workspace.WorkspaceDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet(name = "UpdateLastAccess", value = "/updatelastaccess")
public class UpdateLastAccess extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String wsName = req.getParameter("wsName");
      boolean isUpdated=  WorkspaceDAO.updateLastAccess(wsName);
        if(isUpdated){
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write("{\"status\":\"ok\"}");
            return;
        }
        resp.setStatus(406);
    }
}
