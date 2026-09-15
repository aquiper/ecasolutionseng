# EC&A Solutions Eng LLC website

Static HTML, CSS, and JavaScript for [ecasolutionseng.com](https://ecasolutionseng.com), hosted by GitHub Pages from `main`. No build step is required. Preserve `CNAME` and the existing domain configuration.

## Local preview

From this directory, run `python3 -m http.server 8766 --bind 127.0.0.1`, then open `http://127.0.0.1:8766/`.

## Content

- `index.html`: introduction, principal, services, anonymized work examples, clients, tools.
- `about.html`: biography, credentials, and selected clients.
- `services.html` and `services/*.html`: services and technical figures.
- `tools.html`: client tools and links to tool-specific inquiries.
- `insights.html` and `notes/*.html`: technical summaries and original sources.
- `contact.html`: native FormSubmit inquiry form.
- `thank-you.html`: the form's return page, excluded from indexing.
- `css/styles.css` and `js/main.js`: shared styles, mobile navigation, and inquiry topic handling.

## Contact behavior

The form posts to the existing FormSubmit recipient and returns to `https://ecasolutionseng.com/thank-you.html`. It works without JavaScript; JavaScript adds an editable topic for the five allowlisted tool links. End-to-end delivery depends on the existing FormSubmit activation and must be checked with an authorized live inquiry after deployment. Local validation must not send test messages to the production recipient.

## Review and publishing

Check desktop and phone layouts, keyboard navigation, internal links, and all five tool-to-inquiry paths before publishing. Client-derived work examples require review of their public wording; keep private reports and source records outside this repository. The homepage headline and supporting statement retain the existing approved direction.
