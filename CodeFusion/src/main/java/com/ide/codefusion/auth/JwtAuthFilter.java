package com.ide.codefusion.auth;

import com.ide.codefusion.utils.JwtUtil;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

import java.io.IOException;

//@WebFilter("/*")
public class JwtAuthFilter implements Filter {

    private final JwtUtil jwtUtil = new JwtUtil();

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Initialization if needed
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {

        System.out.println("JwtAuthFilter");
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

//        System.out.println("Type " + request.getHeader("Access-Control-Request-Method"));
//        System.out.println("Auth " + request.getHeader("Authorization"));
        System.out.println("End Point --> " + request.getRequestURI());

        if (isPublicUrl(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }

        final String requestTokenHeader = request.getHeader("Authorization");

        System.out.println("Token " + requestTokenHeader);
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            String jwtToken = requestTokenHeader.substring(7);
            System.out.println("Token " + jwtToken);
            try {
                JSONObject userObj = jwtUtil.getUsernameFromToken(jwtToken);
                String username = userObj.getString("username");

                System.out.println("Username " + username);
                if (username != null) {
                    request.setAttribute("username", username);
                    filterChain.doFilter(request, response);
                    return;
                }
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
                System.out.println(e.getMessage());
                response.getWriter().write("Invalid or expired token");
                return;
            }
        }

        response.setStatus(401);
        response.getWriter().write("Authentication required");

    }

    private boolean isPublicUrl(String url) {
        return url.endsWith("/") || url.endsWith("/signup") || url.endsWith("/login") || url.contains("/oauth/google") || url.contains("/oauth/zoho")
                || url.contains("/reset-password") || url.contains("/public") || url.endsWith("/jwtLogin");
    }

    @Override
    public void destroy() {
        // Cleanup if needed
    }
}