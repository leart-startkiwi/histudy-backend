UPDATE categories
SET name = 'default_value'
WHERE name IS NULL;

ALTER TABLE categories
MODIFY COLUMN name VARCHAR(255) NOT NULL UNIQUE;