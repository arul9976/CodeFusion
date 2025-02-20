package com.ide.codefusion.utils;

import org.mindrot.jbcrypt.BCrypt;

public class PasswordEncryption {

    public static String hashpassword(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }

    public static boolean checkPassword(String password, String hashPass) {
        return BCrypt.checkpw(password, hashPass);
    }
}
