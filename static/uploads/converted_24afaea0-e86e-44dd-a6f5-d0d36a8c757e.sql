```sql
-- Création d'un type personnalisé ENUM
CREATE TYPE status_enum AS ENUM ('pending', 'approved', 'rejected');

-- Création d'une table avec des contraintes complexes
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    amount DECIMAL(10, 2),
    discount DECIMAL(5, 2) DEFAULT 0,
    CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    UNIQUE (order_date, customer_id)
);

-- Création d'une fonction pour calculer les totaux
DELIMITER $$
CREATE FUNCTION calculate_total(order_id INT) RETURNS DECIMAL(10, 2)
BEGIN
    DECLARE total DECIMAL(10, 2);
    SELECT SUM(amount) INTO total
    FROM order_items
    WHERE order_id = order_id;
    RETURN total;
END$$
DELIMITER ;

-- Création d'une vue utilisant la fonction
CREATE VIEW order_totals AS
SELECT o.order_id, calculate_total(o.order_id) AS total_amount
FROM orders o;

-- Création d'un déclencheur pour mettre à jour le total dans la table des commandes
DELIMITER $$
CREATE TRIGGER after_order_item_insert
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE orders
    SET amount = calculate_total(NEW.order_id)
    WHERE order_id = NEW.order_id;
END$$
DELIMITER ;
```