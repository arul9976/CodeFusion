package com.ide.codefusion.model;

public class User {
    // Getters and setters
    static int uid = 0;
    private int id;
    private String email;
    private String username;
    private String password;
    private Role role;
    private String authProvider; // GOOGLE, GITHUB, LOCAL
    private String authProviderId;
    private String dateJoined;
    private String lastLogin;
    private boolean isActive;


    public User() {
        this.authProvider = "Local";
        this.authProviderId = "01";
    }

    public User(String email, String username, String password) {
        this();
        this.id = ++uid;
        this.email = email;
        this.username = username;
        this.password = password;
    }

    public User(int id, LoginUser loginUser) {
        this(loginUser.getEmail(), loginUser.getUsername(), loginUser.getPassword());
        this.id = id;
    }

    public User(LoginUser loginUser, String authProvider, String authProviderId) {
        this(loginUser.getEmail(), loginUser.getUsername(), loginUser.getPassword());
        this.authProvider = authProvider;
        this.authProviderId = authProviderId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserName() {
        return username;
    }

    public void setUserName(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAuthProvider() {
        return authProvider;
    }

    public void setAuthProvider(String authProvider) {
        this.authProvider = authProvider;
    }

    public String getAuthProviderId() {
        return authProviderId;
    }

    public void setAuthProviderId(String authProviderId) {
        this.authProviderId = authProviderId;
    }

    public String getDate_joined() {
        return dateJoined;
    }

    public void setDate_joined(String dateJoined) {
        this.dateJoined = dateJoined;
    }

    public String getLast_login() {
        return lastLogin;
    }

    public void setLast_login(String lastLogin) {
        this.lastLogin = lastLogin;
    }

    public boolean isIs_active() {
        return isActive;
    }

    public void setIs_active(boolean isActive) {
        this.isActive = isActive;
    }


    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", authProvider='" + authProvider + '\'' +
                ", authProviderId='" + authProviderId + '\'' +
                ", dateJoined='" + dateJoined + '\'' +
                ", lastLogin='" + lastLogin + '\'' +
                ", isActive=" + isActive +
                '}';
    }

}
