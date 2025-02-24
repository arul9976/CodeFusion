package com.ide.codefusion.service.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ide.codefusion.dao.UserDAO;
import com.ide.codefusion.model.UpdateUser;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.Serial;

@WebServlet(name = "updateuserdetails", value = "/update")
public class UpdateUserDetails extends HttpServlet {

    @Serial
    private static final long serialVersionUID = 1L;

    private final UserDAO userDAO = new UserDAO();


    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        ObjectMapper objectMapper = new ObjectMapper();

        UpdateUser updateData = objectMapper.readValue(req.getReader(), UpdateUser.class);

        if (!updateData.getEmail().isEmpty()) {
            if (userDAO.update(updateData)) {
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.getWriter().write("{\"success\":true,\"message\":\"updated successfully\"}");
                return;
            }
        }
        resp.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
        resp.getWriter().write("{\"success\":false,\"message\":\"update failed\"}");
    }
}
