package com.example.demo.controller;

import com.example.demo.model.ContactForm;
import com.example.demo.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class LandingController {
    
    private final EmailService emailService;
    
    public LandingController(EmailService emailService) {
        this.emailService = emailService;
    }
    
    @GetMapping("/")
    public String home(Model model) {
        System.out.println("GET / - Página principal cargada");
        if (!model.containsAttribute("contactForm")) {
            model.addAttribute("contactForm", new ContactForm());
        }
        return "index";
    }
    
    @PostMapping("/contacto")
    public String submitContact(@Valid @ModelAttribute ContactForm form, 
                                BindingResult result, 
                                RedirectAttributes redirectAttributes) {
        
        System.out.println("=================================");
        System.out.println("POST /contacto - Formulario recibido!");
        System.out.println("Nombre: " + form.getNombre());
        System.out.println("Email: " + form.getEmail());
        System.out.println("Teléfono: " + form.getTelefono());
        System.out.println("Mensaje: " + form.getMensaje());
        System.out.println("Errores: " + result.hasErrors());
        System.out.println("=================================");

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.contactForm", result);
            redirectAttributes.addFlashAttribute("contactForm", form);
            return "redirect:/#contacto";
        }
        
        try {
            System.out.println("Intentando enviar email...");
            emailService.sendContactEmail(form);
            System.out.println("Email enviado exitosamente!");
            redirectAttributes.addFlashAttribute("success", "¡Gracias! Tu mensaje ha sido enviado correctamente.");
        } catch (Exception e) {
            System.out.println("ERROR al enviar email:");
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Hubo un error al enviar tu mensaje. Intenta nuevamente.");
        }
        
        return "redirect:/#contacto";
    }
}