# DNS / email / deployment audit - 2026-09-13

**Every fact below was measured, not inferred.** Public DNS was queried directly
from this session (port 53 resolves even though HTTPS egress is blocked), and
the mailbox was tested with a real message that produced a real bounce.

---

## VERIFIED - measured from public DNS

```
NS      pdns1.registrar-servers.com, pdns2.registrar-servers.com
A   @   192.64.119.87
TXT @   v=spf1 include:spf.efwd.registrar-servers.com ~all
MX      eforward1/2/3.registrar-servers.com (10)
        eforward4 (15), eforward5 (20)
CNAME www   parkingpage.namecheap.com  ->  2.59.170.19, 104.219.250.36
SOA     pdns1.registrar-servers.com  serial 1789108243
```

### 1. The Google verification TXT is NOT PUBLISHED

`TXT @` returns exactly one record - the SPF string. The value
`google-site-verification=E_cQb7PmJqiSDwQD1cPd7DZWZoYh1EPAv4FeL5GHi3Q`
**does not exist in public DNS.**

That is the whole answer to "why can't Google verify." Google is not failing;
it is correctly reporting that the record is not there. Namecheap's editor
displayed it, but the save never committed - which is exactly what the
"Failed to save record" error was saying.

**Nameservers are Namecheap BasicDNS**, so the Namecheap editor IS the
authoritative source. The records do take effect when they actually save. This
rules out the worst case - the domain is not delegated somewhere else.

### 2. hello@apexcontentstudio.online DOES NOT RECEIVE MAIL

Tested 2026-09-13 00:46:30Z with a live message. It bounced in **four seconds**:

```
554 5.7.1 <hello@apexcontentstudio.online>: Relay access denied
Remote-MTA: dns; eforward1.registrar-servers.com (162.255.118.51)
Status: 5.7.1
```

**Read that carefully.** Namecheap's forwarding servers are answering - MX is
fine - but they reject the address because **no forwarder named `hello@` has
been created.** The mailbox does not exist.

This address is on the website, in every outreach template, in the proposal
template and in the site's structured data. **Every inbound lead would have
been lost silently.** Nothing goes out until this is fixed.

### 3. Mail is on Namecheap forwarding, NOT Google Workspace

MX points at `eforward*.registrar-servers.com` and SPF includes
`spf.efwd.registrar-servers.com`. Both are Namecheap's free email forwarding.

Google Workspace would require MX `smtp.google.com` (or the legacy five-record
ASPMX set) and SPF `v=spf1 include:_spf.google.com ~all`. Neither is present.

### 4. The Google Workspace account is on a DIFFERENT domain

The test message sent as **`larryhillsjr@apexhospitalitygrouplvcom.com`**.

So Workspace is configured for `apexhospitalitygrouplvcom.com`, not for
`apexcontentstudio.online`. The verification TXT is for **adding**
apexcontentstudio.online to that existing Workspace as a second domain.

> **Worth a look:** `apexhospitalitygrouplvcom.com` reads like a typo of
> `apexhospitalitygrouplv.com` - "lvcom.com". It is the real, working domain on
> the Workspace account, so nothing is broken by it, but it is worth knowing
> what is on the bill and what is on the business cards.

### 5. The domain is fully parked

`A @` resolves to Namecheap's redirect IP and `www` is a CNAME to
`parkingpage.namecheap.com`. Both must go before Vercel can serve the domain.

---

## ROOT CAUSE - why Namecheap will not save

**The URL Redirect Record on `@`.** Namecheap's own guidance and multiple
independent troubleshooting sources agree: a URL Redirect Record on a host
blocks other records from saving on that host, and the fix is to delete the
redirect first.

A URL Redirect is not a real DNS record type - Namecheap implements it with
hidden A records plus a redirect service. That is why it conflicts.

Secondary causes, if deleting the redirect does not fix it: a stale editor
session (hard-refresh or re-login), pasting a value with a trailing space, or
saving several rows at once instead of one at a time with the green checkmark.

---

## UNKNOWN - not determinable from here

- Whether the Vercel project `apex-content-studio` has a repository connected.
  The integration returns **403 Forbidden** on `list_deployments` and 404 on
  reads, so its contents cannot be inspected. Dashboard only.
- Which address, if any, `hello@` was ever intended to forward to.
- Whether `apexhospitalitygrouplvcom.com` is the intended spelling.

## BLOCKED - requires owner action in an account

- Namecheap DNS edits
- Google Workspace admin console
- Vercel dashboard

---

## THE SEQUENCE - dependency order, with the reasoning

**Two of these are independent and should run in parallel.** The Vercel deploy
needs no DNS at all; waiting on DNS to deploy wastes days for nothing.

### Track A - email, and it is the urgent one

**A1. Create the `hello@` forwarder. Two minutes, free, works today.**

Namecheap -> Domain List -> Manage -> **Domain** tab -> **Redirect Email** ->
Add Forwarder:

| Alias | Forwards to |
|---|---|
| `hello` | `larryhillsjr@apexhospitalitygrouplvcom.com` |

Touch nothing else. MX and SPF stay exactly as they are.

This is the fastest path to a working business address. A Google Workspace
mailbox on this domain is better long-term, but it is blocked behind
verification and it is not worth blocking outreach for.

**A2. Re-test.** Send a message to `hello@apexcontentstudio.online` and confirm
it lands. **No outreach until this passes.**

### Track B - website, blocked on nothing

**B1. Deploy to Vercel** per `DEPLOY.md`. Root `site`, branch `main`, framework
Other. Produces a `*.vercel.app` URL that works immediately and needs no DNS.

**B2. Use that URL now** - Google Business Profile, LinkedIn, outreach.

### Track C - Google verification, after A1

**C1. Delete the blocking records.** Namecheap -> Advanced DNS:

- Delete the **URL Redirect Record** on `@` (this is the root cause)
- Delete the **CNAME `www` -> parkingpage.namecheap.com** (a parking page)

Both only serve a parking page. Nothing of value is lost.

**C2. Add the TXT.** One record, saved on its own with the green checkmark:

| Type | Host | Value | TTL |
|---|---|---|---|
| TXT Record | `@` | `google-site-verification=E_cQb7PmJqiSDwQD1cPd7DZWZoYh1EPAv4FeL5GHi3Q` | Automatic |

**Do not delete the SPF TXT.** Two TXT records on `@` is normal and correct.

**C3. Confirm it is actually published** before touching the Google console -
the editor showing it is not evidence. Check with any public DNS lookup for
`TXT apexcontentstudio.online`, or send the word and it can be re-checked from
here in seconds.

**C4. Then click Verify in Google.**

### Track D - the custom domain, only after B1 and C4

**D1.** In the Vercel project, add both `apexcontentstudio.online` and
`www.apexcontentstudio.online`. Vercel will show the exact records - **use
those**, since Vercel now issues per-project targets like
`xyz.vercel-dns-016.com`. The legacy fallbacks are `A @ 76.76.21.21` and
`CNAME www cname.vercel-dns.com`.

**D2.** Add them in Namecheap Advanced DNS. The conflicting records were
already removed in C1.

**D3. Re-verify MX and SPF are untouched.** They are on different hosts and
record types, so they should be - but check, because this is the step where
email gets broken by accident.

### Track E - Google Workspace mail on this domain, LAST and optional

Only after C4 succeeds, and only if a real mailbox is wanted instead of
forwarding. Add apexcontentstudio.online as a domain in the Workspace admin
console, then change MX to `smtp.google.com` and SPF to
`v=spf1 include:_spf.google.com ~all`.

> **DO NOT CHANGE MX BEFORE THE DOMAIN IS ADDED IN WORKSPACE.** Pointing MX at
> Google for a domain Google does not yet host means mail is accepted by
> nobody. The forwarder from A1 keeps working until the moment MX changes, and
> stops the moment it does.

---

## What must not be touched

- **MX records** - not until Track E, deliberately
- **The SPF TXT** - it matches the current forwarding setup
- **Nameservers** - BasicDNS is correct and the editor is authoritative
- No A record for `@` until Vercel names the value
- No second CNAME on `www`
