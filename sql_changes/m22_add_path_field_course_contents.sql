ALTER TABLE course_contents
ADD COLUMN path VARCHAR(255) 

ALTER TABLE course_contents
ADD COLUMN content_type VARCHAR CHECK(content_type = "video" or content_type = "article"),
ADD COLUMN file_name VARCHAR

ALTER TABLE course_contents
ADD COLUMN duration DECIMAL(4,2)w