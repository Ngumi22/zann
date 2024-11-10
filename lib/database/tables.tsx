import { getConnection } from "./dbSetup";

export async function setupTables() {
  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    // Categories Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
          category_id INT AUTO_INCREMENT PRIMARY KEY,
          category_name VARCHAR(255) NOT NULL UNIQUE,
          category_description TEXT,
          parent_id INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (parent_id) REFERENCES categories(category_id) ON DELETE SET NULL,
          INDEX idx_category_name (category_name)
      );
    `);

    // Products Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
          product_id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          sku VARCHAR(50) NOT NULL UNIQUE,
          price DECIMAL(10, 2),
          stock_quantity INT DEFAULT 0,
          discount DECIMAL(10, 2) DEFAULT 0.00,
          status ENUM('Draft', 'Pending', 'Approved') DEFAULT 'Draft',
          category_id INT,
          brand_id INT,
          main_image MEDIUMBLOB NOT NULL, 
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
          FOREIGN KEY (brand_id) REFERENCES brands(brand_id),
          INDEX idx_product_name (name),
          INDEX idx_product_category (category_id)
      );
    `);

    // Brands Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS brands (
        brand_id INT AUTO_INCREMENT PRIMARY KEY,
        brand_name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_name (brand_name)
      ) ENGINE=InnoDB CHARSET=utf8mb4;
    `);

    // Suppliers Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS suppliers (
        supplier_id INT AUTO_INCREMENT PRIMARY KEY,
        supplier_name VARCHAR(255) NOT NULL,
        supplier_email VARCHAR(255) NOT NULL UNIQUE,
        supplier_phone_number VARCHAR(255) NOT NULL,
        supplier_location TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_name (supplier_name)
      ) ENGINE=InnoDB CHARSET=utf8mb4;
    `);

    // Customers Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS customers (
        customer_id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        contact_info JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB CHARSET=utf8mb4;
    `);

    // Tags Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tags (
          tag_id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Product Tags Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_tags (
          product_tag_id INT AUTO_INCREMENT PRIMARY KEY,
          product_id INT,
          tag_id INT,
          FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
          FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE,
          UNIQUE INDEX idx_product_tag (product_id, tag_id)
      );
    `);

    // Orders Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        order_id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT,
        total_price DECIMAL(10, 2) NOT NULL,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('pending', 'shipped', 'delivered', 'canceled') DEFAULT 'pending',
        shipping_address JSON,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
        INDEX idx_customer (customer_id)
      ) ENGINE=InnoDB CHARSET=utf8mb4;
    `);

    // Order Items Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        order_item_id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT,
        product_id INT,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(order_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id),
        INDEX idx_order (order_id),
        INDEX idx_product (product_id)
      ) ENGINE=InnoDB CHARSET=utf8mb4;
    `);

    // Admin Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        admin_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('admin', 'manager', 'viewer') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP DEFAULT NULL,
        INDEX idx_username (username)
      ) ENGINE=InnoDB CHARSET=utf8mb4;
    `);

    // Product Reviews Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_reviews (
        review_id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT,
        customer_id INT,
        rating INT CHECK (rating BETWEEN 1 AND 5),
        review_text TEXT,
        review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(product_id),
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
        INDEX idx_product (product_id),
        INDEX idx_customer (customer_id)
      ) ENGINE=InnoDB CHARSET=utf8mb4;
    `);

    // Carousels Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS carousels (
          carousel_id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Carousel Items Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS carousel_items (
          item_id INT AUTO_INCREMENT PRIMARY KEY,
          carousel_id INT,
          image_path VARCHAR(255) NOT NULL,
          alt_text VARCHAR(255),
          text_content TEXT,
          button_text VARCHAR(100),
          button_link VARCHAR(255),
          button_style JSON,
          position INT DEFAULT 0,
          FOREIGN KEY (carousel_id) REFERENCES carousels(carousel_id) ON DELETE CASCADE,
          INDEX idx_carousel (carousel_id)
      );
    `);

    // Banners Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS banners (
          banner_id INT AUTO_INCREMENT PRIMARY KEY,
          image_path VARCHAR(255) NOT NULL,
          alt_text VARCHAR(255),
          link_url VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Inventory Logs Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS inventory_logs (
        log_id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT,
        change_amount INT NOT NULL,
        change_type ENUM('purchase', 'sale', 'return', 'adjustment') NOT NULL,
        change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        admin_id INT,
        FOREIGN KEY (product_id) REFERENCES products(product_id),
        FOREIGN KEY (admin_id) REFERENCES admin_users(admin_id),
        INDEX idx_product (product_id),
        INDEX idx_admin (admin_id)
      ) ENGINE=InnoDB CHARSET=utf8mb4;
    `);

    // Settings Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS settings (
        setting_key VARCHAR(255) PRIMARY KEY,
        setting_value JSON NOT NULL,
        INDEX idx_key (setting_key)
      ) ENGINE=InnoDB CHARSET=utf8mb4;
    `);

    // Audit Logs Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        log_id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT,
        action VARCHAR(255) NOT NULL,
        log_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        affected_table VARCHAR(50),
        affected_id INT,
        previous_values JSON, -- Stores previous values for audits
        new_values JSON,      -- Stores new values for audits
        FOREIGN KEY (admin_id) REFERENCES admin_users(admin_id),
        INDEX idx_admin (admin_id),
        INDEX idx_affected_table (affected_table)
      ) ENGINE=InnoDB CHARSET=utf8mb4;
    `);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error("Error setting up tables:", error);
    throw error;
  } finally {
    connection.release();
  }
}
