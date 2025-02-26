package com.ide.codefusion.dao;

import com.ide.codefusion.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;


public class UserDAO {
    private static final Logger log = LoggerFactory.getLogger(UserDAO.class);

    public User findByEmail(String email) {
        String sql = "CALL getUser(?)";

        try (Connection conn = DataBaseUtil.getConnection();
             CallableStatement pstmt = conn.prepareCall(sql)) {
            pstmt.setString(1, email);

            if (pstmt.execute()) {
                ResultSet rs = pstmt.getResultSet();
                if (rs.next()) {
                    User user = new User();
                    String msg = rs.getString("message");
                    System.out.println(msg);
                    if ("Successfully logged".equals(msg)) {
                        user.setId(rs.getInt("user_id"));
                        return getUser(rs, user);
                    } else {
                        System.out.println(msg);
                    }
                }
            }

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }

        return null;
    }

    private User getUser(ResultSet rs, User user) throws SQLException {
        user.setEmail(rs.getString("email"));
        user.setUserName(rs.getString("username"));
        user.setPassword(rs.getString("password_hash"));
        user.setDate_joined(rs.getString("date_joined"));
        user.setLast_login(rs.getString("last_login"));
        System.out.println("Pic " + rs.getString("profilePic"));
        user.setProfilePic(rs.getString("profilePic"));
        user.setNickname(rs.getString("nickname"));
        return user;
    }

    public User findById(Long id) {
        String sql = "SELECT * FROM users WHERE id = ?";

        try (Connection conn = DataBaseUtil.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setLong(1, id);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                User user = new User();
                user.setId(rs.getInt("id"));
                return getUser(rs, user);
            }

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }

        return null;
    }

    public boolean save(User user) {
        String sql = "CALL signup_user(?, ?, ?, ?)";
        System.out.println("In Save method");
        CallableStatement cstmt = null;

        try (Connection conn = DataBaseUtil.getConnection()) {

            if (conn == null || conn.isClosed()) {
                System.out.println("Connection is closed or null");
                return false;
            }
            System.out.println("Call Init");
            cstmt = conn.prepareCall(sql);

            cstmt.setString(1, user.getEmail().split("@")[0]);
            cstmt.setString(2, user.getEmail());
            cstmt.setString(3, user.getPassword());
            cstmt.setString(4, user.getUserName());

            System.out.println("Call Execute");
            if (cstmt.execute()) {
                System.out.println("Call Success");
                try (ResultSet rSet = cstmt.getResultSet()) {
                    if (rSet.next()) {
                        String status = rSet.getString(1);
                        System.out.println(status);
                        return true;
                    }
                }
            } else {
                System.out.println("Call Failed");
                return false;
            }
            System.out.println("Call Success");
        } catch (SQLException e) {
            System.out.println("---> " + e.getMessage());
        }

        return false;
    }

    public boolean updateNickName(String email, String nickName, String profilePic) {
        String sql = "CALL updateNickName(?,?,?)";
        try (Connection conn = DataBaseUtil.getConnection()) {
            CallableStatement cstmt = conn.prepareCall(sql);
            cstmt.setString(1, email);
            cstmt.setString(2, nickName);
            cstmt.setString(3, profilePic);
            int rows = cstmt.executeUpdate();
            return rows > 0;
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return false;
    }

//    public boolean update(UpdateUser user) {
//        String sql = "CALL updateUser(?, ?, ?, ?)";
//
//        try (Connection conn = DataBaseUtil.getConnection(); CallableStatement pstmt = conn.prepareCall(sql)) {
//
//            pstmt.setString(1, user.getEmail());
//            pstmt.setString(2, user.getUpdated_email());
//            pstmt.setString(3, user.getUpdated_password());
//            pstmt.setString(4, user.getUpdated_username());
//
//         if(pstmt.execute()){
//             ResultSet rs = pstmt.getResultSet();
//             if(rs.next()) {
//                 String status = rs.getString(1);
//                 if (status.equals("User updated successfully")){
//                     return true;
//                 }
//             }
//         }
//
//        } catch (SQLException e) {
//            System.out.println(e.getMessage());
//        }
//
//        return false;
//    }
}