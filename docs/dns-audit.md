# DNS / email / deployment audit - 2026-09-13

> ## HISTORICAL. DO NOT FOLLOW THE INSTRUCTIONS IN THIS SECTION.
>
> Everything from here to the **ADDENDUM - 2026-09-17** heading below concerns
> the **retired** domain `apexcontentstudio.online` and its dead mailbox
> `hello@apexcontentstudio.online`. It is kept because the measurements and the
> reasoning are still worth reading, and because deleting the record of a wrong
> diagnosis hides how it was corrected.
>
> **Tracks A through E below tell you to create forwarders, change MX records
> and add a domain to Google Workspace. All of that is for the retired domain.
> Running any of it today would be wrong.**
>
> The live domain is **`apexhospitalitygrouplv.org`**, its mailbox is
> **`hello@apexhospitalitygrouplv.org`** on Namecheap Private Email, and the
> current state is in the ADDENDUM, in `DEPLOY.md` and in `data/company.json`.

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

## EMAIL ARCHITECTURE - the decision, and why

**Add `apexcontentstudio.online` to the existing Workspace as a USER ALIAS
DOMAIN. Not a secondary domain.**

Google's own documentation makes this a settled question rather than a
preference:

| | User alias domain | Secondary domain |
|---|---|---|
| Existing users get an address on the new domain | **Automatically, all of them** | No |
| Cost | **None.** Up to 20 alias domains, no change to the bill | A **paid license per user** created on it |
| Setup work per user | None | Create and license every account by hand |
| Best for | One company, two names | Two companies with different staff |

Apex is one operator. A secondary domain would mean paying a second license to
recreate an identity that an alias domain grants for free.

### What the alias domain produces

| Address | How it exists | Cost |
|---|---|---|
| `larryhillsjr@apexcontentstudio.online` | Mirrored automatically by the alias domain | $0 |
| `hello@apexcontentstudio.online` | Add `hello` as a **user alias** on the existing account; the alias domain then mirrors it | $0 |

Google allows up to 30 user aliases per account, so `hello@` costs nothing and
needs no second mailbox. Both addresses land in the existing inbox.

**Sending from them** needs one more step Google documents explicitly: Gmail ->
Settings -> Accounts and Import -> "Send mail as" -> add the address. No SMTP
configuration - Workspace recognizes its own alias domains.

### The one trade-off, stated plainly

An alias domain **mirrors**. Every user on the Workspace automatically gets the
matching address at apexcontentstudio.online, and there is no way to have a
person exist at one domain but not the other. For a solo operator that is a
feature. If Apex Content Studio ever hires staff who should *not* have
addresses at the hospitality domain, that is the day to convert to a secondary
domain - not before.

### The emergency bridge - documented separately, on purpose

**Namecheap email forwarding is a bridge, not the architecture.** It takes two
minutes, costs nothing, and makes `hello@` work today while Workspace
verification is still blocked on a DNS record that will not save.

It is a bridge because it only forwards - mail cannot be *sent* from
`hello@apexcontentstudio.online`, so replies to a prospect would come from a
different address than the one they wrote to. That is survivable for a week and
corrosive as a permanent setup.

**It also dies the instant MX changes to Google.** That is expected and correct:
the bridge exists to be replaced.

## THE SEQUENCE - dependency order, with the reasoning

**Two of these are independent and should run in parallel.** The Vercel deploy
needs no DNS at all; waiting on DNS to deploy wastes days for nothing.

### Track A - email, and it is the urgent one

**A1. Create the `hello@` forwarder - THE BRIDGE, not the architecture. Two
minutes, free, works today.**

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

### Track E - the real architecture, after C4

Only after Google verification succeeds.

**E1.** Workspace Admin -> Account -> Domains -> Manage domains -> **Add a
domain** -> `apexcontentstudio.online` -> choose **user alias domain**.

**E2.** Add `hello` as a user alias on `larryhillsjr@apexhospitalitygrouplvcom.com`
(Admin -> Directory -> Users -> the account -> Alternate email addresses).

**E3.** Change MX to Google:

| Type | Host | Value | Priority |
|---|---|---|---|
| MX | `@` | `smtp.google.com` | 1 |

Delete all five `eforward*.registrar-servers.com` records at the same time.

**E4.** Change SPF from `v=spf1 include:spf.efwd.registrar-servers.com ~all` to
**`v=spf1 include:_spf.google.com ~all`**. One SPF record only - two is a
misconfiguration that fails validation.

**E5.** Gmail -> Settings -> Accounts and Import -> "Send mail as" -> add both
`hello@` and `larryhillsjr@` at apexcontentstudio.online.

**E6.** Test receive AND send. Neither is verified without evidence.

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

---

# ADDENDUM - 2026-09-17: the audit above is about the RETIRED domain

**Read this before acting on anything above.** Everything above was measured on
**2026-09-13 against `apexcontentstudio.online`.** The site has since moved to
the canonical domain **`apexhospitalitygrouplv.org`**, and that domain has a
**completely different mail architecture.** The conclusions above - free
Namecheap forwarding, the missing `hello@` forwarder, the parked A record - do
**not** describe the canonical domain.

## VERIFIED - measured 2026-09-17 from public DNS (8.8.8.8, raw UDP/53)

```
apexhospitalitygrouplv.org
  A      216.198.79.1
  MX     10 mx1.privateemail.com
         10 mx2.privateemail.com
  TXT    v=spf1 include:spf.privateemail.com ~all
  NS     pdns1.registrar-servers.com, pdns2.registrar-servers.com

www.apexhospitalitygrouplv.org   NXDOMAIN - no record of any type
_dmarc.apexhospitalitygrouplv.org                NXDOMAIN
default._domainkey.apexhospitalitygrouplv.org    NXDOMAIN
_vercel.apexhospitalitygrouplv.org               NXDOMAIN

apexcontentstudio.online   unchanged from 2026-09-13
  A      192.64.119.87  (Namecheap parking)
  MX     eforward1/2/3 (10), eforward4 (15), eforward5 (20)
  TXT    v=spf1 include:spf.efwd.registrar-servers.com ~all
```

### 1. Mail on the canonical domain is Namecheap PRIVATE EMAIL, not forwarding

`mx1/mx2.privateemail.com` plus `include:spf.privateemail.com` is Namecheap's
**paid mailbox** product. MX and SPF agree with each other - the mail
configuration on this domain is **internally consistent and not obviously
broken.** This is a different, and better, architecture than the bridge
described above.

Nameservers are still Namecheap BasicDNS, so the domain is in a Namecheap
account and the Namecheap editor remains authoritative.

### 2. The "554 Relay access denied" bounce was NEVER about this address

Source: the owner's own Gmail. The 2026-09-13 test was sent to
**`hello@apexcontentstudio.online`** and bounced in four seconds. That result
was subsequently recorded in `data/company.json` against
`hello@apexhospitalitygrouplv.org`, which was never tested. That
misattribution has been corrected in `data/company.json`.

### 3. Live test 2026-09-17 - the MX ACCEPTED the message

A real message was sent 2026-09-17 18:51Z from
`larryhillsjr@apexhospitalitygrouplvcom.com` to
`hello@apexhospitalitygrouplv.org`, subject
*"Owner delivery test - apexhospitalitygrouplv.org mailbox - 2026-09-17"*.

**No bounce arrived within 13 minutes.** The comparison is the point: the old
domain bounced in **four seconds**. A Private Email MX that rejects an unknown
recipient does so at RCPT time, which produces a fast bounce. It did not.

**Inference, not proof:** the message was accepted for delivery, which means
`hello@` most likely exists as a mailbox or alias in the Private Email
subscription.

### 4. Why it still looks broken to the owner - the likely real answer

**Private Email is a separate inbox.** It is not a forwarder. Mail accepted by
`mx1.privateemail.com` lands in the Private Email mailbox at
**privateemail.com**, *not* in the Google Workspace Gmail inbox on
`apexhospitalitygrouplvcom.com`. An owner watching only Gmail would see
nothing arrive and reasonably conclude the address was dead.

**This is the single cheapest thing to check and it costs one login.**

### 5. Two real gaps that are NOT the mailbox

- **`www` does not exist.** `www.apexhospitalitygrouplv.org` is NXDOMAIN, so
  anyone typing `www.` gets a DNS failure, not the site. Needs a record before
  launch.
- **No DMARC record.** Not a launch blocker, but with SPF already published,
  adding `_dmarc` is a short, free deliverability win and should be done before
  volume outreach.

## NOT VERIFIED - stated as unknown on purpose

- **What `216.198.79.1` is.** It is not Namecheap parking (`192.64.119.87`) and
  not Vercel's documented legacy apex target (`76.76.21.21`). There is no PTR
  record, and a search of Vercel's own documentation returned only the legacy
  value. Whether a Vercel project serves this domain **could not be confirmed.**
- **Whether the message in #3 reached a human-readable inbox.** Requires
  reading the Private Email mailbox. Not possible from a Claude Code session.
- **Whether `apexhospitalitygrouplv.org` sits in the same Namecheap account as
  `apexcontentstudio.online`.** Namecheap's 2026-09-17 ICANN contact
  verification notice lists **only `apexcontentstudio.online`**. That notice
  lists only domains *pending verification*, so it is not evidence of absence.

## URGENT AND UNRELATED - a suspension deadline nobody has actioned

Namecheap emailed `larryhillsjr@apexhospitalitygrouplvcom.com` on
**2026-09-17** (still unread at the time of this audit):

> If you do not verify your contact information by **09/26/2026**, your domains
> will be suspended.

Listed domain: **`apexcontentstudio.online`**. This is ICANN registrant contact
verification and it is a one-click link in that email. It does not touch the
canonical domain, but a suspension would kill the old domain's DNS and any
redirect built on it.

## Vercel - re-tested 2026-09-17, unchanged

| Call | Result |
|---|---|
| `list_projects` (team `chef3600's projects`) | `[]` |
| `get_project apex-content-studio` | `404 Not Found` |
| `get_project apex-content-os` | `404 Not Found` |
| `get_project_deployment_protection apex-content-studio` | `404 Not Found` |

The integration still cannot read this account's projects. **No third project
was created and nothing was deployed** - the correct move is the dashboard,
per `DEPLOY.md`. Note that the A record in #1 means *something* may already be
serving this domain, so the dashboard should be inspected before any new
project is created.
