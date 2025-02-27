//package com.ide.codefusion.dao.workspace;
//
//import com.ide.codefusion.dao.DataBaseUtil;
//import com.ide.codefusion.model.Workspace;
//
//import java.sql.PreparedStatement;
//
//public class Noification {
//        public static boolean insertNotification(String senderEmail,String receiverEmail,String notification) {
//            boolean result = false;
//            try{
//                PreparedStatement notificationStmt = DataBaseUtil.getConnection().prepareStatement("insert into Notification (senderId,receiverId,message) values (?,?,?)");
//                int senderId = Workspace.getUserId(senderEmail);
//                int receiverId = Workspace.getUserId(receiverEmail);
//                notificationStmt.setInt(1,senderId);
//                notificationStmt.setInt(2,receiverId);
//                notificationStmt.setString(3,notification);
//                int rowAffected = notificationStmt.executeUpdate();
//                if(rowAffected>0){
//                    result = true;
//                    System.out.println("Notification inserted successfully");
//                }
//                else{
//                    result = false;
//                    System.out.println("Notification insertion failed");
//                }
//            }
//            catch (Exception e) {
//                System.out.println(e.getMessage());
//                result = false;
//            }
//            return result;
//        }
//
//        public static boolean deleteNotification(String senderEmail,String receiverEmail) {
//            boolean result = false;
//            try{
//                PreparedStatement deleteStmt = DataBaseUtil.getConnection().prepareStatement("delete from Notification where senderId = ? and receiverId = ?");
//                int senderId = Workspace.getUserId(senderEmail);
//                int receiverId = Workspace.getUserId(receiverEmail);
//                deleteStmt.setInt(1,senderId);
//                deleteStmt.setInt(2,receiverId);
//                int rowAffected = deleteStmt.executeUpdate();
//                if(rowAffected>0){
//                    result = true;
//                    System.out.println("Notification deleted successfully");
//                }
//                else{
//                    result = false;
//                    System.out.println("Notification deletion failed");
//                }
//            }
//            catch (Exception e) {
//                System.out.println(e.getMessage());
//                result = false;
//            }
//            return result;
//        }
//
//
//}
