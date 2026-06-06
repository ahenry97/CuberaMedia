#!/usr/bin/env python3
"""Send a production migration completion email from GitHub Actions."""

from __future__ import annotations

import os
import smtplib
import ssl
import sys
from email.message import EmailMessage


REQUIRED_ENV = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USERNAME",
    "SMTP_PASSWORD",
    "SMTP_FROM",
]


def require_env(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        print(f"Missing required environment variable: {name}", file=sys.stderr)
        sys.exit(1)
    return value


def bool_env(name: str, default: bool = True) -> bool:
    value = os.environ.get(name)
    if value is None:
        return default
    return value.strip().lower() not in {"0", "false", "no", "off"}


def main() -> int:
    for name in REQUIRED_ENV:
        require_env(name)

    host = require_env("SMTP_HOST")
    port = int(require_env("SMTP_PORT"))
    username = require_env("SMTP_USERNAME")
    password = require_env("SMTP_PASSWORD")
    sender = require_env("SMTP_FROM")
    recipient = os.environ.get("NOTIFY_TO", "aaronhenry0512@gmail.com").strip()
    use_tls = bool_env("SMTP_USE_TLS", True)

    migration_name = os.environ.get("MIGRATION_NAME", "Production migration").strip()
    production_url = os.environ.get("PRODUCTION_URL", "").strip()
    run_url = os.environ.get("GITHUB_RUN_URL", "").strip()
    sha = os.environ.get("GITHUB_SHA", "").strip()
    ref_name = os.environ.get("GITHUB_REF_NAME", "").strip()

    subject = f"Production migration completed: {migration_name}"
    body = "\n".join(
        [
            "A production migration completed successfully.",
            "",
            f"Migration: {migration_name}",
            f"Branch/ref: {ref_name or 'unknown'}",
            f"Commit SHA: {sha or 'unknown'}",
            f"Production URL: {production_url or 'not configured'}",
            f"GitHub Actions run: {run_url or 'not available'}",
            "",
            "This notification was sent by the production migration workflow.",
        ]
    )

    message = EmailMessage()
    message["From"] = sender
    message["To"] = recipient
    message["Subject"] = subject
    message.set_content(body)

    if port == 465:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(host, port, context=context, timeout=30) as server:
            server.login(username, password)
            server.send_message(message)
    else:
        with smtplib.SMTP(host, port, timeout=30) as server:
            if use_tls:
                server.starttls(context=ssl.create_default_context())
            server.login(username, password)
            server.send_message(message)

    print(f"Sent production migration email to {recipient}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
