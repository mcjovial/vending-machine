const request = require("supertest");
const User = require("../models/user.model");
const app = require("../_helpers/express");
const { connectDB } = require("./setup");

// Connect to Mongoose
beforeAll(async () => {
  await connectDB();
});

// afterAll(async () => disconnectDb());

describe("User tests", () => {
  let buyer;

  beforeEach(async () => {
    buyer = {
      username: "daisy",
      password: "123456",
      role: "buyer",
    };

    await User.remove({});
  });

  describe("PUT /api/user/:id", () => {
    it("should update user when its :id is passed and details sent", async () => {
      let response = await request(app).post("/api/user/register").send(buyer);
      expect(response.status).toBe(201);

      const new_username = { username: "dawali66" };
      response = await request(app)
        .put(`/api/user/${response.body.id}`)
        .set("Authorization", `Bearer ${response.body.token}`)
        .send(new_username);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining(new_username));
    });

    it("should report error when a mismatching user id is sent", async () => {
      let response = await request(app).post("/api/user/register").send(buyer);
      expect(response.status).toBe(201);

      buyer.username = 'james'
      let second_user_response = await request(app).post("/api/user/register").send(buyer);
      expect(second_user_response.status).toBe(201);

      const new_username = { username: "dawali66" };
      response = await request(app)
        .put(`/api/user/${second_user_response.body.id}`)
        .set("Authorization", `Bearer ${response.body.token}`)
        .send(new_username);
      expect(response.status).toBe(400);
      expect(response.body.message).toEqual('Sorry you can not update someone elses info');
    });
    it("should report error when a mismatching user id is sent", async () => {
      let response = await request(app).post("/api/user/register").send(buyer);
      expect(response.status).toBe(201);

      const new_username = { username: "dawali66" };
      response = await request(app)
        .put(`/api/user/12345`)
        .set("Authorization", `Bearer ${response.body.token}`)
        .send(new_username);
      expect(response.status).toBe(400);
      expect(response.body.message).toEqual('Invalid User Id');
    });
    it("should update user when its :id is passed and details sent", async () => {
      let response = await request(app).post("/api/user/register").send(buyer);
      expect(response.status).toBe(201);

      const new_username = { password: "dawa" };
      response = await request(app)
        .put(`/api/user/${response.body.id}`)
        .set("Authorization", `Bearer ${response.body.token}`)
        .send(new_username);
      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(
        expect.stringContaining('"password" length must be at least 6 characters long')
      );
    });
  });

});
