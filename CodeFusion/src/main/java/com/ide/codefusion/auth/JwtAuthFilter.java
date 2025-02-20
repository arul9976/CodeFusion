package com.ide.codefusion.auth;

import com.ide.codefusion.utils.JwtUtil;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebFilter("/*")
public class JwtAuthFilter implements Filter {

    private final JwtUtil jwtUtil = new JwtUtil();

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Initialization if needed
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        if (isPublicUrl(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }

        final String requestTokenHeader = request.getHeader("Authorization");

        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            String jwtToken = requestTokenHeader.substring(7);
            System.out.println("Token " + jwtToken);
            try {
                String username = jwtUtil.getUsernameFromToken(jwtToken);
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

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("Authentication required");

    }

    private boolean isPublicUrl(String url) {
        return url.endsWith("/signup") || url.endsWith("/login") || url.contains("/oauth/google")
                || url.contains("/reset-password") || url.contains("/public");
    }

    @Override
    public void destroy() {
        // Cleanup if needed
    }
}