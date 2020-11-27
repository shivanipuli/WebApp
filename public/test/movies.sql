   DROP TABLE IF EXISTS movies;
   DROP TABLE IF EXISTS genres;
   DROP TABLE IF EXISTS genreratings;
  create table genres(genre_id INT, name VARCHAR(100), primary key(genre_id));
  create table genreratings(genre_id INT, rate DOUBLE, primary key(genre_id));
  create table movies(movie_id VARCHAR(100), genre INT, rating DOUBLE, count INT, primary key(movie_id));
  insert into genres(genre_id, name) values (1, 'Disney');
  insert into genres(genre_id, name) values (2, 'Horror');
  insert into genres(genre_id, name) values (3, 'Romance');
  insert into genres(genre_id, name) values (4, 'Action');
  
insert into movies(movie_id, rating, count, genre) values ('Frozen', 0.0, 0, (select genre_id from genres where name='Disney'));
insert into movies(movie_id, rating, count, genre) values ('Tangled', 0.0, 0, (select genre_id from genres where name='Disney'));
insert into movies(movie_id, rating, count, genre) values ('Cinderella', 0.0, 0, (select genre_id from genres where name='Disney'));
insert into movies(movie_id, rating, count, genre) values ('Conjuring', 0.0, 0, (select genre_id from genres where name='Horror'));
insert into movies(movie_id, rating, count, genre) values ('Sinister', 0.0, 0, (select genre_id from genres where name='Horror'));
insert into movies(movie_id, rating, count, genre) values ('Sinister 2', 0.0, 0, (select genre_id from genres where name='Horror'));
insert into movies(movie_id, rating, count, genre) values ('Chuckie', 0.0, 0, (select genre_id from genres where name='Horror'));
insert into movies(movie_id, rating, count, genre) values ('Die Hard', 0.0, 0, (select genre_id from genres where name='Action'));
insert into movies(movie_id, rating, count, genre) values ('Jason Bourne', 0.0, 0, (select genre_id from genres where name='Action'));
insert into movies(movie_id, rating, count, genre) values ('Mission Impossible', 0.0, 0, (select genre_id from genres where name='Action'));
insert into movies(movie_id, rating, count, genre) values ('Central Intelligence', 0.0, 0, (select genre_id from genres where name='Action'));
insert into movies(movie_id, rating, count, genre) values ('Notebook', 0.0, 0, (select genre_id from genres where name='Romance'));
insert into movies(movie_id, rating, count, genre) values ('Casablanca', 0.0, 0, (select genre_id from genres where name='Romance'));
insert into movies(movie_id, rating, count, genre) values ('Love Actually', 0.0, 0, (select genre_id from genres where name='Romance'));

genre_id	name
1	Disney
2	Horror
3	Romance
4	Action

movie_id	genre	rating	count
Casablanca	3	0	0
Central Intelligence	4	0	0
Chuckie	2	0	0
Cinderella	1	0	0
Conjuring	2	0	0
Die Hard	4	0	0
Frozen	1	0	0
Jason Bourne	4	0	0
Love Actually	3	0	0
Mission Impossible	4	0	0
Notebook	3	0	0
Sinister	2	0	0
Sinister 2	2	0	0
Tangled	1	3.2	6


select * from genres join movies on genres.genre_id=movies.genre;
genre_id	name	movie_id	genre	rating	count
3	Romance	Casablanca	3	2.4999999999999996	12
4	Action	Central Intelligence	4	3.1052631578947367	19
2	Horror	Chuckie	2	0	0
1	Disney	Cinderella	1	0	1
2	Horror	Conjuring	2	0	0
4	Action	Die Hard	4	0	0
1	Disney	Frozen	1	0	0
4	Action	Jason Bourne	4	5	1
3	Romance	Love Actually	3	0	0
4	Action	Mission Impossible	4	3	1
3	Romance	Notebook	3	0	0
2	Horror	Sinister	2	3.1666666666666665	6
2	Horror	Sinister 2	2	0	0
1	Disney	Tangled	1	2.766666666666667	12

select genre_id, avg(rating) from genres join movies on genres.genre_id=movies.genre group by genre_id;
genre_id	avg(rating)
1	0.9222222222222224
2	0.7916666666666666
3	0.8205128205128203
4	2.776315789473684
