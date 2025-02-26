package com.ide.codefusion.model;

public class Collaborator {

    String email, collabEmail, wsName;
    boolean accepted;

    public Collaborator() {
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getCollabEmail() {
        return collabEmail;
    }
    public void setCollabEmail(String collabEmail) {
        this.collabEmail = collabEmail;
    }
    public boolean getAccepted() {
        return accepted;
    }
    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }
    public String getWsName() {
        return wsName;
    }
    public void setWsName(String wsName) {
        this.wsName = wsName;
    }

}
