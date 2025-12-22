package com.example.demo.service;

import com.example.demo.model.ContactForm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    public final JavaMailSender mailSender;
    
    @Value("${app.contact.email}")
    private String contactEmail;
    
    @Value("${app.contact.name}")
    private String contactName;
    
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    
    public void sendContactEmail(ContactForm form) {
        // Email para ti (notificación)
        SimpleMailMessage notificationMessage = new SimpleMailMessage();
        notificationMessage.setTo(contactEmail);
        notificationMessage.setSubject("Nueva consulta de " + form.getNombre());
        notificationMessage.setText(
            "Has recibido una nueva consulta para tus sesiones:\n\n" +
            "Nombre: " + form.getNombre() + "\n" +
            "Email: " + form.getEmail() + "\n" +
            "Teléfono: " + form.getTelefono() + "\n" +
            "Consulta:\n" + form.getMensaje()
        );
        mailSender.send(notificationMessage);
        
        // Email de confirmación para el cliente
        SimpleMailMessage confirmationMessage = new SimpleMailMessage();
        confirmationMessage.setTo(form.getEmail());
        confirmationMessage.setSubject("Hemos recibido tu consulta - Mari Bienestar & Salud" + contactName);
        confirmationMessage.setText(
            "Hola " + form.getNombre() + ",\n\n" +
            "Gracias por contactarnos, me pondré en contacto contigo muy pronto.\n\n" +
            "Tu consulta:\n" + form.getMensaje() + "\n\n" +
            "Mientras tanto, si tienes alguna pregunta urgente, no dudes en escribirme por WhatsApp.\n\n" +
            "Un saludo cordial,\n" + contactName
        );
        mailSender.send(confirmationMessage);
    }
}