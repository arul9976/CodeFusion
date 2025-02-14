package dAO;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import codeFusionClasses.User;

public class LogInDAO {
	public static User userCheck(String email,String password) {
		 try {
			PreparedStatement checkUserStmt = DBConnection.getConnection().prepareStatement("select * from users where email = ? and password = ?");
			checkUserStmt.setString(1, email);
			checkUserStmt.setString(2, password);
			ResultSet resultUser = checkUserStmt.executeQuery();
			String userName = "";
			int userId = 0;
			User user = null;
			if(resultUser.next()) {
                userName = resultUser.getString("name");
                userId = resultUser.getInt("id");
                user = new User(userId,email,userName,password);
			}
			if(user != null) {
				return user;
			}

		} catch (SQLException e) {
			e.printStackTrace();
		}

		 return null;
	}
}
