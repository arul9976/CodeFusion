package com.ide.codefusion.utils;

import jakarta.activation.CommandMap;
import jakarta.activation.MailcapCommandMap;

import jakarta.mail.*;
import jakarta.mail.internet.*;
import java.util.Properties;
import java.util.concurrent.*;
import java.io.*;
import java.nio.charset.StandardCharsets;

public class SendOTP implements AutoCloseable {

    private final ExecutorService emailExecutor;
    private final Properties smtpProperties;
    private final String username;
    private final String password;
    private final String defaultSender;

    public SendOTP(String host, String port, String username, String password) {
        // Initialize SMTP properties
        this.smtpProperties = new Properties();
        this.smtpProperties.put("mail.smtp.host", host);
        this.smtpProperties.put("mail.smtp.port", port);
        this.smtpProperties.put("mail.smtp.auth", "true");
        this.smtpProperties.put("mail.smtp.starttls.enable", "true");

        // Explicitly set up activation framework properties
        this.smtpProperties.put("mail.mime.charset", "UTF-8");

        this.username = username;
        this.password = password;
        this.defaultSender = username;

        // Create a bounded thread pool for email operations
        this.emailExecutor = new ThreadPoolExecutor(
                2, 10, 60L, TimeUnit.SECONDS,
                new LinkedBlockingQueue<>(100),
                new ThreadPoolExecutor.CallerRunsPolicy());
    }

    /**
     * Sends an OTP email asynchronously
     */
    public Future<Boolean> sendOtpEmailAsync(String to, String otp) {
        return emailExecutor.submit(() -> {
            try {
                sendOtpEmail(to, otp);
                System.out.println("OTP SENT SUCCESSFULLY");
                return true;
            } catch (Exception e) {

                return false;
            }
        });
    }

    /**
     * Synchronous method to send OTP email
     */
    public void sendOtpEmail(String to, String otp) throws MessagingException, IOException {
        // Ensure the MailcapCommandMap is properly initialized
        initializeMailcap();

        Session session = Session.getInstance(smtpProperties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        // Enable debug mode if needed
        // session.setDebug(true);

        MimeMessage message = new MimeMessage(session);
        message.setFrom(new InternetAddress(defaultSender));
        message.setRecipient(Message.RecipientType.TO, new InternetAddress(to));
        message.setSubject("Your OTP for Password Reset");

        // Create multipart email
        MimeMultipart multipart = new MimeMultipart("related");

        // Text part
        MimeBodyPart textPart = new MimeBodyPart();
        String htmlContent = loadEmailTemplate(otp);
        textPart.setContent(htmlContent, "text/html; charset=UTF-8");
        multipart.addBodyPart(textPart);

        message.setContent(multipart);

        Transport.send(message);
    }

    /**
     * Initialize MailcapCommandMap to avoid provider not found error
     */
    private void initializeMailcap() {
        MailcapCommandMap mailcapCommandMap = new MailcapCommandMap();
        mailcapCommandMap.addMailcap("text/html;; x-java-content-handler=com.sun.mail.handlers.text_html");
        mailcapCommandMap.addMailcap("text/plain;; x-java-content-handler=com.sun.mail.handlers.text_plain");
        mailcapCommandMap.addMailcap("multipart/*;; x-java-content-handler=com.sun.mail.handlers.multipart_mixed");
        CommandMap.setDefaultCommandMap(mailcapCommandMap);
    }

    /**
     * Load email template from classpath resource
     */
    private String loadEmailTemplate(String otp) throws IOException {
        String logoUrl = "https://static-00.iconduck.com/assets.00/intellij-idea-icon-2048x2048-hsyna1mi.png";  // Link to your logo

        // HTML email content with more structure, styling, and logo
        String emailContent = String.format(
                "<html>" +
                        "<head><style>" +
                        "body {font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;}" +
                        "h1 {color: #4CAF50; font-size: 22px; font-weight: bold;}" +
                        "h2 {font-size: 20px; color: #333;}" +
                        "p {font-size: 14px; line-height: 1.6;}" +
                        ".container {max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;}" +
                        ".otp {font-size: 24px; font-weight: bold; color: #4CAF50;}" +
                        ".footer {font-size: 12px; color: #777; margin-top: 30px;}" +
                        ".footer a {color: #4CAF50; text-decoration: none;}" +
                        "img {max-width: 200px;}" +
                        "</style></head>" +
                        "<body>" +
                        "<div class='container'>" +
                        "<img src='" + logoUrl + "' alt='Logo'/>" +
                        "<h1>Password Reset Request</h1>" +
                        "<p>Hello,</p>" +
                        "<p>We received a request to reset the password for your account. To proceed, please use the following One-Time Password (OTP):</p>" +
                        "<p class='otp'>" + otp + "</p>" +
                        "<p>This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email.</p>" +

                        "<h2>How to Reset Your Password:</h2>" +
                        "<p>1. Go to the <a href='https://yourapp.com/reset-password' target='_blank'>password reset page</a> on our website.<br>" +
                        "2. Enter the OTP provided above in the designated field.<br>" +
                        "3. Choose a new password and confirm it to complete the process.</p>" +

                        "<h2>Need Help?</h2>" +
                        "<p>If you encounter any issues or need assistance, feel free to contact our support team at <a href='mailto:support@yourdomain.com'>support@yourdomain.com</a>.</p>" +

                        "<div class='footer'>" +
                        "<p>Best regards,<br>Your Application Team</p>" +
                        "<p><small>If you did not request a password reset, you can safely ignore this email.</small></p>" +
                        "<p><small>This email was sent to you because you requested a password reset on our platform. If you believe this was sent to you by mistake, please contact our support team.</small></p>" +
                        "</div>" +
                        "</div>" +
                        "</body>" +
                        "</html>"
        );

        return emailContent;
    }

    /**
     * Provide a default template if the file cannot be loaded
     */
    private String getDefaultTemplate() {
        return "<html><body>" +
                "<h1 style='color: #4CAF50;'>Your OTP Code</h1>" +
                "<p>Use this code to reset your password:</p>" +
                "<h2 style='background-color: #f0f0f0; padding: 10px; display: inline-block;'>{{OTP}}</h2>" +
                "<p>This code will expire in 10 minutes.</p>" +
                "<p>If you did not request this code, please ignore this email.</p>" +
                "</body></html>";
    }

    @Override
    public void close() {
        if (emailExecutor != null && !emailExecutor.isShutdown()) {
            try {
                emailExecutor.shutdown();
                if (!emailExecutor.awaitTermination(30, TimeUnit.SECONDS)) {
                    emailExecutor.shutdownNow();
                }
            } catch (InterruptedException e) {
                emailExecutor.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }
    }
}