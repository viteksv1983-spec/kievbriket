import os
from pathlib import Path
from PIL import Image

def convert_and_resize(directory, max_size=(600, 600), quality=80):
    p = Path(directory)
    if not p.exists():
        print(f"Directory {directory} does not exist.")
        return

    for img_path in p.glob("*.*"):
        if img_path.suffix.lower() in [".jpg", ".jpeg", ".png"]:
            print(f"Processing {img_path.name}...")
            try:
                with Image.open(img_path) as img:
                    # Convert to RGB (or RGBA if transparency is needed)
                    if img.mode in ('RGBA', 'LA', 'PA') or (img.mode == 'P' and 'transparency' in img.info):
                        img = img.convert("RGBA")
                        save_kwargs = {"format": "WEBP", "quality": quality, "method": 6, "exact": True}
                    else:
                        img = img.convert("RGB")
                        save_kwargs = {"format": "WEBP", "quality": quality, "method": 6}

                    # Resize preserving aspect ratio
                    img.thumbnail(max_size, Image.Resampling.LANCZOS)
                    
                    # Create new path with .webp extension
                    new_path = img_path.with_suffix(".webp")
                    
                    # Save the image
                    img.save(new_path, **save_kwargs)
                    print(f"  Saved as {new_path.name}")
                    
                # Remove original file
                img_path.unlink()
                print(f"  Deleted original {img_path.name}")
            except Exception as e:
                print(f"Failed to process {img_path}: {e}")

if __name__ == "__main__":
    base_dir = Path(__file__).parent.parent / "media"
    
    categories_dir = base_dir / "categories"
    convert_and_resize(categories_dir, max_size=(600, 600))
    
    products_dir = base_dir / "products"
    convert_and_resize(products_dir, max_size=(600, 600))
    
    print("Done converting images to WebP.")
