package signUpValidation;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

public class Validation {

	public static Map<String, String> validateSignUp(String name,String email, String password) {
        Map<String, String> errors = new HashMap<>();

        // Regex patterns for email and password validation
        String emailPattern = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
        String passwordPattern = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$";

        //Name validation
        if(name == null || email.trim().isEmpty()) {
        	errors.put("name", "Name should not be empty");
        }

        // Email validation
        if (email == null || email.trim().isEmpty()) {
            errors.put("email", "Email should not be empty");
        } else if (!Pattern.matches(emailPattern, email)) {
            errors.put("email", "Invalid email format");
        }

        // Password validation
        if (password == null || password.isEmpty()) {
            errors.put("password", "Password should not be empty");
        } else if (!Pattern.matches(passwordPattern, password)) {
            errors.put("password", "Password must have 8+ characters, uppercase, lowercase, and a number");
        }

        return errors;
    }

}
