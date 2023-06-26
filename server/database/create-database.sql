


/******************************************************FILES*********************************************/

CREATE TABLE file_type (
    file_type_id INT(11) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

INSERT INTO file_type (name, description) VALUES ('DNI', ''); 
INSERT INTO file_type (name, description) VALUES ('IMAGE', '');
INSERT INTO file_type (name, description) VALUES ('COVER', '');
INSERT INTO file_type (name, description) VALUES ('ALTA', '');
INSERT INTO file_type (name, description) VALUES ('CUOTA', '');
INSERT INTO file_type (name, description) VALUES ('RECIBO', '');



CREATE TABLE files (
    file_id INT(11) NOT NULL AUTO_INCREMENT,
    file_name VARCHAR(255) NOT NULL,
    reference_id VARCHAR(36) DEFAULT NULL,
    file_type_id INT(11) NOT NULL,
    document_url VARCHAR(255) NOT NULL,
    policy VARCHAR(25) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL,
    INDEX idf_reference_id (reference_id),
    PRIMARY KEY (file_id),
    FOREIGN KEY (file_type_id) REFERENCES file_type (file_type_id)
);

/******************************************************FILES*********************************************/

/******************************************************USERS*********************************************/
CREATE TABLE roles (
role_id INT(11) AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
description TEXT
);

INSERT INTO roles (name, description) VALUES ('sys', 'usuario sin permisos');
INSERT INTO roles (name, description) VALUES ('admin', 'administrador del sistema');
INSERT INTO roles (name, description) VALUES ('user', 'usuario del erp');
INSERT INTO roles (name, description) VALUES ('partner', 'usuario de la app para socios');

CREATE TABLE users (
user_id VARCHAR(36) PRIMARY KEY,
password VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
role_id INT(11) NOT NULL,
active TINYINT(1) NOT NULL DEFAULT 0,
password_last_reset DATETIME DEFAULT NULL,
    user_created VARCHAR(36) DEFAULT NULL,
    user_updated VARCHAR(36) DEFAULT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at datetime DEFAULT NULL,
    INDEX users_email (email),
FOREIGN KEY (role_id) REFERENCES roles(role_id),
  FOREIGN KEY (user_created) REFERENCES users(user_id),
  FOREIGN KEY (user_updated) REFERENCES users(user_id)
);

CREATE TABLE `password_history` (
  password_id INT(11) NOT NULL AUTO_INCREMENT,
  password VARCHAR(255) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  PRIMARY KEY (password_id),
  FOREIGN KEY (user_id) REFERENCES users (user_id)
);
/******************************************************USERS*********************************************/

/******************************************************PARTNERS*********************************************/
CREATE TABLE partner_type (
   partner_type_id INT(11) NOT NULL AUTO_INCREMENT,
   name VARCHAR(255) NOT NULL,
   PRIMARY KEY (partner_type_id)
);

INSERT INTO partner_type (name) VALUES ('Usuario');
INSERT INTO partner_type (name) VALUES ('Directiva');
INSERT INTO partner_type (name) VALUES ('Colaborador');
INSERT INTO partner_type (name) VALUES ('Honorario');
INSERT INTO partner_type (name) VALUES ('Fundador');


CREATE TABLE partners (
  partner_id VARCHAR(36) PRIMARY KEY,
  access_code VARCHAR(36) DEFAULT NULL,
  number INT(11) NOT NULL,
  name VARCHAR(255) NOT NULL,
  surname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address VARCHAR(255) NOT NULL,
  dni VARCHAR(25) NOT NULL,
  birth_date datetime NOT NULL,
  leaves datetime DEFAULT NULL,
  cannabis_month DECIMAL(10, 2) NOT NULL,
  hash_month DECIMAL(10, 2) NOT NULL,
  extractions_month DECIMAL(10, 2) NOT NULL,
  others_month DECIMAL(10, 2) NOT NULL,
  partner_type_id INT(11) NOT NULL,
  therapeutic TINYINT(1) DEFAULT 0,
  active TINYINT(1) DEFAULT 1,
  fee INT(11) NOT NULL,
  inscription INT(11) NOT NULL,
  cash DECIMAL(10, 2) DEFAULT 0,
  debt_limit DECIMAL(10, 2) DEFAULT 0,
  user_created VARCHAR(36) DEFAULT NULL,
  user_updated VARCHAR(36) DEFAULT NULL,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  FOREIGN KEY (partner_type_id) REFERENCES partner_type(partner_type_id),
  FOREIGN KEY (fee) REFERENCES fees_type(fees_type_id),
  FOREIGN KEY (inscription) REFERENCES fees_type(fees_type_id),
  FOREIGN KEY (user_created) REFERENCES users(user_id),
  FOREIGN KEY (user_updated) REFERENCES users(user_id),
  INDEX partners_name (name),
  INDEX surname_name (surname),
  INDEX partners_acces_code (access_code),
  INDEX partners_number (number)
) AUTO_INCREMENT=20;

CREATE TABLE fees_type (
    fees_type_id INT(11) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('fees', 'inscription') NOT NULL,
    amount decimal(10,2) DEFAULT 0
);

INSERT INTO fees_type (name, description, type, amount) VALUES ('CUOTA_20', 'Cuota anual de 20€', 'fees', 20);
INSERT INTO fees_type (name, description, type,amount) VALUES ('CUOTA_EXENTA', 'Cuota anual exenta', 'fees', 0);
INSERT INTO fees_type (name, description, type,amount) VALUES ('INSCRIPCION_EXENTA','inscripción exenta', 'inscription', 0);
INSERT INTO fees_type (name, description, type,amount) VALUES ('INSCRIPCION_20','inscripción de 20€', 'inscription', 20);
INSERT INTO fees_type (name, description, type,amount) VALUES ('INSCRIPCION_10','inscripción de 10€', 'inscription', 10);

CREATE TABLE fees(
    fee_id INT(11) AUTO_INCREMENT PRIMARY KEY,
    partner_id  VARCHAR(36) NOT NULL,
    fees_type_id INT(11) NOT NULL,
    expiration datetime DEFAULT NULL,
    paid datetime DEFAULT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at datetime DEFAULT NULL,
    FOREIGN KEY (fees_type_id) REFERENCES fees_type(fees_type_id),
    FOREIGN KEY (partner_id) REFERENCES partners (partner_id)       
);

    CREATE TABLE sanctions (
  sanction_id INT(11) PRIMARY KEY AUTO_INCREMENT,
  partner_id VARCHAR(36) NOT NULL,
  severity TINYINT(1)  NOT NULL,
  description TEXT, 
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at datetime DEFAULT NULL, 
  user_created VARCHAR(36) DEFAULT NULL,
  user_updated VARCHAR(36) DEFAULT NULL,
  FOREIGN KEY (user_created) REFERENCES users(user_id),
  FOREIGN KEY (partner_id) REFERENCES partners(partner_id)
);
/******************************************************PARTNERS*********************************************/



/******************************************************PRODUCTOS*********************************************/
CREATE TABLE categories (
  category_id INT(11) PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  type ENUM('mancomunados', 'terceros') NOT NULL,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  INDEX categories_name (name)
);

INSERT INTO categories (name, type) VALUES ('Cannabis y derivados', 'mancomunados');
INSERT INTO categories (name, type) VALUES ('Bebidas', 'terceros');
INSERT INTO categories (name, type) VALUES ('Parafernalia', 'terceros');
INSERT INTO categories (name, type) VALUES ('Servicios', 'terceros');

CREATE TABLE subcategories (
  subcategory_id INT(11) PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category_id INT(11) NOT NULL,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  INDEX subcategories_name (name),
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

INSERT INTO subcategories (name, category_id) VALUES ('Sativa predominante', 1);
INSERT INTO subcategories (name, category_id) VALUES ('Indica predominante', 1);
INSERT INTO subcategories (name, category_id) VALUES ('Genética equilibrada', 1);
INSERT INTO subcategories (name, category_id) VALUES ('CBD Alto', 1);
INSERT INTO subcategories (name, category_id) VALUES ('THC Alto', 1);
INSERT INTO subcategories (name, category_id) VALUES ('Refrescos', 2);
INSERT INTO subcategories (name, category_id) VALUES ('Zumos', 2);
INSERT INTO subcategories (name, category_id) VALUES ('Cervezas', 2);


CREATE TABLE products (
  product_id VARCHAR(36) PRIMARY KEY,
  code VARCHAR(36) NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 0,
  name VARCHAR(255) NOT NULL,
  type ENUM('mancomunados', 'terceros') NOT NULL,
  category_id INT(11),
  description TEXT,
  cost_price DECIMAL(10,2) DEFAULT 0,
  sale_price DECIMAL(10,2) DEFAULT 0,
  sativa DECIMAL(5, 2) DEFAULT 0,
  indica DECIMAL(5, 2) DEFAULT 0,
  thc DECIMAL(5, 2) DEFAULT 0,
  cbd DECIMAL(5, 2) DEFAULT 0,
  bank VARCHAR(255) DEFAULT NULL,
  flawour VARCHAR(255) DEFAULT NULL,
  effect VARCHAR(255) DEFAULT NULL,
  stock DECIMAL(10,2) DEFAULT 0,
  user_created VARCHAR(36) DEFAULT NULL,
  user_updated VARCHAR(36) DEFAULT NULL,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  INDEX products_name (name),
  INDEX products_code (code),
  FOREIGN KEY (user_created) REFERENCES users(user_id),
  FOREIGN KEY (user_updated) REFERENCES users(user_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);


CREATE TABLE product_subcategory (
  product_id VARCHAR(36),
  subcategory_id INT(11),
  PRIMARY KEY (product_id, subcategory_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id),
  FOREIGN KEY (subcategory_id) REFERENCES subcategories(subcategory_id)
);


CREATE TABLE ancestors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ancestor_id VARCHAR(36),
  product_id VARCHAR(36),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

/******************************************************PRODUCTOS*********************************************/






/******************************************************COMPRAS*********************************************/

CREATE TABLE providers (
provider_id VARCHAR(36) PRIMARY KEY,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
phone VARCHAR(20) NOT NULL,
address VARCHAR(255) NOT NULL,
type ENUM('mancomunados', 'terceros') NOT NULL,
user_created VARCHAR(36) DEFAULT NULL,
user_updated VARCHAR(36) DEFAULT NULL,
created_at datetime DEFAULT CURRENT_TIMESTAMP,
updated_at datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
deleted_at datetime DEFAULT NULL,
FOREIGN KEY (user_created) REFERENCES users(user_id),
FOREIGN KEY (user_updated) REFERENCES users(user_id),
INDEX providers_name (name)
);

CREATE TABLE harvests (
harvest_id VARCHAR(36) PRIMARY KEY,
code VARCHAR(36) NOT NULL,
product_id VARCHAR(36) NOT NULL,
provider_id VARCHAR(36) NOT NULL,
cost_price DECIMAL(10,2) DEFAULT 0,
sale_price DECIMAL(10,2) DEFAULT 0,
fee_amount DECIMAL(10,2) DEFAULT 0,
quantity DECIMAL(10,2) DEFAULT 0,
manicured DECIMAL(10,2) DEFAULT 0,
loss DECIMAL(10,2) DEFAULT 0,
notes TEXT,
user_created VARCHAR(36) DEFAULT NULL,
user_updated VARCHAR(36) DEFAULT NULL,
created_at datetime DEFAULT CURRENT_TIMESTAMP,
updated_at datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
deleted_at datetime DEFAULT NULL,
INDEX harvests_product_id (product_id),
FOREIGN KEY (provider_id) REFERENCES providers(provider_id),
FOREIGN KEY (product_id) REFERENCES products(product_id),
FOREIGN KEY (user_created) REFERENCES users(user_id),
FOREIGN KEY (user_updated) REFERENCES users(user_id)
);

CREATE TABLE purchases (
purchase_id VARCHAR(36) PRIMARY KEY,
code VARCHAR(36) NOT NULL,
provider_id VARCHAR(36)  NOT NULL,
total_amount DECIMAL(10,2) DEFAULT 0,
notes TEXT,
user_created VARCHAR(36) DEFAULT NULL,
user_updated VARCHAR(36) DEFAULT NULL,
created_at datetime DEFAULT CURRENT_TIMESTAMP,
updated_at datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
deleted_at datetime DEFAULT NULL,
INDEX purchases_provider_id (provider_id),
FOREIGN KEY (provider_id) REFERENCES providers(provider_id),
FOREIGN KEY (user_created) REFERENCES users(user_id),
FOREIGN KEY (user_updated) REFERENCES users(user_id)
);


CREATE TABLE purchase_details (
purchase_detail_id INT(11)  AUTO_INCREMENT PRIMARY KEY,
purchase_id VARCHAR(36) NOT NULL,
product_id VARCHAR(36) NOT NULL,
quantity DECIMAL(10,2)  DEFAULT 0,
amount DECIMAL(10, 2) DEFAULT 0,
INDEX purchase_details_product_id (product_id),
INDEX purchase_details_purchase_id (purchase_id),
FOREIGN KEY (purchase_id) REFERENCES purchases(purchase_id),
FOREIGN KEY (product_id) REFERENCES products(product_id)
);

/******************************************************COMPRAS*********************************************/

/****************************************************** VENTAS*********************************************/

CREATE TABLE sales (
sale_id VARCHAR(36) PRIMARY KEY,
code VARCHAR(36) NOT NULL,
partner_id VARCHAR(36) NOT NULL,
total_amount DECIMAL(10, 2),
tax DECIMAL(5, 2),
notes TEXT,
discount DECIMAL(10, 2),
user_created VARCHAR(36) DEFAULT NULL,
user_updated VARCHAR(36) DEFAULT NULL,
created_at datetime DEFAULT CURRENT_TIMESTAMP,
updated_at datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
deleted_at datetime DEFAULT NULL,
INDEX sales_partner_id (partner_id),
FOREIGN KEY (partner_id) REFERENCES partners(partner_id),
FOREIGN KEY (user_created) REFERENCES users(user_id),
FOREIGN KEY (user_updated) REFERENCES users(user_id)
);


CREATE TABLE sale_details (
sale_detail_id INT(11)  AUTO_INCREMENT PRIMARY KEY,
sale_id VARCHAR(36) NOT NULL,
product_id VARCHAR(36)  NOT NULL,
harvest_id VARCHAR(36)  DEFAULT NULL,
quantity DECIMAL(10,2) DEFAULT 0,
amount DECIMAL(10, 2) DEFAULT 0,
INDEX sale_details_product_id (product_id),
INDEX sale_details_sale_id (sale_id),
FOREIGN KEY (sale_id) REFERENCES sales(sale_id),
FOREIGN KEY (product_id) REFERENCES products(product_id)
);
/****************************************************** VENTAS*********************************************/

/******************************************************GASTOS E INGRESOS*********************************************/

CREATE TABLE transactions (
transaction_id VARCHAR(36) PRIMARY KEY,
code VARCHAR(36) NOT NULL,
amount DECIMAL(10,2) NOT NULL,
notes TEXT,
transaction_type_id INT(11) NOT NULL,
recurrence_days INT(11) DEFAULT NULL,
recurrence_times INT(11) DEFAULT NULL,
date_start DATETIME DEFAULT NULL,
interest DECIMAL(10,2) DEFAULT 0,
user_created VARCHAR(36) DEFAULT NULL,
user_updated VARCHAR(36) DEFAULT NULL,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
deleted_at DATETIME DEFAULT NULL,
FOREIGN KEY (user_created) REFERENCES users(user_id),
FOREIGN KEY (user_updated) REFERENCES users(user_id),
FOREIGN KEY (transaction_type_id) REFERENCES transaction_type(transaction_type_id)
);

CREATE TABLE transaction_type (
transaction_type_id INT(11) AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
description TEXT,
transaction_category ENUM('GASTO', 'INGRESO') NOT NULL
);

INSERT INTO transaction_type (name, description, transaction_category) VALUES ('INGRESO_CUOTA', '', 'INGRESO'); 
INSERT INTO transaction_type (name, description, transaction_category) VALUES ('INGRESO_INSCRIPCION', '', 'INGRESO'); 
INSERT INTO transaction_type (name, description, transaction_category) VALUES ('INGRESO_CUENTA_SOCIO', '', 'INGRESO');
INSERT INTO transaction_type (name, description, transaction_category) VALUES ('INGRESOS_DONACIONES', '', 'INGRESO');
INSERT INTO transaction_type (name, description, transaction_category) VALUES ('INGRESOS_PRESTAMOS', '', 'INGRESO');

INSERT INTO transaction_type (name, description, transaction_category) VALUES ('GASTOS_ALQUILER', '', 'GASTO'); 
INSERT INTO transaction_type (name, description, transaction_category) VALUES ('GASTOS_SERVICIOS', '', 'GASTO'); 
INSERT INTO transaction_type (name, description, transaction_category) VALUES ('GASTOS_ACTIVIDADES_ASOCIACION', '', 'GASTO');
INSERT INTO transaction_type (name, description, transaction_category) VALUES ('GASTOS_PRESTAMOS', '', 'GASTO');
INSERT INTO transaction_type (name, description, transaction_category) VALUES ('REINTEGRO_CUENTA_SOCIO', '', 'GASTO');
INSERT INTO transaction_type (name, description, transaction_category) VALUES ('REINTEGRO_CUOTA', '', 'GASTO');
INSERT INTO transaction_type (name, description, transaction_category) VALUES ('REINTEGRO_INSCRIPCION', '', 'GASTO');




/******************************************************GASTOS E INGRESOS*********************************************/



/******************************************************PAGOS Y COBROS*********************************************/


CREATE TABLE payments (
    payment_id INT(11) AUTO_INCREMENT PRIMARY KEY,
    type ENUM('PAGO', 'COBRO') NOT NULL,
    reference_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    notes TEXT,
    user_created VARCHAR(36) DEFAULT NULL,
    user_updated VARCHAR(36) DEFAULT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at datetime DEFAULT NULL,
    INDEX idx_reference_id (reference_id),
    FOREIGN KEY (user_created) REFERENCES users(user_id),
    FOREIGN KEY (user_updated) REFERENCES users(user_id)
);

/******************************************************PAGOS Y COBROS*********************************************/
















































*********************************************************************+

SUPUESTO DE DEUDA
Por supuesto, te detallo los pasos que se seguirían para registrar el movimiento que planteas en la base de datos:

Primero, se registraría la compra del producto por parte del socio en la tabla "compras". Se crearía un registro con la información de la compra, incluyendo el id del socio que realizó la compra, la fecha y hora de la transacción, la cantidad y el costo del producto.

Luego, se actualizaría el registro del socio en la tabla "socios", disminuyendo su saldo en la cantidad correspondiente al costo del producto comprado.

Si el socio no paga por el producto en el momento de la compra, se mantendría su saldo actualizado con la deuda pendiente.

Si el socio decide pagar su deuda en el futuro, se registraría un ingreso en la tabla "ingresos", indicando el id del socio que realizó el pago, la fecha y hora de la transacción, el concepto del pago (por ejemplo, "pago de deuda de compra") y la cantidad ingresada.

Finalmente, se actualizaría el registro del socio en la tabla "socios", aumentando su saldo en la cantidad correspondiente al pago realizado y disminuyendo su deuda pendiente en la misma cantidad.


Sí, te recomendaría tener tablas diferenciadas para compras, gastos y pagos. De esta manera, se pueden mantener registros separados y detallados de cada transacción, lo que hace que la contabilidad sea más clara y precisa.

Un ejemplo de cómo podrías estructurar las tablas en la base de datos podría ser:

Tabla "Compras": que contenga información sobre cada compra realizada en la asociación, incluyendo el proveedor, la cantidad, el precio y la fecha de compra.

Tabla "Gastos": que contenga información sobre todos los gastos fijos de la asociación, como el alquiler, los servicios públicos, los salarios del personal, etc.

Tabla "Pagos": que contenga información sobre cada pago que se realiza a proveedores, empleados y otros acreedores de la asociación.

Un ejemplo de cómo podrías utilizar estas tablas en la práctica sería el siguiente:

La asociación compra una cantidad de cannabis a un proveedor, pero decide dejar la compra a deber.
Se registra esta compra en la tabla "Compras" con la información correspondiente.
Luego, la asociación paga el alquiler de la sede de la asociación.
Se registra este gasto en la tabla "Gastos" con la información correspondiente.
Un miembro de la asociación paga la cantidad adeudada por la compra de cannabis.
Se registra este pago en la tabla "Pagos" con la información correspondiente.
Por último, se registra en la tabla "Ingresos" el pago recibido, que se suma al resto de los ingresos de la asociación.
Volviendo al desarrollo de nuestar app, de la que te recuerdo que es una aplicaión servidor para montar una API REST para la que estamos utilizando arquitectura hexagonal. Su esructura de carpetas es src/modules/entidad/ y dentro de cada entidad las subcarpetas de infra, domain y aplicacion, Tb tenemos una carpeta src/modules/shared/ que dispone de las mismas subcarpetas:


