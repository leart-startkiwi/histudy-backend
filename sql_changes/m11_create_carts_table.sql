CREATE TABLE carts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(36),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  course_id INT,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);