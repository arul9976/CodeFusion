package com.ide.codefusion.dao;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import java.sql.*;

public class DataBaseUtil {
    private static HikariDataSource dataSource;

    static {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://localhost:3306/CodeFusion");
        config.setUsername("root");
        config.setPassword("newpassword");
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");

        // Optional: Connection pool size settings
        config.setMaximumPoolSize(10);
        config.setConnectionTimeout(30000);  // 30 seconds

        dataSource = new HikariDataSource(config);
    }

    public static Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
}
