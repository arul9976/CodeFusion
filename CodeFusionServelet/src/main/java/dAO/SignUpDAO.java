package dAO;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import codeFusionClasses.PasswordEncryption;
import codeFusionClasses.User;


public class SignUpDAO {
	public static boolean userInsertion(User user) {

		ArrayList<User> userArray = new ArrayList();

		try {
			PreparedStatement userStmt = DBConnection.getConnection().prepareStatement("insert into users (name,email,password) values (?,?,?)",java.sql.Statement.RETURN_GENERATED_KEYS);
			userStmt.setString(1, user.getUserName());
			userStmt.setString(2, user.getEmail());

		    String encodePassword =PasswordEncryption.encodePassword(user.getPassword());
		    userStmt.setString(3, encodePassword);

		    int rowAffected = userStmt.executeUpdate();
		    int id = 0;
		     if(rowAffected > 0) {
		    	 ResultSet generateKeys = userStmt.getGeneratedKeys();
     		    if (generateKeys.next()) {
     		        id = generateKeys.getInt(1);
		     }
     		 User userObject = new User(id,user.getUserName(),user.getEmail(),user.getPassword());
       		 userArray.add(userObject);
     		 return true;
		     }

		} catch (SQLException e) {
			  System.err.println("Database Insert Error: " + e.getMessage());
	            return false;
		}

		return false;

	}

	public static boolean addSession(int userID, String sessionID) {
		  try {
		  PreparedStatement statement=DBConnection.getConnection().prepareStatement("insert into Session(sessionId, userId) values(?,?)");

		  statement.setString(1, sessionID);
		  statement.setInt(2, userID);
		  int affected=statement.executeUpdate();
		  if(affected>0) {
		   return true;
		  }
		  }
		  catch(Exception e) {
		   System.out.println(e.getMessage());
		  }
		  return false;
		 }


	 public static boolean checkSession(int userID, String SessionID) {
	  try {
	  PreparedStatement statement=DBConnection.getConnection().prepareStatement("select * from Session where sessionId=? and userId=?");
	   statement.setString(1, SessionID);
	   statement.setInt(2, userID);
	 ResultSet rs=statement.executeQuery();
	 if(rs.next()) {
	  return true;
	 }
	  }
	  catch(Exception e) {
	   System.out.println(e.getMessage());
	  }
	  return false;
	 }
}
