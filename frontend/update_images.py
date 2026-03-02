import re
paths = [
    'src/components/new-home/TrustBlock.jsx',
    'src/components/new-home/CategoriesSection.jsx',
    'src/components/new-home/CtaBanner.jsx',
]

dimensions = {
    'TrustBlock.jsx': ' width="600" height="500"',
    'CategoriesSection.jsx': ' width="400" height="300"',
    'CtaBanner.jsx': ' width="1200" height="400"',
}

for p in paths:
    filename = p.split('/')[-1]
    dim = dimensions[filename]
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = re.sub(r'(className="(?:img-zoom|nh-cat-img)")', r'\1' + dim, content)
    
    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)
print("Done")
