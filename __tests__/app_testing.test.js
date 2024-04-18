const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  test("GET:200 Should send an array of topics to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(Object.keys(topic).length).toBe(2);
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
});

describe("/api", () => {
  test("GET:200 Should return object containing all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ text }) => {
        expect(typeof JSON.parse(text)).toEqual("object");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200: Returns the correct article by its ID", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.author).toBe("butter_bridge");
        expect(body.article.title).toBe("Living in the shadow of a great man");
        expect(body.article.article_id).toBe(1);
        expect(body.article.body).toBe("I find this existence challenging");
        expect(body.article.topic).toBe("mitch");
        expect(typeof body.article.created_at).toBe("string");
        expect(body.article.votes).toBe(100);
        expect(body.article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });

  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  });

  test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/notAnArticle")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("PATCH:200 updates the article votes correctly", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(1);
        expect(body.article.title).toBe("Living in the shadow of a great man");
        expect(body.article.topic).toBe("mitch");
        expect(body.article.author).toBe("butter_bridge");
        expect(body.article.body).toBe("I find this existence challenging");
        expect(typeof body.article.created_at).toBe("string");
        expect(body.article.votes).toBe(110);
        expect(body.article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("PATCH:400 Will return the correct error when given an invalid id", () => {
    return request(app)
      .patch("/api/articles/halfwayThere")
      .send({ inc_votes: 10 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH:404 Will return the correct error when given an valid id that doesnt exist", () => {
    return request(app)
      .patch("/api/articles/1000")
      .send({ inc_votes: 10 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("PATCH:400 Given wrong information responds with correct error", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "Wait this isnt a number" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200: returns all articles with correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(13);
        body.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.comment_count).toBe("number");
          expect(Object.keys(article).length).toBe(8);
        });
      });
  });
  test("GET 200: returns all articles with correct properties sorted by date(created_at)", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(13);
        expect(body).toBeSortedBy("created_at", { descending: true });
        body.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.comment_count).toBe("number");
          expect(Object.keys(article).length).toBe(8);
        });
      });
  });
});

describe("/api/articles/:article_Id/comments", () => {
  test("GET 200: returns the comments with correct properties and ordered with newest first", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(2);
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
        body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("GET 200: returns an empty array if atricle exist but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(0);
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid article id", () => {
    return request(app)
      .get("/api/articles/notAnArticle/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("POST:201 Should insert new comment ", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        username: "lurker",
        body: "Testing testing all day long",
      })
      .expect(201)
      .then(({ body }) => {
        expect(typeof body.comment.comment_id).toBe("number");
        expect(typeof body.comment.article_id).toBe("number");
        expect(typeof body.comment.body).toBe("string");
        expect(typeof body.comment.author).toBe("string");
        expect(typeof body.comment.votes).toBe("number");
        expect(typeof body.comment.created_at).toBe("string");
      });
  });
  test("POST:404 Should return the correct error if given article id that is valid but doesnt exist ", () => {
    return request(app)
      .post("/api/articles/1000/comments")
      .send({
        username: "lurker",
        body: "Testing testing all day long",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("POST:400 Should return the correct error if given article id that is invalid ", () => {
    return request(app)
      .post("/api/articles/badId/comments")
      .send({
        username: "lurker",
        body: "Testing testing all day long",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST:400 Should return the correct error if posted information is insufficient", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        username: "lurker",
        wrongKey: "Testing testing all day long",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE:204 deletes the correct comment by comment_id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("DELETE:404 reutrns the correct error when receives a valid id that does not exist", () => {
    return request(app)
      .delete("/api/comments/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });

  test("DELETE:400 reutrns the correct error when receives a invalid id", () => {
    return request(app)
      .delete("/api/comments/helphelp")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
