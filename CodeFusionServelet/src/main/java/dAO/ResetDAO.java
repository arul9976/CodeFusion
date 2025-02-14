package dAO;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ResetDAO {

	public  static boolean validateOTP(String email, String otp) {
        try {
            PreparedStatement stmt = DBConnection.getConnection().prepareStatement(
                "SELECT otp FROM users WHERE email = ? AND otp = ? AND otp_expiry > NOW()");
            stmt.setString(1, email);
            stmt.setString(2, otp);
            ResultSet rs = stmt.executeQuery();

            return rs.next();
            } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // Reset password
    public static boolean resetPassword(String email, String newPassword) {
        try {
            PreparedStatement stmt = DBConnection.getConnection().prepareStatement(
                "UPDATE users SET password = ?, otp = NULL, otp_expiry = NULL WHERE email = ?");
            stmt.setString(1, newPassword);
            stmt.setString(2, email);

            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
}
