-- Reference data only — the service layer uses inline constants, not DB queries.
-- Useful for auditing and documentation.

CREATE TABLE tax_brackets (
  id            serial PRIMARY KEY,
  year          int    NOT NULL,
  filing_status text   NOT NULL CHECK (filing_status IN ('single', 'married_joint')),
  min_income    numeric(12,2) NOT NULL,
  max_income    numeric(12,2),          -- NULL means no upper bound (top bracket)
  rate          numeric(5,3) NOT NULL
);

-- 2024 federal brackets — single
INSERT INTO tax_brackets (year, filing_status, min_income, max_income, rate) VALUES
  (2024, 'single',  0,        11600,  0.100),
  (2024, 'single',  11600,    47150,  0.120),
  (2024, 'single',  47150,    100525, 0.220),
  (2024, 'single',  100525,   191950, 0.240),
  (2024, 'single',  191950,   243725, 0.320),
  (2024, 'single',  243725,   609350, 0.350),
  (2024, 'single',  609350,   NULL,   0.370);

-- 2024 federal brackets — married filing jointly
INSERT INTO tax_brackets (year, filing_status, min_income, max_income, rate) VALUES
  (2024, 'married_joint',  0,       23200,  0.100),
  (2024, 'married_joint',  23200,   94300,  0.120),
  (2024, 'married_joint',  94300,   201050, 0.220),
  (2024, 'married_joint',  201050,  383900, 0.240),
  (2024, 'married_joint',  383900,  487450, 0.320),
  (2024, 'married_joint',  487450,  731200, 0.350),
  (2024, 'married_joint',  731200,  NULL,   0.370);
