package com.ide.codefusion.model;

import java.time.LocalDateTime;

public class Collaborator {
    int user_id;
    String username, email;
    LocalDateTime last_login;
    boolean is_active;

    public Collaborator(){}

    public int getUser_id() {
        return user_id;
    }
    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public LocalDateTime getLast_login() {
        return last_login;
    }
    public void setLast_login(LocalDateTime last_login) {
        this.last_login = last_login;
    }
    public boolean isIs_active() {
        return is_active;
    }
    public void setIs_active(boolean is_active) {
        this.is_active = is_active;
    }

}
