# Form Security Operations

Sprint 8.2C launch behavior:

- Contact and Quote submissions use Server Actions only.
- Honeypot validation remains active. Filled honeypot submissions are discarded without persistence.
- Cloudflare Turnstile must be configured with `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`.
- Upstash Redis REST rate limiting must be configured with `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
- Rate limit policy: 5 submissions per IP per hour per form type.
- Supabase persistence remains the first durable side effect.

Launch email decision:

- Resend automation is deferred for launch.
- The launch workflow is manual lead monitoring in Supabase until Resend templates and deliverability are approved.
- Operations must check the `submissions` table daily, filter `type` by `contact` or `quote`, and follow up using the submitted email or phone details.

Quote attachment scope:

- Quote attachments are deferred for launch.
- Uploadthing infrastructure exists, but the public Quote form does not currently request or persist attachment references.
- File exchange should happen during manual follow-up until attachment UX and staff handling policy are approved.

Production verification before launch:

- Submit one valid Contact form and one valid Quote form in production preview.
- Confirm both records exist in Supabase `submissions`.
- Submit once without a Turnstile token and confirm it is rejected.
- Submit more than 5 valid attempts from the same IP/form within one hour and confirm the rate-limit message appears.
