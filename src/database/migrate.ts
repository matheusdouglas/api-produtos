import { client } from '../database/db';

const query = `
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    stock INT NOT NULL
  );
`;

const typeQuery = `
  CREATE TYPE movement_type AS ENUM ('entrada', 'saida', 'ajuste');
`;

const stockMovementsQuery = `
  CREATE TABLE IF NOT EXISTS stock_movements (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL, -- positivo para entrada, negativo para saída
    movement_type movement_type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;  

const triggerFunctionQuery = `
  CREATE OR REPLACE FUNCTION update_product_stock()
  RETURNS TRIGGER AS $$
  BEGIN
    IF (SELECT stock FROM products WHERE id = NEW.product_id) + NEW.quantity < 0 THEN
      RAISE EXCEPTION 'Estoque insuficiente';
    END IF;
    UPDATE products
    SET stock = stock + NEW.quantity
    WHERE id = NEW.product_id;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
`;

const triggerQuery = `
  DROP TRIGGER IF EXISTS trg_update_stock ON stock_movements;
  CREATE TRIGGER trg_update_stock
  AFTER INSERT ON stock_movements
  FOR EACH ROW
  EXECUTE PROCEDURE update_product_stock();
`;

async function createTable() {
    try {
        await client.connect();
        await client.query(query);
        await client.query(typeQuery);
        await client.query(stockMovementsQuery);
        await client.query(triggerFunctionQuery);
        await client.query(triggerQuery);
        console.log("Tabelas e trigger criadas com sucesso.");
    } catch (error: any) {
        console.error("Erro ao criar tabela:", error.message);
    } finally {
        await client.end();
    }
}

createTable();
