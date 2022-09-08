const request = require("supertest");
const User = require("../models/user.model");
const app = require("../_helpers/express");
const { connectDB } = require("./setup");

// Connect to Mongoose
beforeAll(async () => {
  await connectDB();
});

// afterAll(async () => disconnectDb());

describe("POST /deposit", () => {
  let buyer;

  beforeEach(async () => {
    buyer = {
      username: "daisy",
      password: "123456",
      role: "buyer",
    };

    await User.remove({});
  });

  it("should return a deposit balance greater or equal to amount deposited when request is successful", async () => {
    // create new buyer
    const buyer_response = await request(app)
      .post("/api/user/register")
      .send(buyer);
    expect(buyer_response.status).toBe(201);

    const amount = { deposit: 100 };
    const deposit_response = await request(app)
      .put("/api/user")
      .set("Authorization", `Bearer ${buyer_response.body.token}`)
      .send(amount);

    expect(deposit_response.status).toBe(200);
    expect(deposit_response.body.deposit).toBeGreaterThanOrEqual(
      amount.deposit
    );
  });

  it("should report error if the amount deposited does not match any of the acceptable coins => [5, 10, 20, 50, 100]", async () => {
    // create new buyer
    const buyer_response = await request(app)
      .post("/api/user/register")
      .send(buyer);
    expect(buyer_response.status).toBe(201);

    const amount = { deposit: 60 };
    const deposit_response = await request(app)
      .put("/api/user")
      .set("Authorization", `Bearer ${buyer_response.body.token}`)
      .send(amount);

    expect(deposit_response.status).toBe(400);
    expect(deposit_response.body.message).toBe(
      "Deposit can only be 5,10,20,50,100"
    );
  });

  it("should report error if the inputed value is not a number", async () => {
    // create new buyer
    const buyer_response = await request(app)
      .post("/api/user/register")
      .send(buyer);
    expect(buyer_response.status).toBe(201);

    const amount = { deposit: "" };
    const deposit_response = await request(app)
      .put("/api/user")
      .set("Authorization", `Bearer ${buyer_response.body.token}`)
      .send(amount);

    expect(deposit_response.status).toBe(400);
    expect(deposit_response.body.message).toEqual(
      expect.stringContaining('"deposit" must be a number')
    );
  });
});
