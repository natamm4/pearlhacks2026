CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE location_data (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city            text         NOT NULL,
  state_abbr      char(2)      NOT NULL,
  updated_at      timestamptz  DEFAULT now(),
  rpp_index       numeric(6,3),
  avg_rent_1br    numeric(10,2),
  avg_rent_2br    numeric(10,2),
  avg_utilities   numeric(8,2),
  avg_groceries   numeric(8,2),
  avg_transport   numeric(8,2),
  state_income_tax_rate  numeric(5,3) DEFAULT 0,
  has_local_tax   boolean      DEFAULT false,
  local_tax_rate  numeric(5,3) DEFAULT 0,
  UNIQUE(city, state_abbr)
);

CREATE INDEX idx_location_city  ON location_data (city);
CREATE INDEX idx_location_state ON location_data (state_abbr);
