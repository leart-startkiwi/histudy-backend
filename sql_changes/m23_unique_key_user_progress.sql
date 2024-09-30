ALTER TABLE user_progress
ADD CONSTRAINT unique_user_course_content
UNIQUE (user_id, course_id, content_id);

ALTER TABLE reviews
ADD CONSTRAINT unique_user_review
UNIQUE (user_id, course_id);

ALTER TABLE course_contents
MODIFY COLUMN duration decimal(6,2)