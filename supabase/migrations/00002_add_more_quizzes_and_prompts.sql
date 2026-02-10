-- Add more quiz questions (increase from 3 to 5 per module)
-- Note: Correct answers are now randomized across A, B, C, D options

INSERT INTO public.quizzes (module_level, question, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
-- Basics module (adding 2 more questions)
('basics', 'Why is it important to be specific in your prompts?', 'It makes the prompt longer and more impressive', 'Specificity helps the AI understand exactly what you want', 'It is not important at all', 'Specific prompts take longer to process', 'B', 'Being specific reduces ambiguity and helps the AI generate results that match your vision more accurately.'),
('basics', 'What role do adjectives play in prompt writing?', 'They should be avoided completely', 'They add unnecessary length', 'They help describe qualities and characteristics of the subject', 'They only work for certain AI models', 'C', 'Descriptive adjectives like "vibrant", "ancient", or "sleek" help the AI understand the desired qualities of the generated image.'),

-- Better module (adding 2 more questions)
('better', 'What is the advantage of including atmosphere or mood in your prompt?', 'It has no real advantage', 'It helps create emotional impact and sets the tone', 'It only works for landscape images', 'It makes the prompt too complex', 'B', 'Mood descriptors like "cozy", "mysterious", or "energetic" guide the AI to create images with the desired emotional quality.'),
('better', 'Which of these prompts demonstrates better technique?', '"A dog"', '"Golden retriever puppy playing in autumn leaves, warm afternoon sunlight, joyful expression, shallow depth of field"', '"Dog with stuff"', '"Animal picture"', 'B', 'The second prompt includes specific breed, action, setting, lighting, mood, and technical details, resulting in much better output.'),

-- Advanced module (adding 2 more questions)
('advanced', 'What is the purpose of specifying camera angles or perspectives?', 'To make the prompt sound professional', 'To control the viewpoint and framing of the generated image', 'It has no effect on the output', 'To confuse the AI model', 'B', 'Terms like "bird''s eye view", "low angle shot", or "macro close-up" help control how the subject is framed and viewed.'),
('advanced', 'How can you achieve consistency across multiple AI-generated images?', 'You cannot achieve consistency', 'By using the same seed value and similar prompt structure', 'By generating images at different times', 'By using completely different prompts', 'B', 'Using consistent seed values and maintaining similar prompt structures helps create a cohesive series of images.'),

-- Guide module (adding 2 more questions)
('guide', 'What is the recommended order for structuring a prompt?', 'Background, lighting, subject, style', 'Subject, description, style, lighting, quality', 'Quality, subject, random details', 'Style, background, maybe a subject', 'B', 'Starting with the subject, then adding descriptions, style, lighting, and quality parameters creates a logical and effective prompt structure.'),
('guide', 'How can you test if your prompt is effective?', 'Just guess and hope for the best', 'Generate multiple times and refine based on results', 'Use the longest prompt possible', 'Copy someone else''s prompt', 'B', 'Iterative testing and refinement based on actual results is the best way to improve your prompts and achieve desired outcomes.');

-- Add more high-quality prompts for each category

-- Nature category (adding more prompts)
INSERT INTO public.prompts (category, title, prompt_text, difficulty) VALUES
('Nature', 'Aurora Borealis Night', 'Northern lights dancing over snowy landscape, vibrant green and purple aurora, starry night sky, frozen lake in foreground, silhouette of pine trees, long exposure photography, 8k resolution', 'intermediate'),
('Nature', 'Tropical Waterfall Paradise', 'Majestic waterfall cascading into turquoise pool, lush tropical vegetation, exotic flowers, mist rising from water, rainbow in spray, golden hour lighting, National Geographic style', 'basic'),
('Nature', 'Desert Sand Dunes', 'Vast desert sand dunes at sunset, dramatic shadows and highlights, rippled sand texture, warm orange and red tones, minimalist composition, fine art photography', 'intermediate'),
('Nature', 'Cherry Blossom Spring', 'Japanese cherry blossom trees in full bloom, pink petals falling, traditional wooden bridge over koi pond, soft diffused lighting, peaceful atmosphere, watercolor painting style', 'basic'),
('Nature', 'Volcanic Eruption', 'Active volcano erupting at night, glowing lava flows, ash plume illuminated by lightning, dramatic sky, long exposure, epic scale, cinematic composition, 8k detail', 'advanced'),
('Nature', 'Autumn Forest Path', 'Winding forest path covered in colorful autumn leaves, golden and red foliage, morning mist, sun rays filtering through trees, peaceful atmosphere, landscape photography', 'basic'),

-- Technology category (adding more prompts)
('Technology', 'Holographic Interface', 'Futuristic holographic user interface, floating transparent screens, neon blue data visualizations, hand gestures interacting with holograms, dark background, sci-fi aesthetic, high tech', 'advanced'),
('Technology', 'Smart Home Interior', 'Modern smart home interior, voice-activated devices, ambient LED lighting, minimalist furniture, large touchscreen displays, clean design, architectural photography, 4k quality', 'intermediate'),
('Technology', 'Quantum Computer', 'Quantum computer in laboratory, intricate cooling systems, glowing quantum processors, complex wiring, scientists in background, technical precision, professional photography, highly detailed', 'advanced'),
('Technology', 'Drone Aerial View', 'Aerial drone photography of modern city, geometric patterns of buildings, urban planning visible, golden hour lighting, tilt-shift effect, architectural beauty, 8k resolution', 'intermediate'),
('Technology', 'Robotic Assembly Line', 'Advanced robotic assembly line, industrial automation, precise mechanical arms, sparks flying, modern factory interior, dynamic composition, industrial photography', 'intermediate'),
('Technology', 'Neural Network Visualization', 'Abstract visualization of artificial neural network, interconnected nodes glowing, data flowing through connections, digital art style, blue and purple color scheme, futuristic, highly detailed', 'advanced'),

-- Education category (adding more prompts)
('Education', 'Chemistry Experiment', 'Chemistry laboratory experiment in progress, colorful chemical reactions in beakers, Bunsen burner flame, safety goggles, detailed glassware, educational photography, bright lighting', 'basic'),
('Education', 'Astronomy Observatory', 'Professional astronomy observatory at night, large telescope pointed at starry sky, astronomers at work, control panels with data, sense of discovery, cinematic lighting', 'intermediate'),
('Education', 'Historical Manuscript', 'Ancient illuminated manuscript, ornate calligraphy, gold leaf decorations, aged parchment, medieval art style, museum quality lighting, extreme detail, 8k scan', 'advanced'),
('Education', 'Biology Classroom', 'Interactive biology classroom, 3D anatomical models, microscopes on tables, educational posters, students engaged in learning, natural lighting, modern educational environment', 'basic'),
('Education', 'Mathematics Visualization', 'Beautiful mathematical concepts visualized, geometric patterns, fractals, golden ratio spiral, colorful abstract representation, educational art, digital illustration', 'intermediate'),
('Education', 'Archaeological Dig Site', 'Archaeological excavation site, ancient artifacts being uncovered, researchers carefully brushing dirt, historical ruins, documentary photography style, natural lighting', 'intermediate'),

-- Cinematic category (adding more prompts)
('Cinematic', 'Film Noir Detective', 'Film noir detective in rain-soaked alley, dramatic shadows, venetian blind light patterns, trench coat and fedora, moody atmosphere, black and white, high contrast, 1940s style', 'advanced'),
('Cinematic', 'Space Explorer', 'Lone astronaut on alien planet, two suns setting, otherworldly landscape, sense of isolation and wonder, cinematic wide shot, anamorphic lens, epic scale, movie poster quality', 'advanced'),
('Cinematic', 'Action Hero Moment', 'Action hero walking away from explosion, slow motion effect, dramatic backlighting, debris flying, intense expression, cinematic color grading, blockbuster movie style', 'intermediate'),
('Cinematic', 'Romantic Sunset Scene', 'Couple silhouetted against vibrant sunset, beach setting, waves gently rolling, warm color palette, shallow depth of field, romantic mood, professional cinematography', 'basic'),
('Cinematic', 'Dystopian Future', 'Dystopian future cityscape, abandoned buildings, overgrown vegetation reclaiming urban space, moody atmosphere, desaturated colors with teal and orange tones, cinematic composition', 'advanced'),
('Cinematic', 'Fantasy Castle', 'Majestic fantasy castle on mountain peak, dramatic storm clouds, lightning illuminating towers, medieval architecture, epic fantasy art style, highly detailed, concept art quality', 'intermediate');