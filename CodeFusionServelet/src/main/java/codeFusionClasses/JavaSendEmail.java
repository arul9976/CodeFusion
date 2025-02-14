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
//        properties.put("mail.smtp.auth", "true");
//        properties.put("mail.smtp.starttls.enable", "true");
//        properties.put("mail.smtp.host", "smtp.gmail.com");
//        properties.put("mail.smtp.port", "465");

        properties.put("mail.smtp.host", "smtp.gmail.com");
        properties.put("mail.smtp.socketFactory.port", "465");
        properties.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.port", "465");

        String userName = "manimekala227@gmail.com";  // Change this
        String password = "zajw htjz vdwv vjvl";    // Change this (use an App Password)

        Session session = Session.getInstance(properties, new Authenticator() {
            @Override
			protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(userName, password);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(userName));
            message.setRecipient(Message.RecipientType.TO, new InternetAddress(recipient));
            message.setSubject("Your OTP for Password Reset");
            message.setText("Hello,\n\nYour OTP for password reset is: " + otp + "\n\nThis OTP is valid for 5 minutes.");

            Transport.send(message);
            System.out.println("OTP email sent successfully to " + recipient);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


	private static Message prepareMessage(Session session,String username,String recepient) {
		Message message = new MimeMessage(session);
		try {
			message.setFrom(new InternetAddress(username));
			message.setRecipient(Message.RecipientType.TO, new InternetAddress(recepient));
			message.setSubject("[---Test Email---]");
			message.setText("Hello,\n [---------- Mail body---------]");

		}
		catch(Exception e){
        	e.printStackTrace();
        }
		return message;

	}
}
