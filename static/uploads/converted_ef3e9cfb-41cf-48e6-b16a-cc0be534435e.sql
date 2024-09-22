```sql
-- Créer une base de données
CREATE DATABASE animaux_db;

-- Créer une table pour stocker des informations sur les animaux
CREATE TABLE animaux (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Identifiant unique auto-incrémenté
    nom VARCHAR(100) NOT NULL,  -- Nom de l'animal
    espece VARCHAR(50) NOT NULL,  -- Espèce de l'animal
    age INT NOT NULL CHECK (age >= 0)  -- Âge de l'animal (doit être un nombre positif)
);

-- Insérer des données dans la table animaux
INSERT INTO animaux (nom, espece, age) VALUES 
('Alice', 'Chat', 3),
('Apollo', 'Chien', 5),
('Aristote', 'Cheval', 7),
('Bella', 'Chien', 4),
('Amigo', 'Oiseau', 2);

-- Sélectionner tous les animaux
SELECT * FROM animaux;

-- Sélectionner tous les animaux dont le nom commence par "A"
SELECT * FROM animaux WHERE nom LIKE 'A%';

-- Mettre à jour l'âge d'un animal (exemple: changer l'âge de "Apollo")
UPDATE animaux SET age = 6 WHERE nom = 'Apollo';

-- Supprimer un animal (exemple: supprimer "Amigo")
DELETE FROM animaux WHERE nom = 'Amigo';
```