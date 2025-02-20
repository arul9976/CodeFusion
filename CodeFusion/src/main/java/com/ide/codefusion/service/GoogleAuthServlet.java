package com.ide.codefusion.service;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.UUID;

@WebServlet("/oauth/google/auth")
public class GoogleAuthServlet extends HttpServlet {

    private static final String CLIENT_ID = "your-google-client-id";
    private static final String REDIRECT_URI = "http://your-domain.com/oauth/google";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Generate state parameter to prevent CSRF
        String state = UUID.randomUUID().toString();
        request.getSession().setAttribute("google_oauth_state", state);

        // Build Google OAuth URL
        String authUrl = "https://accounts.google.com/o/oauth2/v2/auth" +
                "?client_id=" + CLIENT_ID +
                "&redirect_uri=" + REDIRECT_URI +
                "&response_type=code" +
                "&scope=email%20profile" +
                "&state=" + state;

        response.sendRedirect(authUrl);
    }
}