-- Stahlé admin data model
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  collection TEXT NOT NULL,
  room TEXT NOT NULL,
  materials TEXT NOT NULL DEFAULT '[]',
  dimensions TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT 'Precio por confirmar',
  images TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  product_type TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  measurements TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Pendiente' CHECK(status IN ('Pendiente','En proceso','Cotizada','Cerrada')),
  amount TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE INDEX IF NOT EXISTS quotes_status_idx ON quotes(status);
CREATE INDEX IF NOT EXISTS products_collection_idx ON products(collection);
CREATE INDEX IF NOT EXISTS products_room_idx ON products(room);
