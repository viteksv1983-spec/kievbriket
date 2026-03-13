<?php
/**
 * Direct SQLite seeder for brikety, vugillya products and category images.
 * Bypasses Passenger/Python entirely by writing directly to the SQLite DB.
 */

header('Content-Type: application/json; charset=utf-8');

$db_path = '/home/leadgin/kievdrova.com.ua/www/backend/sql_app.db';

if (!file_exists($db_path)) {
    echo json_encode(['error' => 'DB not found at ' . $db_path]);
    exit;
}

try {
    $pdo = new PDO("sqlite:$db_path");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $results = [];
    
    // 1. Fix category images
    $images = [
        ['drova', '/media/categories/firewood.webp'],
        ['brikety', '/media/categories/briquettes.webp'],
        ['vugillya', '/media/categories/coal.webp'],
    ];
    foreach ($images as $img) {
        $stmt = $pdo->prepare("UPDATE category_metadata SET image_url = ? WHERE slug = ?");
        $stmt->execute([$img[1], $img[0]]);
        $results['images'][$img[0]] = $stmt->rowCount() . ' rows updated';
    }
    
    // 2. Check existing products per category
    $stmt = $pdo->query("SELECT category, COUNT(*) as cnt FROM products GROUP BY category");
    $counts = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $counts[$row['category']] = (int)$row['cnt'];
    }
    $results['existing_counts'] = $counts;
    
    // Helper to generate UUID
    function gen_uuid() {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff), mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
    
    // 3. Seed brikety if empty
    if (($counts['brikety'] ?? 0) == 0) {
        $brikety = [
            ['Брикети RUF', 'ruf-brikety', 12000, '/media/products/ruf.webp', 'Брикети RUF — ефективне паливо з пресованої тирси. Теплотворність 4800-5200 ккал/кг.', 'Деревна тирса', 'До 10%'],
            ['Брикети Pini Kay', 'pini-kay-brikety', 13000, '/media/products/pinikay.webp', 'Брикети Pini Kay — преміум восьмигранні брикети з центральним каналом.', 'Тирса твердих порід', 'До 8%'],
            ['Брикети Nestro', 'nestro-brikety', 8500, '/media/products/ruf.webp', 'Брикети Nestro — циліндричні брикети без хімічних добавок.', 'Деревна тирса', 'До 12%'],
            ['Торфобрикети', 'torfobriket', 9500, '/media/products/coal_ao.webp', 'Торфобрикети — доступне паливо з тривалим горінням.', 'Пресований торф', 'До 15%'],
            ['Углеродні брикети', 'uglerodni-brikety', 14000, '/media/products/coal_as.webp', 'Углеродні брикети — максимальна теплотворність 7000-7500 ккал/кг.', 'Деревне вугілля пресоване', 'До 5%'],
            ['Пелети', 'pelleti', 15500, '/media/products/pinikay.webp', 'Пелети — паливо для автоматизованих котельних систем.', 'Деревна тирса', 'До 8%'],
        ];
        
        $inserted = 0;
        $stmt = $pdo->prepare("INSERT INTO products (id, name, slug, price, image_url, description, category, ingredients, shelf_life, is_available, weight, stock_quantity) VALUES (?, ?, ?, ?, ?, ?, 'brikety', ?, ?, 1, 1.0, 0)");
        foreach ($brikety as $p) {
            $stmt->execute([gen_uuid(), $p[0], $p[1], $p[2], $p[3], $p[4], $p[5], $p[6]]);
            $inserted++;
        }
        $results['brikety'] = "Inserted $inserted products";
    } else {
        $results['brikety'] = "Already has " . ($counts['brikety'] ?? 0) . " products, skipped";
    }
    
    // 4. Seed vugillya if empty
    if (($counts['vugillya'] ?? 0) == 0) {
        $vugillya = [
            ['Вугілля ДГ', 'vugillya-dg', 7000, '/media/products/coal_ao.webp', 'Вугілля ДГ (довгополуменеве газове) — доступне паливо для побутового опалення.', 'Кам\'яне вугілля марки ДГ', 'Без обмежень'],
            ['Антрацит АМ 13-25', 'antratsyt-am-13-25', 9500, '/media/products/coal_as.webp', 'Антрацит АМ — преміум вугілля для автоматичних котлів. Теплотворність до 7500 ккал/кг.', 'Антрацит фракція 13-25 мм', 'Без обмежень'],
            ['Антрацит орех АО 25-50', 'antratsyt-ao-25-50', 10000, '/media/products/coal_ao.webp', 'Антрацит АО — універсальне вугілля для побутових котлів.', 'Антрацит фракція 25-50 мм', 'Без обмежень'],
            ['Антрацит крупний орех АКО 25-100', 'antratsyt-ako-25-100', 11000, '/media/products/coal_as.webp', 'Антрацит АКО — для потужних котлів з тривалим горінням.', 'Антрацит фракція 25-100 мм', 'Без обмежень'],
            ['Вугілля газове', 'vugillya-gazove', 7500, '/media/products/coal_ao.webp', 'Газове вугілля — надійне паливо з легким розпалом.', 'Кам\'яне вугілля газових марок', 'Без обмежень'],
            ['Вугілля деревне', 'vugillya-derevne', 6000, '/media/products/coal_as.webp', 'Деревне вугілля — натуральне паливо для мангалів та печей.', 'Деревне вугілля з твердих порід', 'Без обмежень'],
        ];
        
        $inserted = 0;
        $stmt = $pdo->prepare("INSERT INTO products (id, name, slug, price, image_url, description, category, ingredients, shelf_life, is_available, weight, stock_quantity) VALUES (?, ?, ?, ?, ?, ?, 'vugillya', ?, ?, 1, 1.0, 0)");
        foreach ($vugillya as $p) {
            $stmt->execute([gen_uuid(), $p[0], $p[1], $p[2], $p[3], $p[4], $p[5], $p[6]]);
            $inserted++;
        }
        $results['vugillya'] = "Inserted $inserted products";
    } else {
        $results['vugillya'] = "Already has " . ($counts['vugillya'] ?? 0) . " products, skipped";
    }
    
    // 5. Final verification
    $stmt = $pdo->query("SELECT category, COUNT(*) as cnt FROM products GROUP BY category");
    $final_counts = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $final_counts[$row['category']] = (int)$row['cnt'];
    }
    $results['final_counts'] = $final_counts;
    
    // Category images verification
    $stmt = $pdo->query("SELECT slug, name, image_url FROM category_metadata");
    $cats = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $cats[] = $row;
    }
    $results['categories'] = $cats;
    
    echo json_encode($results, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
