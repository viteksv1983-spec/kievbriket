<?php
// seed_db.php
try {
    $db_path = __DIR__ . '/db/sql_app.db';
    if (!file_exists($db_path)) {
        die("Database file not found at $db_path");
    }
    
    // Connect to SQLite DB
    $pdo = new PDO("sqlite:" . $db_path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Category Data
    $categories = [
        [
            'slug' => 'drova',
            'name' => 'Дрова',
            'description' => 'Якісні колоті дрова твердих порід з доставкою по Києву та області.',
            'icon' => 'TreePine'
        ],
        [
            'slug' => 'brikety',
            'name' => 'Брикети',
            'description' => 'Ефективні паливні брикети RUF, Pini Kay та Nestro для тривалого горіння.',
            'icon' => 'Box'
        ],
        [
            'slug' => 'vugillya',
            'name' => 'Вугілля',
            'description' => 'Висококалорійне кам\'яне вугілля в мішках для котлів та печей.',
            'icon' => 'Flame'
        ]
    ];
    
    // Check if table exists
    $result = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name='category_metadata'");
    if (!$result->fetch()) {
        die("Table category_metadata does not exist. FastAPI hasn't created it yet.");
    }
    
    $added = 0;
    $stmt = $pdo->prepare("INSERT INTO category_metadata (slug, name, description, icon) VALUES (:slug, :name, :description, :icon)");
    $check_stmt = $pdo->prepare("SELECT COUNT(*) FROM category_metadata WHERE slug = :slug");
    
    foreach ($categories as $cat) {
        $check_stmt->execute([':slug' => $cat['slug']]);
        $count = $check_stmt->fetchColumn();
        
        if ($count == 0) {
            $stmt->execute([
                ':slug' => $cat['slug'],
                ':name' => $cat['name'],
                ':description' => $cat['description'],
                ':icon' => $cat['icon']
            ]);
            $added++;
            echo "Seeded category: " . $cat['name'] . "<br>\n";
        } else {
            echo "Category already exists: " . $cat['name'] . "<br>\n";
        }
    }
    
    echo "Done. Inserted $added categories.<br>\n";
    
    // Also check products to see if they exist in the DB
    $prod_res = $pdo->query("SELECT slug, name, category FROM products LIMIT 5");
    echo "<br><b>Sample Products in DB:</b><br>";
    if ($prod_res) {
        while ($row = $prod_res->fetch(PDO::FETCH_ASSOC)) {
            echo "{$row['slug']} ({$row['category']}) - {$row['name']}<br>\n";
        }
    }
    
    // Products count
    $count_res = $pdo->query("SELECT COUNT(*) as c FROM products");
    if ($count_res) {
        $row = $count_res->fetch();
        echo "Total products: " . $row['c'] . "<br>\n";
    }

} catch (PDOException $e) {
    echo "Database Error: " . $e->getMessage() . "<br>\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "<br>\n";
}
?>
