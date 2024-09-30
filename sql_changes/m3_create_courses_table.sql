CREATE TABLE courses(
  id INT PRIMARY KEY AUTO_INCREMENT,
  description VARCHAR(255) NOT NULL,
  teacher VARCHAR(255) NOT NULL DEFAULT "Ridvan Aliu",
  video_link VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL CHECK(status = "free" or status = "paid" or status = "locked" or status = "subscription"),
  price DECIMAL(4,2),
  ratings DECIMAL(4,2),
  language VARCHAR(255) NOT NULL,
  skillLevel VARCHAR(255) NOT NULL CHECK(skillLevel = "beginner" or skillLevel = "intermediate" or skillLevel = "advanced" or skillLevel = "expert"),
  certificate BOOLEAN NOT NULL,
  runtime DECIMAL(5,2),
  lessons INT,
  students INT,
  reviews INT,
  cover VARCHAR(255) NOT NULL,
  categoryId INT,
  FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
);