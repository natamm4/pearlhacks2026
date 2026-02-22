CREATE TABLE standard_deductions (
  year          int  NOT NULL,
  filing_status text NOT NULL,
  amount        numeric(10,2) NOT NULL,
  PRIMARY KEY (year, filing_status)
);

INSERT INTO standard_deductions (year, filing_status, amount) VALUES
  (2024, 'single',        14600.00),
  (2024, 'married_joint', 29200.00);
