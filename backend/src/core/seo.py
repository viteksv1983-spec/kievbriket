"""
SEO utilities: dynamic sitemap.xml and robots.txt generation.
No external deps — just plain XML string building.
"""
from datetime import datetime
from sqlalchemy.orm import Session

from backend.src.products.models import Product, CategoryMetadata
from backend.src.pages.models import Page
from backend.src.core.config import settings


class SitemapService:
    """Generates sitemap.xml from products, categories, pages, and static routes."""

    # Static pages that always exist in the frontend
    STATIC_ROUTES = [
        ("", "daily", "1.0"),
        ("/catalog/drova", "weekly", "0.8"),
        ("/catalog/brikety", "weekly", "0.8"),
        ("/catalog/vugillya", "weekly", "0.8"),
        ("/delivery", "monthly", "0.6"),
        ("/contacts", "monthly", "0.6"),
    ]

    @staticmethod
    def generate(db: Session, domain: str = None) -> str:
        """Generate a complete sitemap.xml."""
        if not domain:
            domain = "https://kievbriket.com"
        domain = domain.rstrip("/")

        urls = []

        # Static routes
        for path, freq, priority in SitemapService.STATIC_ROUTES:
            urls.append(SitemapService._url_entry(
                f"{domain}{path}", freq, priority
            ))

        # Products with slugs
        products = db.query(Product).filter(
            Product.is_available == True,
            Product.is_deleted == False,
            Product.slug.isnot(None)
        ).all()

        for p in products:
            if p.category and p.slug:
                loc = f"{domain}/catalog/{p.category}/{p.slug}"
            elif p.slug:
                loc = f"{domain}/catalog/drova/{p.slug}"
            else:
                continue
            lastmod = p.updated_at.strftime("%Y-%m-%d") if p.updated_at else None
            urls.append(SitemapService._url_entry(loc, "weekly", "0.7", lastmod))

        # Pages from DB
        pages = db.query(Page).all()
        for page in pages:
            if page.route_path and page.route_path != "/":
                path = page.route_path if not page.route_path.endswith("/") else page.route_path[:-1]
                lastmod = page.updated_at.strftime("%Y-%m-%d") if page.updated_at else None
                urls.append(SitemapService._url_entry(
                    f"{domain}{path}", "monthly", "0.5", lastmod
                ))

        xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        xml += "\n".join(urls)
        xml += "\n</urlset>"
        return xml

    @staticmethod
    def _url_entry(loc: str, changefreq: str, priority: str, lastmod: str = None) -> str:
        entry = f"  <url>\n    <loc>{loc}</loc>\n"
        if lastmod:
            entry += f"    <lastmod>{lastmod}</lastmod>\n"
        entry += f"    <changefreq>{changefreq}</changefreq>\n"
        entry += f"    <priority>{priority}</priority>\n"
        entry += "  </url>"
        return entry

    @staticmethod
    def robots_txt(domain: str = None) -> str:
        if not domain:
            domain = "https://kievbriket.com"
        return f"""User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /internal routes

Sitemap: {domain}/sitemap.xml
"""
