package com.ide.codefusion.dao.collab;

import com.ide.codefusion.dao.DataBaseUtil;
import com.ide.codefusion.model.Collaborator;
import org.json.JSONArray;
import org.json.JSONObject;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

public class CollabDAO {

    public static boolean addCollaborators(Collaborator collaborator) {
        System.out.println(collaborator.getEmail() +" "+ collaborator.getCollabEmail());
        try (Connection conn = DataBaseUtil.getConnection()) {
            CallableStatement addCol = conn.prepareCall("CALL addCollab(?, ?, ?)");
            addCol.setString(1, collaborator.getEmail());
            addCol.setString(2, collaborator.getCollabEmail());
            addCol.setString(3, collaborator.getWsName());
            if (addCol.execute()) {
                ResultSet rs = addCol.getResultSet();
                if (rs.next()) {
                    String status = rs.getString(1);
                    System.out.println(status);
                    return status.equals("Collaborated Added");
                }

                System.out.println("status Failed");
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return false;
    }

    public static JSONArray searchCollaborators(String userid) {
        try (Connection conn = DataBaseUtil.getConnection()) {
            CallableStatement sCollabs = conn.prepareCall("CALL searchCollab(?)");
            sCollabs.setString(1, userid);
            if (sCollabs.execute()) {
                ResultSet rs = sCollabs.getResultSet();
                JSONArray collaborators = new JSONArray();
                while (rs.next()) {
                    JSONObject collaborator = new JSONObject();
                    collaborator.put("id", rs.getInt(1));
                    collaborator.put("username", rs.getString(2));
                    collaborator.put("email", rs.getString(3));
                    collaborator.put("last_login", rs.getString(4));
                    collaborator.put("is_active", rs.getBoolean(5));
                    collaborators.put(collaborator);
                }
                return collaborators;
            }
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
        return null;
    }

    public static JSONArray getCollaborators(String wsName, String email) {
        JSONArray collaborators = new JSONArray();
        try (Connection conn = DataBaseUtil.getConnection()) {
            CallableStatement sCollabs = conn.prepareCall("CALL getCollaborators(?, ?)");
            sCollabs.setString(1, email);
            sCollabs.setString(2, wsName);
            System.out.println(" --> " +wsName + " " + email);
            if (sCollabs.execute()) {
                ResultSet rs = sCollabs.getResultSet();
                while (rs.next()) {
                    JSONObject collaborator = new JSONObject();
                    collaborator.put("username", rs.getString(1));
                    collaborator.put("email", rs.getString(2));
                    collaborator.put("isAccepted", rs.getBoolean(3));
                    System.out.println(collaborator.toString());
                    collaborators.put(collaborator);
                }
            }else {
                System.out.println("no collaborators");
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return collaborators;
    }
}
