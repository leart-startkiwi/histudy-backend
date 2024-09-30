CREATE TABLE user_progress (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(36) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  course_id INT,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  content_id INT,
  FOREIGN KEY (content_id) REFERENCES course_contents(id) ON DELETE SET NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


