package codeFusionClasses;

import java.util.Properties;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;



public class JavaSendEmail {



    public static void sendMail(String recipient, String otp) {
    	System.out.println("Preparing to send OTP email to " + recipient);

        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true"); 
        properties.put("mail.smtp.host", "smtp.gmail.com");
        properties.put("mail.smtp.port", "587"); 

        String userName = "manimekala227@gmail.com";  
        String password = "xhuk xrel ircq gsbo";  
        Session session = Session.getInstance(properties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(userName, password);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(userName, "Code Fusion"));  
            message.setRecipient(Message.RecipientType.TO, new InternetAddress(recipient));
            message.setSubject("Your Secure OTP for Password Reset");

            String emailContent = "<html><body>"
                    + "<h2>Hello,</h2>"
                    + "<p>Your One-Time Password (OTP) is: <strong>" + otp + "</strong></p>"
                    + "<p>This OTP is valid for 5 minutes.</p>"
                    + "<br>"
                    + "<p>If you did not request this, please ignore this email.</p>"
                    + "<p>Best Regards,<br><strong>Code Fusion Support Team</strong></p>"
                    + "</body></html>";

            message.setContent(emailContent, "text/html; charset=utf-8"); 

            Transport.send(message);
            System.out.println("OTP email sent successfully to " + recipient);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}

