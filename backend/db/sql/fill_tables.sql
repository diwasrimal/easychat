-- Inserting users
INSERT INTO users(fullname, email, password_hash) VALUES
	('Ram Poudel', 'ram@gmail.com', '$2a$10$vT5JwJLYO6O7Tg5sIMeca.6MIKQGpybEwiLwWvo4n5Ae.TUMeG73y'), -- ram (bcrypted with default cost)
	('Shyam Acharya', 'shyam@gmail.com', '$2a$10$kvRD/jewfMPNt3oMKMGPpe9Hz6pTbWOI1GTfEqT9KsZw160WR5TZO'), -- shyam
	('Hari Rai', 'hari@gmail.com', '$2a$10$U32d4KQn4nR.vBEcHKIwt.WS3DGU16SRlNUSg4pDO3iqAzX23aKfO'), -- hari
	('Mohan Devkota', 'mohan@gmail.com', '$2a$10$bonHqtMXx4V6q550CE4AwuhPx5kF2RPCf7QqJZLSdd9aguVfbn4Ta'), -- mohan
	('Rita Gurung', 'rita@gmail.com', '$2a$10$v49I8/eiUOf.u6jflGiFw.zSlIB0NLbJFB8yB7PZbAUllxPc737bC'), -- rita
	('Sita Thapa', 'sita@gmail.com', '$2a$10$abcde1J9A9uE6s.bZk5X8e.pQ8e12cAzlt8JLMdG.6JPhj4lFJ7Te'), -- sita
	('Gita Sharma', 'gita@gmail.com', '$2a$10$abcdef2J4H5O8s.Ck6J9gk.qP8f14cCzmt8JMLfH.6JPhj4nFJ7Tf'), -- gita
	('John Doe', 'john@gmail.com', '$2a$10$ghijk3J5B6O9t.Dl7K0hi.rQ9g16eEczmu9KOLhG.7QRej5oGH8Vh'), -- john
	('Jane Smith', 'jane@gmail.com', '$2a$10$lmnop4J6C7P1u.Fm8L1jk.sR1h18gGdzmv9LMNhH.8RShi6pIJ9Wi'); -- jane

-- Inserting messages
INSERT INTO messages (sender_id, receiver_id, text, timestamp) VALUES
	(1, 2, 'Hey Shyam, want to go hiking this weekend?', '2024-05-25 14:23:00+00'),
	(2, 1, 'Sure Ram, sounds great!', '2024-05-25 14:25:00+00'),
	(1, 2, 'Awesome! I found a new trail we can explore.', '2024-05-25 14:30:00+00'),
	(2, 1, 'That sounds exciting! How long is the trail?', '2024-05-25 14:32:00+00'),
	(1, 2, 'It''s about 5 miles round trip, with some great views.', '2024-05-25 14:35:00+00'),
	(2, 1, 'Perfect, I can bring some snacks for us.', '2024-05-25 14:37:00+00'),
	(1, 2, 'Great! I''ll bring the water and my camera.', '2024-05-25 14:40:00+00'),
	(2, 1, 'Cool, what time should we meet?', '2024-05-25 14:42:00+00'),
	(1, 2, 'How about 8 AM at the trailhead?', '2024-05-25 14:45:00+00'),
	(2, 1, 'Sounds good to me. See you then!', '2024-05-25 14:47:00+00'),
	(1, 2, 'By the way, did you finish that project at work?', '2024-05-25 15:00:00+00'),
	(2, 1, 'Yes, finally! It took forever, but I''m glad it''s done.', '2024-05-25 15:05:00+00'),
	(1, 2, 'Congrats! I know you worked hard on it.', '2024-05-25 15:10:00+00'),
	(2, 1, 'Thanks, Ram. Your support means a lot.', '2024-05-25 15:15:00+00'),
	(1, 2, 'Anytime, Shyam. Friends always have each other''s backs.', '2024-05-25 15:20:00+00'),
	(2, 1, 'Absolutely.', '2024-05-25 15:25:00+00'),
	(2, 1, 'By the way, have you seen the new movie out?', '2024-05-25 15:27:00+00'),
	(1, 2, 'Not yet, but I heard it''s really good. Want to watch it together?', '2024-05-25 15:30:00+00'),
	(2, 1, 'Sure, let''s plan for next weekend.', '2024-05-25 15:35:00+00'),
	(1, 2, 'Perfect. I''ll check the showtimes and let you know.', '2024-05-25 15:40:00+00'),
	(2, 1, 'Sounds like a plan. Talk to you later!', '2024-05-25 15:45:00+00'),
	(1, 3, 'Hi Hari, do you have any new photo tips?', '2024-05-25 15:00:00+00'),
	(3, 1, 'Hey Ram, I do! Let''s chat more.', '2024-05-25 15:05:00+00'),
	(4, 5, 'Rita, have you heard the new album by XYZ?', '2024-05-25 16:10:00+00'),
	(5, 4, 'Yes, Mohan!', '2024-05-25 16:15:00+00'),
	(5, 4, 'It''s amazing!', '2024-05-25 16:20:00+00'),
	(1, 6, 'Hey Sita, how are you doing?', '2024-05-26 10:00:00+00'),
	(6, 1, 'Hi Ram, I''m good! How about you?', '2024-05-26 10:05:00+00'),
	(1, 6, 'I''m great, thanks for asking. Any plans for the weekend?', '2024-05-26 10:10:00+00'),
	(6, 1, 'Not yet, but I''m thinking about visiting some friends.', '2024-05-26 10:15:00+00'),
	(1, 6, 'That sounds fun! Have a great time.', '2024-05-26 10:20:00+00'),
	(1, 7, 'Hi Gita, do you have any book recommendations?', '2024-05-26 11:00:00+00'),
	(7, 1, 'Hey Ram, sure! I recently read "The Alchemist" and it''s fantastic.', '2024-05-26 11:05:00+00'),
	(1, 7, 'I''ve heard about it. I''ll definitely check it out. Thanks!', '2024-05-26 11:10:00+00'),
	(1, 8, 'Hello John, how''s work going?', '2024-05-26 12:00:00+00'),
	(8, 1, 'Hi Ram, work is busy but good. How about you?', '2024-05-26 12:05:00+00'),
	(1, 8, 'Same here. Keeping busy with some new projects.', '2024-05-26 12:10:00+00'),
	(1, 9, 'Hi Jane, have you finished that book we discussed?', '2024-05-26 13:00:00+00'),
	(9, 1, 'Hey Ram, yes I did. It was really interesting.', '2024-05-26 13:05:00+00'),
	(1, 9, 'Glad to hear that! Let''s discuss it sometime.', '2024-05-26 13:10:00+00');

-- Inserting conversations
INSERT INTO conversations (user1_id, user2_id, timestamp) VALUES
	(1, 2, '2024-05-25 15:45:00+00'),
	(1, 3, '2024-05-25 15:05:00+00'),
	(4, 5, '2024-05-25 16:15:00+00'),
	(1, 6, '2024-05-26 10:20:00+00'),
	(1, 7, '2024-05-26 11:10:00+00'),
	(1, 8, '2024-05-26 12:10:00+00'),
	(1, 9, '2024-05-26 13:10:00+00')
	ON CONFLICT (LEAST(user1_id, user2_id), GREATEST(user1_id, user2_id))
	DO UPDATE SET timestamp = excluded.timestamp;
