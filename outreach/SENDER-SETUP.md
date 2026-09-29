# Sender setup — hello@apexhospitalitygrouplv.org

**No outreach may be sent until Gmail shows the Apex address as an available
Send-As identity.** Not when the steps below are started — when Gmail actually
lists it in the From dropdown.

## Why this file exists

The Gmail account connected to this workspace authenticates as
**`larryhillsjr@apexhospitalitygrouplvcom.com`**. That address is on the
permanently retired list. It is also on a domain that reads like a typo of the
real one, which makes it worse than merely wrong — a recipient who looks at the
From line sees something that appears fraudulent.

Gmail's send API has no `from` parameter. It sends as the authenticated account,
full stop. A search of sent mail from `hello@apexhospitalitygrouplv.org` returns
nothing, so the alias does not exist yet. Until it does, there is no technically
valid way to send a single one of these.

**Do not work around this.** Not by sending from the retired address, not by
putting the Apex address only in the signature, not by a third-party relay. The
From line is the thing being fixed.

## The configuration

In Gmail, signed in as the account that will send:

**Settings → See all settings → Accounts and Import → "Send mail as" → Add another email address**

| Field | Value |
|---|---|
| Name | `Apex Content Studio` |
| Email address | `hello@apexhospitalitygrouplv.org` |
| Treat as an alias | **Unchecked** |

Then, on the SMTP screen:

| Field | Value |
|---|---|
| SMTP Server | `mail.privateemail.com` |
| Port | `587` |
| Username | `hello@apexhospitalitygrouplv.org` |
| Password | the Private Email mailbox password |
| Secured connection | **TLS (STARTTLS)** |

Untick *Treat as an alias* so replies come back to the Private Email mailbox
rather than being swallowed by the Gmail account.

## The verification step — this is the part that blocks everything

Google sends a confirmation code **to `hello@apexhospitalitygrouplv.org`**. That
message lands in Namecheap Private Email, not in Gmail. You have to:

1. Open Private Email webmail and read the code.
2. Enter it in the Gmail dialog (or click the confirmation link).

Nobody can do this step for you — it needs the Private Email password, and this
environment has neither the credentials nor network access to that mailbox.
SMTP ports are blocked here as well.

## Confirm it actually worked

Do not take the setup screen's word for it.

1. Compose in Gmail. The **From** dropdown must offer
   `Apex Content Studio <hello@apexhospitalitygrouplv.org>`.
2. Select it, send a message to yourself, and open the received copy.
3. Check the raw headers: `From:` must read
   `hello@apexhospitalitygrouplv.org`. If it shows the Workspace address, or
   `on behalf of`, it is not finished.

Optional but worth it before a first cold batch: send one to a Gmail address you
own and confirm SPF and DKIM pass in *Show original*. A new domain that fails
either lands in spam, and the first impression is spent.

## Then, and only then

```
node tools/enrich.mjs states          # confirm which records are APPROVED
```

Send each approved email by hand from the Apex identity, then log it:

```
node tools/enrich.mjs log <id> --channel=email --result=sent --touch=1
```

The tooling refuses `SENT` from any state but `APPROVED`, so the funnel cannot
record a send that was never authorized.

## If the alias cannot be made to work

Send from Private Email webmail directly. The bodies are in
`outreach/batch-003/01-emails.md` and are plain text on purpose — paste and send.
Slower, but the From line is correct, which is the only thing that actually
matters here.
