ALTER TABLE likes
ADD CONSTRAINT unique_user_course
UNIQUE (user_id, course_id);


ALTER TABLE carts
ADD CONSTRAINT unique_user_cart
UNIQUE (user_id, course_id);


ALTER TABLE courses_assigned
ADD CONSTRAINT unique_user_course_assigned
UNIQUE (user_id, course_id);
