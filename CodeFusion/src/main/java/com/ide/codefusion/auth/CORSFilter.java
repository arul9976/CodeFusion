package com.ide.codefusion.auth;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

//@WebFilter("/*")
public class CORSFilter implements Filter {


    public CORSFilter() {
        // TODO Auto-generated constructor stub
    }


    @Override
    public void destroy() {
        // TODO Auto-generated method stub
    }


    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;

//        System.out.println("CORSFilter Token " + req.getHeader("Authorization"));

        resp.setHeader("Access-Control-Allow-Origin", "http://172.17.22.225:3001");
//        resp.setHeader("Access-Control-Allow-Origin", "http://172.17.22.225:3001");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        resp.setHeader("Access-Control-Max-Age", "3600");
        resp.setHeader("Access-Control-Allow-Credentials", "true");

        // Log headers for debugging
//        System.out.println("Request Headers:");
//        java.util.Enumeration<String> headerNames = req.getHeaderNames();
//        while (headerNames.hasMoreElements()) {
//            String headerName = headerNames.nextElement();
//            String headerValue = req.getHeader(headerName);
//            System.out.println(headerName + ": " + headerValue);
//        }

        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            resp.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        chain.doFilter(request, response);

    }

    /**
     * @see Filter#init(FilterConfig)
     */
    @Override
    public void init(FilterConfig fConfig) throws ServletException {
        // TODO Auto-generated method stub
        System.out.println("CORSFilter init");
    }

}