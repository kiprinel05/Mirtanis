"""Outbound email — SMTP transport.

We use Python's built-in `smtplib` over STARTTLS so no extra dependency is
required. For Gmail / Google Workspace, generate an *App Password* and
put the credentials in `.env` (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS).
"""

from __future__ import annotations

import html
import logging
import smtplib
import ssl
from email.message import EmailMessage
from typing import Iterable

from app.core.config import get_settings

logger = logging.getLogger(__name__)


_SERVICE_LABELS = {
    "wedding": "Nuntă",
    "baptism": "Botez",
    "event": "Eveniment / Petrecere",
    "studio": "Ședință Studio",
    "fashion": "Fashion / Editorial",
    "other": "Altul",
}


def _format_lines(lines: Iterable[tuple[str, str | None]]) -> tuple[str, str]:
    """Return (plain_text, html) versions of a label→value list."""
    txt_parts: list[str] = []
    html_parts: list[str] = []
    for label, value in lines:
        if not value:
            continue
        txt_parts.append(f"{label}: {value}")
        html_parts.append(
            f'<tr>'
            f'<td style="padding:8px 14px;color:#8a7a3e;font-family:sans-serif;'
            f'font-size:11px;letter-spacing:0.18em;text-transform:uppercase;'
            f'border-bottom:1px solid #eee5cc;vertical-align:top;width:160px;">'
            f'{html.escape(label)}</td>'
            f'<td style="padding:8px 14px;color:#1a1a1a;font-family:sans-serif;'
            f'font-size:14px;border-bottom:1px solid #eee5cc;">'
            f'{html.escape(value)}</td>'
            f'</tr>'
        )
    return ("\n".join(txt_parts), "".join(html_parts))


def send_booking_email(
    name: str,
    email: str,
    phone: str | None,
    service: str,
    message: str,
    preferred_date_iso: str | None,
) -> None:
    """Compose + ship the booking notification.

    Raises RuntimeError on transport failure so the caller can surface a 5xx.
    """
    settings = get_settings()

    if not (settings.smtp_host and settings.smtp_user and settings.smtp_pass):
        raise RuntimeError(
            "SMTP is not configured. Set SMTP_HOST / SMTP_USER / SMTP_PASS "
            "in the backend .env file."
        )

    service_label = _SERVICE_LABELS.get(service, service)
    pretty_date = preferred_date_iso[:10] if preferred_date_iso else None

    plain, html_rows = _format_lines(
        [
            ("Nume", name),
            ("Email", email),
            ("Telefon", phone),
            ("Serviciu", service_label),
            ("Dată preferată", pretty_date),
        ]
    )

    safe_message = html.escape(message).replace("\n", "<br>")

    msg = EmailMessage()
    msg["From"] = settings.smtp_from or settings.smtp_user
    msg["To"] = settings.booking_recipient
    msg["Reply-To"] = email
    msg["Subject"] = f"Nouă rezervare — {service_label} · {name}"

    msg.set_content(
        "Cerere nouă de rezervare\n"
        "─────────────────────────\n"
        f"{plain}\n\n"
        "Mesaj:\n"
        f"{message}\n"
        "\n— Foto Bugeac · sistem rezervări"
    )

    msg.add_alternative(
        f"""\
<!doctype html>
<html lang="ro">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f6f3ec;font-family:'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f3ec;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 20px 50px -20px rgba(26,26,26,0.18);">
        <!-- Header -->
        <tr>
          <td style="padding:32px 36px 22px;background:linear-gradient(135deg,#1a1a1a 0%,#2a1a3e 100%);color:#f5e6ca;">
            <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:26px;letter-spacing:0.02em;">Foto Bugeac</div>
            <div style="margin-top:6px;font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:#d4af37;">Cerere nouă de rezervare</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:30px 36px 10px;">
            <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;color:#1a1a1a;line-height:1.2;">
              {html.escape(name)} a trimis o solicitare.
            </div>
            <div style="margin-top:8px;font-family:sans-serif;font-size:13px;color:#6a6a6a;">
              Serviciu solicitat: <strong style="color:#a88a26;">{html.escape(service_label)}</strong>
            </div>
          </td>
        </tr>

        <!-- Details table -->
        <tr>
          <td style="padding:20px 36px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fbf8f2;border-radius:12px;overflow:hidden;border:1px solid #eee5cc;">
              {html_rows}
            </table>
          </td>
        </tr>

        <!-- Message -->
        <tr>
          <td style="padding:6px 36px 24px;">
            <div style="font-family:sans-serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#a88a26;margin-bottom:8px;">Mesaj</div>
            <div style="padding:18px 20px;background:#fbf8f2;border-left:3px solid #d4af37;border-radius:8px;font-family:'Segoe UI',sans-serif;font-size:14px;color:#2a2a2a;line-height:1.6;">
              {safe_message}
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:18px 36px 28px;background:#fbf8f2;border-top:1px solid #eee5cc;">
            <div style="font-family:sans-serif;font-size:11px;color:#9a8a5a;">
              Răspunde direct la acest email — adresa de reply este completată automat cu cea a clientului.
            </div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
""",
        subtype="html",
    )

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as server:
            server.ehlo()
            if settings.smtp_use_tls:
                server.starttls(context=context)
                server.ehlo()
            server.login(settings.smtp_user, settings.smtp_pass)
            server.send_message(msg)
    except Exception as exc:  # noqa: BLE001
        logger.exception("SMTP send failed")
        raise RuntimeError(f"Trimiterea email-ului a eșuat: {exc}") from exc

    logger.info(
        "Booking email sent to %s for %s (service=%s)",
        settings.booking_recipient,
        email,
        service,
    )
