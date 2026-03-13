"""
Slug generation utility.
Transliterates Ukrainian/Russian → Latin, strips special chars, ensures uniqueness.
No external deps — just a dictionary + re.
"""
import re

# Ukrainian + Russian transliteration map
TRANSLIT_MAP = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e',
    'є': 'ye', 'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y',
    'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
    'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'yu', 'я': 'ya', 'ъ': '',
    'ы': 'y', 'э': 'e', 'ё': 'yo',
    # uppercase
    'А': 'a', 'Б': 'b', 'В': 'v', 'Г': 'h', 'Ґ': 'g', 'Д': 'd', 'Е': 'e',
    'Є': 'ye', 'Ж': 'zh', 'З': 'z', 'И': 'y', 'І': 'i', 'Ї': 'yi', 'Й': 'y',
    'К': 'k', 'Л': 'l', 'М': 'm', 'Н': 'n', 'О': 'o', 'П': 'p', 'Р': 'r',
    'С': 's', 'Т': 't', 'У': 'u', 'Ф': 'f', 'Х': 'kh', 'Ц': 'ts', 'Ч': 'ch',
    'Ш': 'sh', 'Щ': 'shch', 'Ь': '', 'Ю': 'yu', 'Я': 'ya', 'Ъ': '',
    'Ы': 'y', 'Э': 'e', 'Ё': 'yo',
}


def transliterate(text: str) -> str:
    """Transliterate Cyrillic text to Latin."""
    result = []
    for char in text:
        result.append(TRANSLIT_MAP.get(char, char))
    return "".join(result)


def generate_slug(name: str) -> str:
    """
    Generate URL-safe slug from name.
    'Бенто-торт Шоколадний' → 'bento-tort-shokoladnyi'
    """
    slug = transliterate(name.lower())
    slug = re.sub(r'[^\w\s-]', '', slug)   # remove special chars
    slug = re.sub(r'[\s_]+', '-', slug)     # spaces/underscores → hyphens
    slug = re.sub(r'-+', '-', slug)         # collapse multiple hyphens
    slug = slug.strip('-')
    return slug


def ensure_unique_slug(db, model_class, slug: str, exclude_id: int = None) -> str:
    """
    Ensure slug is unique in the database.
    If 'bento-tort' exists, returns 'bento-tort-2', 'bento-tort-3', etc.
    """
    query = db.query(model_class).filter(model_class.slug == slug)
    if exclude_id:
        query = query.filter(model_class.id != exclude_id)
    
    if not query.first():
        return slug
    
    # Find unique suffix
    counter = 2
    while True:
        candidate = f"{slug}-{counter}"
        q = db.query(model_class).filter(model_class.slug == candidate)
        if exclude_id:
            q = q.filter(model_class.id != exclude_id)
        if not q.first():
            return candidate
        counter += 1
