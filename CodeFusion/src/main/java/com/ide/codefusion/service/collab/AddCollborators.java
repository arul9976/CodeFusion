package com.ide.codefusion.service.collab;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ide.codefusion.dao.collab.CollabDAO;
import com.ide.codefusion.model.Collaborator;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;

@WebServlet(name = "AddCollaborators", value = "/addcollab")
public class AddCollborators extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        resp.setContentType("application/json");
        resp.setStatus(404);
        System.out.println("edjedbjebd");

        StringBuilder sb = new StringBuilder();
        BufferedReader reader = req.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);

        }
        JSONObject jsonObject = new JSONObject(sb.toString());
        System.out.println("---> " + jsonObject.toString());
        try {
            System.out.println(jsonObject.toString());
            Collaborator collaborator = new Collaborator();
            collaborator.setEmail(jsonObject.getString("email"));
            collaborator.setAccepted(jsonObject.getBoolean("accepted"));
            collaborator.setCollabEmail(jsonObject.getString("collabEmail"));
            collaborator.setWsName(jsonObject.getString("wsName"));

            System.out.println(collaborator.getWsName() + collaborator.getEmail() + collaborator.getCollabEmail());
            if (CollabDAO.addCollaborators(collaborator)) {
                resp.setStatus(200);
                jsonObject.put("status", "success");
                jsonObject.put("message", "Collaborator added successfully");
                resp.getWriter().write(jsonObject.toString());
                return;
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        jsonObject.put("status", "failed");
        jsonObject.put("message", "Collaborator added failed");
        resp.getWriter().write(jsonObject.toString());

    }
}
