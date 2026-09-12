# The warm list

## Read this before doing any cold outreach

Cold email to strangers converts in low single-digit percentages. A request
to someone who already knows your work converts at a wholly different order
of magnitude, and it converts *faster* - days instead of a six-week ladder.

Larry has spent a career in professional kitchens. That network is the single
most valuable asset this business currently owns, and it is worth more than
the portfolio, the website and the prospect list combined - because every
person on it has already seen the standard. There is no credibility gap to
close, which is the entire cost of cold outreach.

**The first paying client is far more likely to come from this list than from
the cold pipeline.** Build it first. It takes about twenty minutes and needs
no research, no verification and no tooling - it comes out of memory.

## Build it in twenty minutes

Set a timer. Write down every name that fits, without filtering. Filtering
while recalling is what makes these lists come out short.

**Kitchens and restaurants**
- Every chef, sous, and chef de partie worked with
- Every GM, owner, or operating partner
- Anyone who has since opened their own place - these are the best rows on
  the list, because they now own the marketing problem

**Suppliers and purveyors**
- Produce, protein, seafood, dry goods reps
- Specialty and small-batch producers sold to or bought from
- Equipment and smallware reps
- Reps carry lines. A rep who likes the work introduces several brands at
  once, which makes them worth more than most direct prospects

**Hospitality around the kitchen**
- Catering and events, banquet and BEO contacts
- Hotel F&B directors
- Bar and beverage managers

**Adjacent**
- Farmers market and food hall vendors
- Anyone running a packaged product on the side - sauces, spice, bakes
- Food writers, local press, market organizers

## Then split the list in two

**They could buy** - a business with a product or menu that needs images.
Use template **A1**, the direct ask.

**They could introduce** - no buying authority, good network. Use **A2**, the
referral ask. Ask for **one** introduction, not a list. One is answerable in
thirty seconds; a list gets deferred and then forgotten.

## Load them into the pipeline

```
node tools/pipeline.mjs add "Company or Name" Warm "who they are" "how you know them"
```

Warm rows skip the qualification gate and land straight in `Queued` with a
score of 9. That is deliberate: the four gates exist to decide whether a
stranger is worth an email. For someone who already knows the work, the
relationship *is* the qualification.

## Rules that keep the network intact

1. **Never open with the pitch.** Ask how they are, and mean it. The ask goes
   second.
2. **Ask for one thing.** One intro, or one project. Not both in one message.
3. **Give the exit.** "If it's not useful, no reply needed" - so a no costs
   them nothing and costs you no relationship.
4. **Report back.** If an intro leads anywhere, tell the person who made it.
   This is what turns one introduction into a standing source of them.
5. **Do not spec-work the network.** Friends get the real offer at the real
   price. Free work for people who know you sets a rate that never recovers,
   and it quietly signals the work is worth nothing.

## Honest framing of the portfolio

Every piece is currently labeled **CONCEPT / SPEC WORK**, and it should be
said out loud rather than waited for:

> Those are pieces I produced to a commercial brief, not for clients - I'd
> rather tell you that up front. If you want to see the standard against your
> own product, I'll shoot one frame of it and you can judge it directly.

People who know Larry will respect the disclosure. They would not respect
finding out later, and in a network this small, they would find out.

---

## Beyond the kitchen - the half of the list that gets forgotten

The kitchen network is the obvious half. The other half is everyone who knows
Larry as a person rather than as a chef, and it is routinely left off because
it does not feel like a business list.

**People who own something**
- Friends and family who own any business at all, in any industry
- Neighbours, gym contacts, people from church, school or the same trade
- Anyone whose side business you have watched them start

**People who sell to businesses**
- Insurance, accounting, payroll, POS, banking and legal contacts - they each
  know dozens of owners and are paid to maintain those relationships
- Realtors and commercial brokers
- Anyone in local media or events

**People from earlier careers and places**
- Former managers and coworkers from any job
- Anyone who has since moved into marketing at any company

A dentist you know socially is a better first prospect than a stranger with
better-looking gaps in their content. The category does not matter. **The
relationship is the qualification** - that is the whole rule.

## Capture the list in one sitting

Stopping to run a command after each name is what makes these lists come out
at six names. Write them in a plain text file, one per line, then load them
all at once:

```
# Name | Company | how you know them
Sam Rivera | Rivera Provisions | produce rep, five years
Dana Cole  |                    | opened her own bakery last year
```

```
node tools/pipeline.mjs add-warm warm.txt
```

Every row lands **QUALIFIED, not NEW.** Warm rows skip verification entirely -
it is the single exemption in the system, and it exists because there is
nothing to verify when the credibility question is already answered.

## Do not treat a warm lead like a cold one

| Cold | Warm |
|---|---|
| Needs a verified observation | Needs nothing observed |
| Opens on their content problem | Opens on the relationship |
| Six-week ladder, three touches | One message, then a normal follow-up |
| Under 20 sends a day | Send all of them |
| 5% reply, assumed | 35% reply, assumed |

Running a warm contact through the cold sequence reads as marketing to
somebody who knows you, and it burns a relationship to save nothing.

## The two things never to do here

- **Do not shoot for free.** Friends get the real offer at the real price.
  Free work for people who know you sets a rate that never recovers, and it
  quietly tells them the work is worth nothing.
- **Do not skip the ask.** The most common failure on a warm list is a warm
  conversation that never contains a request. Every message asks for one of
  two things: their business, or one introduction.
