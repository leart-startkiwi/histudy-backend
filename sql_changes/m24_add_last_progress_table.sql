CREATE TABLE last_progress(
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(36),
  course_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  CONSTRAINT unique_user_last_progress UNIQUE(course_id, user_id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE last_progress
ADD COLUMN content_id INT;

ALTER TABLE last_progress
ADD CONSTRAINT fk_content_id
FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE;

ALTER TABLE questions
DROP COLUMN reply


ALTER TABLE upvotes
ADD CONSTRAINT unique_question_upvote
UNIQUE (user_id, question_id);

ALTER TABLE course_contents
ADD COLUMN text JSON

