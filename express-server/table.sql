CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(100) NOT NULL,
  product_category VARCHAR(100) NOT NULL,
  product_description TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  product_stock INT NOT NULL DEFAULT 0,
  product_image VARCHAR(100) NOT NULL
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  customer_email VARCHAR(100) NOT NULL,
  total DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO products (product_name, product_category, product_description, product_price, product_stock, product_image) VALUES
('Fjallraven - Foldsack No. 1 Backpack', 'men clothing', 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday', 109.95, 561, 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'),
('Mens Casual Premium Slim Fit T-Shirts ', 'men clothing', 'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.', 22.3, 602, 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg'),
('Mens Cotton Jacket', 'men clothing', 'great outerwear jackets for Spring/Autumn/Winter, suitable for workout, outdoor activities, riding, sports, climb', 55.99, 433, 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg'),
('Mens Casual Slim Fit', 'women clothing', 'The color could be slightly different between on the screen and in practice.', 15.99, 1004, 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg'),
('Johnny Urban Caro  Bag', 'women clothing', 'Our Johnny Urban Caro bag in a chic black color. The water-repellent material protects the content from moisture.', 39.9, 222, 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg'),
('Solid Gold Petite Micropave', 'jewelery', 'Rose Gold Necklace, 14K Solid Gold Petite Micropave Set With 0.14Ct Round Diamonds', 168.99, 920, 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg'),
('White Gold Plated Princess', 'jewelery', 'Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Engagement, Wedding.', 9.99, 963, 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg'),
('Pierced Owl Rose Gold Plated', 'jewelery', 'Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel', 10.99, 407, 'https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg'),
('WD 2TB Elements Portable External Hard Drive', 'electronics', 'USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS', 64.0, 750, 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg'),
('SanDisk SSD PLUS 1TB Internal SSD', 'electronics', 'Easy upgrade for faster boot-up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5” hard drive. Based on published specifications and internal benchmarking tests', 109.0, 684, 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg');

