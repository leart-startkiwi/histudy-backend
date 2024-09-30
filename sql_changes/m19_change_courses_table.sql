ALTER TABLE courses
MODIFY COLUMN teacher VARCHAR(36);


ALTER TABLE courses
ADD CONSTRAINT fk_teacher_user_id
FOREIGN KEY (teacher) REFERENCES users(id)
ON DELETE SET NULL;


ALTER TABLE courses
DROP column video_link

ALTER TABLE courses
DROP column reviews

ALTER TABLE courses
DROP column students

ALTER TABLE courses
DROP column lessons

ALTER TABLE courses
DROP column runtime

ALTER TABLE courses
DROP column ratings