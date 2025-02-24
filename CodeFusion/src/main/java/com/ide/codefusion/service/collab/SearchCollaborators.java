package com.ide.codefusion.service.collab;


import com.ide.codefusion.dao.collab.CollabDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONArray;

import java.io.IOException;

@WebServlet(name = "SearchCollaborators", value = "/collabsearch")
public class SearchCollaborators extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        String userid = req.getParameter("username");
        System.out.println(userid);
        try{
         JSONArray collaborators= CollabDAO.searchCollaborators(userid);
         if(collaborators != null) {
             resp.getWriter().write(collaborators.toString());
         }
         else{
             resp.getWriter().write("[]");
         }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
