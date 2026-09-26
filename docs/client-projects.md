# Client projects - verification record

The public site distinguishes **real client work** from **concept / spec work**, and that
distinction is a trust asset. This file is the evidence behind every entry marked
`Real Client Project`. If a claim is not recorded here, it does not go on the site.

Rule: the green `.tag.client` marker is reserved for paid, commissioned, delivered client
work. Everything else keeps the gold `.tag.spec` marker reading `Concept / Spec Work`.
Nothing is converted from concept to client work without an entry below.

---

## 1. Best Y'all Cigars - Website Design & Development

**Status:** real client work. Delivered and live.
**Published at:** `site/best-yall-cigars-website.html`, and featured in `#clients` on the home page.

### Verified facts (these are the only facts the site states)

| Fact | Value |
|---|---|
| Client | Best Y'all Cigars |
| Client location | Las Vegas, Nevada |
| Client business type | Cigar business |
| Project | Website Design & Development |
| Apex Content Studio role | Website design and development |
| Client website | https://bestcigarslv.com/ |
| Status | Delivered, site is live |

### Permission basis

The client owner gave written permission in a text exchange. Larry asked whether Apex could
say the company built the client's webpage and use that to drive people to the client's
website. The owner's response was "Ok."

That permission covers:

- identifying Best Y'all Cigars as an Apex Content Studio project
- promoting the project and linking to the client's website

### NOT authorized - do not publish

The permission above does **not** extend to any of the following, and none of it appears
on the site:

- sales, revenue, traffic, conversion, ROI or customer-growth figures
- performance statistics of any kind
- a testimonial, review, or quote attributed to the client or its owner
- awards or rankings
- the client owner's personal name, photograph, or personal information

Publishing any item in that list requires separate, explicit authorization recorded here
first.

### Not documented (absent from the site by design)

The repository holds no verified record of the following, so the site says nothing about
them. These are **UNVERIFIED**, not false - they simply have no evidence on file:

- the detailed scope breakdown (copywriting, photography, hosting, domain, e-commerce,
  maintenance, ongoing retainer)
- project start date, delivery date, or duration
- contract value or payment terms
- whether Apex holds any ongoing responsibility for the site

If any of these is needed publicly, verify it with the client first and record it here.

### Assets

No screenshot of the client site is stored in this repository, so the case study is
deliberately text-only. This matters technically: every image block on the site is gated by
`[data-block]` and stays hidden until its file actually decodes, so a case study built
around a missing screenshot would render as nothing. The `#clients` section on the home page
and the case study page therefore carry **no gated image blocks at all** - the only real
client project on the site cannot disappear because of a broken asset path.

To add a screenshot later: capture it, save it under `site/images/portfolio/client-work/`,
add it with `alt`, `width` and `height`, and re-run `node tools/verify-site.mjs`.

---

## Concept / spec work

Everything in the `#work` grid and the `#method` before/after rows on the home page is
studio-produced concept and spec work. It is labeled `Concept / Spec Work` in visible text.
There is no documented client commission behind any of it, and it must not be relabeled.
