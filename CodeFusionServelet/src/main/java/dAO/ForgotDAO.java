package dAO;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Random;

import codeFusionClasses.JavaSendEmail;

public class ForgotDAO {
	public static boolean passwordReset(String email) {
        try {
            PreparedStatement userStmt = DBConnection.getConnection().prepareStatement("SELECT id FROM users WHERE email = ?");
            userStmt.setString(1, email);
            ResultSet resultIdUser = userStmt.executeQuery();

            int userId = 0;
            if (resultIdUser.next()) {
                userId = resultIdUser.getInt("id");
            } else {
                  return false;
            }

            String otp = generateOTP();


            PreparedStatement updateStmt = DBConnection.getConnection().prepareStatement(
                "UPDATE users SET otp = ?, otp_expiry = NOW() + INTERVAL 5 MINUTE WHERE id = ?");
            updateStmt.setString(1, otp);
            updateStmt.setInt(2, userId);

            int rowAffected = updateStmt.executeUpdate();

            if (rowAffected > 0) {
                JavaSendEmail.sendMail(email, otp);
                System.out.println("OTP successfully stored and email sent.");
                return true;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

        private static String generateOTP() {
        Random rand = new Random();
        int otp = 100000 + rand.nextInt(900000);
        return String.valueOf(otp);
    }
	}
