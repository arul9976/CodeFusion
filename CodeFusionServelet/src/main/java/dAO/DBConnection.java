package dAO;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
	 static Connection connection = null;

	    private DBConnection() {
	    }

	    public static Connection getConnection() {
	        if (connection == null) {
	            try {

	                Class.forName("com.mysql.cj.jdbc.Driver");
	                connection = DriverManager.getConnection(
	                    "jdbc:mysql://localhost:3306/usersDB",
	                    "root", "Mek@la297"
	                );

	                System.out.println("Database connected successfully!");

	            } catch (ClassNotFoundException e) {
	                System.out.println("MySQL JDBC Driver not found.");
	                e.printStackTrace();
	            } catch (SQLException e) {
	                System.out.println("Database connection failed.");
	                e.printStackTrace();
	            }
	        }
	        return connection;
	    }
	    }
