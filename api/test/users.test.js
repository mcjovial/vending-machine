const request = require("supertest");
const User = require("../models/user.model");
const { connectDB, disconnectDb } = require("../_helpers/db");
const app = require("../_helpers/express");

// Connect to Mongoose
beforeAll(async () => {
  await connectDB();
});

// afterAll(async () => disconnectDb());

describe("User tests", () => {
  let seller;
  let buyer;
  let user;

  beforeEach(async () => {
    user = {
      username: "new_user",
      password: "mypassword",
      role: "seller",
    };

    seller = {
      username: "mcjovial",
      password: "mypassword",
      role: "seller",
    };

    buyer = {
      username: "daisy",
      password: "123456",
      role: "buyer",
    };

    await User.remove({});
    await User.create(user);
  });

  describe("POST /api/user/register", () => {
    it("should register a new user when request is ok", async () => {
      let response = await request(app).post("/api/user/register").send(buyer);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("username");
      expect(response.body).toHaveProperty("role");
      delete buyer.password;
      expect(response.body).toEqual(expect.objectContaining(buyer));
    });
  });

  describe("POST /api/user/login", () => {
    it("should login a new customer when request is ok", async () => {
      let response = await request(app).post("/api/user/register").send(buyer);
      expect(response.status).toBe(201);

      delete buyer.role;
      response = await request(app).post("/api/user/login").send(buyer);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("username");
      expect(response.body).toHaveProperty("role");
      delete buyer.password;
      expect(response.body).toEqual(expect.objectContaining(buyer));
    });
  });

  describe("GET /api/user", () => {
    it("should return a list of all users when request is ok", async () => {
      let response = await request(app).post("/api/user/register").send(buyer);
      expect(response.status).toBe(201);

      response = await request(app)
        .get("/api/user")
        .set("Authorization", `Bearer ${response.body.token}`);
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });

  describe("GET /api/user/:id", () => {
    it("should return one user when its :id is passed", async () => {
      let response = await request(app).post("/api/user/register").send(buyer);
      expect(response.status).toBe(201);

      response = await request(app)
        .get(`/api/user/${response.body.id}`)
        .set("Authorization", `Bearer ${response.body.token}`);
      expect(response.status).toBe(200);
      delete buyer.password;
      expect(response.body).toEqual(expect.objectContaining(buyer));
    });
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
  });

  describe("PUT /api/user/", () => {
    it("should update user deposit when amount is sent", async () => {
      let response = await request(app).post("/api/user/register").send(buyer);
      expect(response.status).toBe(201);

      const amount = { deposit: 50 };
      response = await request(app)
        .put("/api/user")
        .set("Authorization", `Bearer ${response.body.token}`)
        .send(amount);

      expect(response.status).toBe(200);
      expect(response.body.deposit).toBeGreaterThanOrEqual(amount.deposit);
    });
  });

  describe("POST /api/user/reset", () => {
    it("should reset user deposit to 0 when request is sent", async () => {
      let response = await request(app).post("/api/user/register").send(buyer);
      expect(response.status).toBe(201);

      const amount = { deposit: 50 };
      response = await request(app)
        .post("/api/user/reset")
        .set("Authorization", `Bearer ${response.body.token}`);

      expect(response.status).toBe(200);
      expect(response.body.deposit).toBe(0);
    });
  });

  describe("DEL /api/user/:id", () => {
    it("should delete one user when its :id is passed", async () => {
      let response = await request(app).post("/api/user/register").send(buyer);
      expect(response.status).toBe(201);

      response = await request(app)
        .delete(`/api/user/${response.body.id}`)
        .set("Authorization", `Bearer ${response.body.token}`);
      expect(response.status).toBe(200);
    });
  });
});
