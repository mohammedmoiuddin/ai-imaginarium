-- Update some quiz questions to have varied correct answers
-- This provides better data integrity even though frontend shuffles the display

-- Update some basics questions to have different correct answers
UPDATE quizzes 
SET 
  option_a = option_b,
  option_b = option_a,
  correct_option = 'A'
WHERE module_level = 'basics' 
  AND question LIKE '%specific in your prompts%';

UPDATE quizzes 
SET 
  option_c = option_b,
  option_b = option_c,
  correct_option = 'C'
WHERE module_level = 'basics' 
  AND question LIKE '%role do adjectives play%';

-- Update some better questions
UPDATE quizzes 
SET 
  option_d = option_b,
  option_b = option_d,
  correct_option = 'D'
WHERE module_level = 'better' 
  AND question LIKE '%atmosphere or mood%';

UPDATE quizzes 
SET 
  option_a = option_b,
  option_b = option_a,
  correct_option = 'A'
WHERE module_level = 'better' 
  AND question LIKE '%demonstrates better technique%';

-- Update some advanced questions
UPDATE quizzes 
SET 
  option_c = option_b,
  option_b = option_c,
  correct_option = 'C'
WHERE module_level = 'advanced' 
  AND question LIKE '%camera angles or perspectives%';

UPDATE quizzes 
SET 
  option_d = option_b,
  option_b = option_d,
  correct_option = 'D'
WHERE module_level = 'advanced' 
  AND question LIKE '%consistency across multiple%';

-- Update some guide questions
UPDATE quizzes 
SET 
  option_a = option_b,
  option_b = option_a,
  correct_option = 'A'
WHERE module_level = 'guide' 
  AND question LIKE '%recommended order for structuring%';

UPDATE quizzes 
SET 
  option_c = option_b,
  option_b = option_c,
  correct_option = 'C'
WHERE module_level = 'guide' 
  AND question LIKE '%test if your prompt is effective%';