import os
from io import BytesIO
from PIL import Image

class ImageProcessor:
    MAX_SIZE = (1920, 1920)
    THUMB_SIZE = (400, 400)
    QUALITY = 85

    @classmethod
    def process_image(cls, file_bytes: bytes, filename: str) -> tuple[bytes, str]:
        """
        Process main image: resize if too large, convert to WebP.
        Returns bytes and new filename.
        """
        img = Image.open(BytesIO(file_bytes))
        
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")

        # Resize if larger than max size, keeping aspect ratio
        img.thumbnail(cls.MAX_SIZE, Image.Resampling.LANCZOS)
        
        output = BytesIO()
        img.save(output, format="WEBP", quality=cls.QUALITY, optimize=True)
        
        base_name = os.path.splitext(filename)[0]
        new_filename = f"{base_name}.webp"
        
        return output.getvalue(), new_filename

    @classmethod
    def create_thumbnail(cls, file_bytes: bytes, filename: str) -> tuple[bytes, str]:
        """
        Create a thumbnail WebP image.
        Returns bytes and new filename.
        """
        img = Image.open(BytesIO(file_bytes))
        
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")

        # Resize for thumbnail
        img.thumbnail(cls.THUMB_SIZE, Image.Resampling.LANCZOS)
        
        output = BytesIO()
        img.save(output, format="WEBP", quality=cls.QUALITY, optimize=True)
        
        base_name = os.path.splitext(filename)[0]
        thumb_filename = f"thumb_{base_name}.webp"
        
        return output.getvalue(), thumb_filename
