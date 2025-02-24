package com.ide.codefusion.dao.workspace;

import com.ide.codefusion.dao.DataBaseUtil;
import org.json.JSONObject;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class WorkspaceDAO {
    public static boolean insertWorkspace(String workspaceName,String email,String technologyStack){
        boolean result = false;
        try{

            int userId = getUserId(email);
            PreparedStatement workspaceStmt = DataBaseUtil.getConnection().prepareStatement("insert into Workspace(workspaceName,userId,technologyStack) values (?,?,?)");
            workspaceStmt.setString(1,workspaceName);
            workspaceStmt.setInt(2,userId);
            workspaceStmt.setString(3,technologyStack);

            int rowAffected = workspaceStmt.executeUpdate();
            if(rowAffected > 0){
                System.out.println("Workspace Inserted Successfully");
                result = true;
            }
            else {
                System.out.println("Workspace Insertion Failed");
                result = false;
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    public static void updateWorkspace(String workspaceName,String email,String technologyStack){
        try{
            int userID = getUserId(email);
            PreparedStatement updateWorkspaceStmt = DataBaseUtil.getConnection().prepareStatement("update workspace set workspaceName = ?, technologyStack = ? where id = ? ");
            updateWorkspaceStmt.setString(1,workspaceName);
            updateWorkspaceStmt.setString(2,technologyStack);
            updateWorkspaceStmt.setInt(3,userID);
            int rowAffect = updateWorkspaceStmt.executeUpdate();
            if(rowAffect > 0){
                System.out.println("Workspace Updated Successfully");
            }
            else{
                System.out.println("Workspace Update Failed");
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static boolean renameWorkspace(String workspaceName,String email){
        boolean result = false;
        try{
            int userID = getUserId(email);
            PreparedStatement workspaceNameStmt = DataBaseUtil.getConnection().prepareStatement("update workspace set workspaceName = ? where userId = ?");
            workspaceNameStmt.setString(1,workspaceName);
            workspaceNameStmt.setInt(2,userID);
            int rowAffect = workspaceNameStmt.executeUpdate();
            if(rowAffect > 0){
                result = true;
                System.out.println("Workspace Renamed Successfully");
            }
            else{
                result = false;
                System.out.println("Workspace Rename Failed");
            }
        }
        catch (Exception e) {
            result = false;
            e.printStackTrace();

        }
        return result;
    }


    public static int getUserId(String email){
        int userID = 0;
        try{
            PreparedStatement userIdStmt = DataBaseUtil.getConnection().prepareStatement("select id from users where email = ?");
            userIdStmt.setString(1,email);
            ResultSet resultSet = userIdStmt.executeQuery();

            if(resultSet.next()){
                userID = resultSet.getInt("id");
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return userID;
    }


    public static JSONObject getWorkspace(String email){
        JSONObject jsonUser = new JSONObject();
        int id = getUserId(email);
        try{
            PreparedStatement getWorkspaceStmt = DataBaseUtil.getConnection().prepareStatement("select * from Workspace where userId = ?");
            getWorkspaceStmt.setInt(1,id);
            ResultSet resultJSON = getWorkspaceStmt.executeQuery();

            if(resultJSON.next()){
                jsonUser.put("workspaceName", resultJSON.getString("workspaceName"));
                jsonUser.put("technologyStack", resultJSON.getString("technologyStack"));
            }
            else{
                System.out.println("workspace not found");
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return jsonUser;
    }
}
