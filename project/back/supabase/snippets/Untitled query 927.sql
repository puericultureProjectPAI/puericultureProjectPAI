SELECT p.id, p.category, pt.product_id
FROM products p
LEFT JOIN product_troc pt
ON p.id = pt.product_id
WHERE p.id = 3;