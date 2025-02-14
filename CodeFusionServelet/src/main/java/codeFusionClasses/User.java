package codeFusionClasses;

public class User {
 int userId;
String email;
 String userName;
 String password;


 public User(String email, String userName, String password) {
		this.email = email;
		this.userName = userName;
		this.password = password;
	}

 public User(int userId,String email,String userName,String password) {
	 this(email,userName,password);

	 this.userId = userId;
 }


    public String getEmail() {
		return email;
	}


    public int getUserId() {
    	return userId;
    }

    public void setUserId(int userId) {
    	this.userId = userId;
    }



	public void setEmail(String email) {
		this.email = email;
	}


	public String getUserName() {
		return userName;
	}


	public void setUserName(String userName) {
		this.userName = userName;
	}


	public String getPassword() {
		return password;
	}


	public void setPassword(String password) {
		this.password = password;
	}

}
