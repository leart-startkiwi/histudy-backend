ALTER TABLE courses
ADD COLUMN intented_learners JSON,
ADD COLUMN outcomes JSON,
ADD COLUMN requirements JSON

ALTER TABLE courses
ADD COLUMN published BOOLEAN DEFAULT FALSE


ALTER TABLE courses
ADD COLUMN landing_page JSON


