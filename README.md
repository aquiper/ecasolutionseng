# EC&A Solutions Eng LLC — website

Static redesign of the public site for **EC&A Solutions Eng LLC**, a Houston-area materials, integrity, and welding engineering consultancy.

This folder is a finished multi-page static site. It is meant to be opened in a browser now and later hosted at [ecasolutionseng.com](https://ecasolutionseng.com).

The live domain still points at Google Sites. DNS and hosting cutover are a later step; nothing in this folder changes that.

## Preview locally

From this directory:

```bash
cd /workspace/eca-redesign
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

Pages also work from `file://` (relative links). Google Fonts need a network connection.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home |
| `about.html` | Firm, credentials, clients |
| `services.html` | Four grouped offers with in-page anchors |
| `tools.html` | MIC Risk Evaluator and HAZ toughness predictor |
| `insights.html` | CO2 / H2 technical notes, PHMSA note, dissertation archive |
| `contact.html` | Phone, email, LinkedIn, mailto consult form |

Shared CSS: `css/styles.css`. Shared JS (mobile nav + consult form): `js/main.js`.

## Contact

- Aquiles Perez, PhD
- [aquiles.perez@ecasolutionseng.com](mailto:aquiles.perez@ecasolutionseng.com)
- [(561) 503-6909](tel:5615036909)
- Houston, Texas area
- [LinkedIn](https://www.linkedin.com/in/aquilesperez/)
