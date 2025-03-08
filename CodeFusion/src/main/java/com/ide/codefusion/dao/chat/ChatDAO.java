package com.ide.codefusion.dao.chat;

import com.ide.codefusion.dao.DataBaseUtil;
import org.json.JSONObject;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;

public class ChatDAO {

    public boolean addChat(String oEmail, String wsName, JSONObject message) {
        try (Connection connection = DataBaseUtil.getConnection()) {
            CallableStatement cStmt = connection.prepareCall("{CALL addChat(?,?,?)}");
            cStmt.setString(1, oEmail);
            cStmt.setString(2, wsName);
            cStmt.setString(3, message.toString());
            return cStmt.executeUpdate() > 0;

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return false;
    }

    public JSONObject getChats(String oName, String wsName, int beforeId) {
        JSONObject resp = new JSONObject();
        try (Connection connection = DataBaseUtil.getConnection()) {
            CallableStatement cStmt = connection.prepareCall("CALL getChats(?, ?, ?)");
            cStmt.setString(1, oName);
            cStmt.setString(2, wsName);
            cStmt.setInt(3, beforeId);

            ResultSet rs = cStmt.executeQuery();
            while (rs.next()) {
                resp.put(rs.getString(1), rs.getString("messageObj"));
            }
            System.out.println("Chats\n" + resp.toString());
            return resp;
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return null;
    }
}
