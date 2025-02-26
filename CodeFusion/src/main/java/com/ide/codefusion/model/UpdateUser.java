package com.ide.codefusion.model;

public class UpdateUser {
    private String email;
    private String updated_name;
    private String updated_password;
    private String profilePic;

    public UpdateUser() {

    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUpdated_name() {
        return updated_name;
    }

    public String getProfilePic(){
        return profilePic;
    }
    public void setProfilePic(String profilePic){
        this.profilePic = profilePic;
    }

    public void setUpdated_name(String updated_name) {
        this.updated_name = updated_name;
    }

    public String getUpdated_password() {
        return updated_password;
    }

    public void setUpdated_password(String updated_password) {
        this.updated_password = updated_password;
    }

}
