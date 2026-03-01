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
        ("/", "daily", "1.0"),
        ("/dostavka/", "monthly", "0.6"),
        ("/contacts/", "monthly", "0.6"),
        ("/pro-nas/", "monthly", "0.6"),
    ]

    @staticmethod
    def generate(db: Session, domain: str = None) -> str:
        """Generate a complete sitemap.xml."""
        if not domain:
            domain = "https://drova-kharkiv.com.ua"
        domain = domain.rstrip("/")

        urls = []

        # Static routes
        for path, freq, priority in SitemapService.STATIC_ROUTES:
            urls.append(SitemapService._url_entry(
                f"{domain}{path}", freq, priority
            ))

        # Category pages — dynamic from DB
        categories = db.query(CategoryMetadata).all()
        cat_slug_set = set()
        for cat in categories:
            if cat.slug and (cat.is_indexable if hasattr(cat, 'is_indexable') else True):
                cat_slug_set.add(cat.slug)
                lastmod = cat.updated_at.strftime("%Y-%m-%d") if cat.updated_at else None
                urls.append(SitemapService._url_entry(
                    f"{domain}/catalog/{cat.slug}/", "weekly", "0.8", lastmod
                ))

        # Products with slugs
        products = db.query(Product).filter(
            Product.is_available == True,
            Product.is_deleted == False,
            Product.slug.isnot(None)
        ).all()

        for p in products:
            if p.category and p.slug:
                loc = f"{domain}/catalog/{p.category}/{p.slug}/"
            elif p.slug:
                loc = f"{domain}/catalog/firewood/{p.slug}/"
            else:
                continue
            lastmod = p.updated_at.strftime("%Y-%m-%d") if p.updated_at else None
            urls.append(SitemapService._url_entry(loc, "weekly", "0.7", lastmod))

        # Pages from DB
        pages = db.query(Page).all()
        for page in pages:
            if page.route_path and page.route_path != "/":
                path = page.route_path if page.route_path.endswith("/") else f"{page.route_path}/"
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
            domain = "https://drova-kharkiv.com.ua"
        return f"""User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /token
Disallow: /seed_db

Sitemap: {domain}/sitemap.xml
"""
