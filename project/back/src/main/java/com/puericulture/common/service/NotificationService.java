package com.puericulture.common.service;

import com.puericulture.troc.entity.ExchangeReport;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final JavaMailSender mailSender;

    @Value("${moderation.admin-email}")
    private String adminEmail;

    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void notifyAdminNewReport(ExchangeReport report) {
        if (adminEmail == null || adminEmail.isBlank()) return;
        sendEmail(
                adminEmail,
                "[Modération] Nouveau signalement #" + report.getId(),
                buildReportEmailBody(report));
    }

    public void notifyParticipantsReportResolved(ExchangeReport report) {
        String subject = "[Troc] Signalement #" + report.getId() + " traité";
        String body = buildModerationResultBody(report);
        sendEmail(report.getExchange().getProposerProduct().getAuthor().getEmail(), subject, body);
        sendEmail(report.getExchange().getReceiverProduct().getAuthor().getEmail(), subject, body);
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            mailSender.send(message);
        } catch (MessagingException | MailException e) {
            log.warn(
                    "Failed to send email to '{}' (subject: '{}'): {}",
                    to,
                    subject,
                    e.getMessage());
        }
    }

    private String buildReportEmailBody(ExchangeReport report) {
        return "<p>Un nouveau signalement a été déposé sur l'échange <strong>#"
                + report.getExchange().getId()
                + "</strong>.</p>"
                + "<p><strong>Type :</strong> "
                + report.getType()
                + "</p>"
                + "<p><strong>Description :</strong> "
                + HtmlUtils.htmlEscape(report.getDescription())
                + "</p>"
                + "<p>Connectez-vous au back-office pour traiter ce signalement.</p>";
    }

    private String buildModerationResultBody(ExchangeReport report) {
        String decision =
                switch (report.getStatus()) {
                    case RESOLVED -> "accepté — l'échange a été annulé";
                    case REJECTED -> "rejeté — l'échange reprend son cours";
                    default -> report.getStatus().name();
                };
        return "<p>Le signalement <strong>#"
                + report.getId()
                + "</strong> sur votre échange a été traité.</p>"
                + "<p><strong>Décision :</strong> "
                + decision
                + "</p>"
                + (report.getModerationComment() != null
                        ? "<p><strong>Commentaire :</strong> "
                                + HtmlUtils.htmlEscape(report.getModerationComment())
                                + "</p>"
                        : "");
    }
}
