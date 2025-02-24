package com.ide.codefusion.dao.workspace;

import com.ide.codefusion.dao.DataBaseUtil;
import com.ide.codefusion.model.Workspace;
import org.json.JSONArray;
import org.json.JSONObject;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class WorkspaceDAO {
    public static boolean createWorkspace(Workspace workspace) {
        boolean result = false;
        try (Connection conn = DataBaseUtil.getConnection()) {

            PreparedStatement workspaceStmt = conn.prepareCall("CALL createWorkspace (?,?,?);");
            workspaceStmt.setString(1, workspace.getName());
            workspaceStmt.setString(2, workspace.getOwnerEmail());
            workspaceStmt.setString(3, workspace.getTechStack().toString());

            boolean rowAffected = workspaceStmt.execute();
            if (rowAffected) {
                ResultSet rs = workspaceStmt.getResultSet();
                if (rs.next()) {
                    int status = rs.getInt(2);
                    System.out.println("Status Code " + status);
                    if (status == 200) {
                        System.out.println("Workspace Inserted Successfully");
                        return true;
                    }
                }

            }
            System.out.println("Workspace Insertion Failed");
            result = false;

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return result;
    }

    public static boolean updateWorkspace(String email, String workspaceName, String newWsName) {
        try (Connection conn = DataBaseUtil.getConnection()) {
//            int userID = getUserId(email);
            PreparedStatement updateWorkspaceStmt = conn.prepareCall("CALL updateWorkspace (?, ?, ?);");
            updateWorkspaceStmt.setString(1, workspaceName);
            updateWorkspaceStmt.setString(2, newWsName);
            updateWorkspaceStmt.setString(3, email);
            System.out.println("\nWS Name : " + workspaceName + "\n New WS Name : " + newWsName + "\n Email : " + email);
            ResultSet rs = updateWorkspaceStmt.executeQuery();

            if (rs.next()) {
                String status = rs.getString(1);
                if (status.equals("Workspace updated successfully.")) {
                    System.out.println(status);
                    return true;
                } else {
                    System.out.println(status);
                }
            } else {
                System.out.println("Workspace Update Failed");
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return false;
    }

    public static boolean renameWorkspace(String workspaceName, String email) {
        boolean result = false;
        try {
            int userID = getUserId(email);
            PreparedStatement workspaceNameStmt = DataBaseUtil.getConnection().prepareStatement("update workspace set workspaceName = ? where userId = ?");
            workspaceNameStmt.setString(1, workspaceName);
            workspaceNameStmt.setInt(2, userID);
            int rowAffect = workspaceNameStmt.executeUpdate();
            if (rowAffect > 0) {
                result = true;
                System.out.println("Workspace Renamed Successfully");
            } else {
                result = false;
                System.out.println("Workspace Rename Failed");
            }
        } catch (Exception e) {
            result = false;
            e.printStackTrace();

        }
        return result;
    }


    public static int getUserId(String email) {
        int userID = 0;
        try {
            PreparedStatement userIdStmt = DataBaseUtil.getConnection().prepareStatement("select id from users where email = ?");
            userIdStmt.setString(1, email);
            ResultSet resultSet = userIdStmt.executeQuery();

            if (resultSet.next()) {
                userID = resultSet.getInt("id");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return userID;
    }


    public static JSONArray getWorkspaces(String email) {
        JSONArray jsonArray = new JSONArray();
        try (Connection conn = DataBaseUtil.getConnection()){
            CallableStatement getWorkspaceStmt = conn.prepareCall("CALL getWorkspaces(?);");
            getWorkspaceStmt.setString(1, email);

            boolean isWorkspacesHas = getWorkspaceStmt.execute();
            System.out.println(isWorkspacesHas);
            if (!isWorkspacesHas) {
                System.out.println("workspace not found");
                return null;
            }

            ResultSet resultJSON = getWorkspaceStmt.getResultSet();

            while (resultJSON.next()) {
                JSONObject jsonUser = new JSONObject();
                jsonUser.put("workspaceName", resultJSON.getString("wName"));
                jsonUser.put("lastAccess", resultJSON.getString("lastAccess"));
                jsonUser.put("isActive", resultJSON.getBoolean("isActive"));
                jsonUser.put("techStack", resultJSON.getString("techStack"));
                jsonUser.put("ownerName", resultJSON.getString("username"));
                jsonArray.put(jsonUser);
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
        System.out.println(jsonArray);
        return jsonArray;
    }

    public static boolean updateLastAccess(String wsName) {
        try(Connection conn = DataBaseUtil.getConnection()){
            CallableStatement updatels = conn.prepareCall("CALL updateLastAccess (?);");
            updatels.setString(1, wsName);
            int rowAffected = updatels.executeUpdate();
            return rowAffected > 0;
        }catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return false;
    }
}
