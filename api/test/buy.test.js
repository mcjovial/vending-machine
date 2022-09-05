const request = require("supertest");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const { connectDB, disconnectDb } = require("../_helpers/db");
const app = require("../_helpers/express");

// Connect to Mongoose
beforeAll(async () => {
  await connectDB();
});

// afterAll(async () => disconnectDb());

describe("POST /buy", () => {
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
    await Product.remove({});
  });

  it("should report 'Insufficient deposit' with error 400 when user deposit balance is less than gross product cost", async () => {
    // Create a new seller
    const seller_response = await request(app)
      .post("/api/user/register")
      .send(seller);
    expect(seller_response.status).toBe(201);
    console.log("seller", seller_response.body);

    const product = {
      productName: "cocacola",
      description: "black drink",
      cost: "35",
      amountAvailable: "9",
    };

    // create new product
    const product_response = await request(app)
      .post("/api/product")
      .set("Authorization", `Bearer ${seller_response.body.token}`)
      .send(product);
    expect(product_response.status).toBe(201);
    expect(product_response.body.message).toBe(
      "Product created successfully"
    );
    expect(product_response.body.product.productName).toEqual(
      product.productName
    );

    // create new buyer
    const buyer_response = await request(app)
      .post("/api/user/register")
      .send(buyer);
    expect(buyer_response.status).toBe(201);
    console.log("buyer", buyer_response.body);
    console.log("product", product_response.body.product._id);

    const order = { amount: 1 };
    // buy drink
    response = await request(app)
      .post(`/api/product/buy/${product_response.body.product._id}`)
      .set("Authorization", `Bearer ${buyer_response.body.token}`)
      .send(order);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `Insufficient Deposit Balance. Requires: $${
        order.amount * product_response.body.product.cost
      }. Available: $${buyer_response.body.deposit}`
    );
    console.log(response.error);
  });

  it("should report 'Insufficient product' with error 400 when ordered product count exceeds amount available", async () => {
    // Create a new seller
    const seller_response = await request(app)
      .post("/api/user/register")
      .send(seller);
    expect(seller_response.status).toBe(201);
    console.log("seller", seller_response.body);

    const product = {
      productName: "cocacola",
      description: "black drink",
      cost: "5",
      amountAvailable: "4",
    };

    // create new product
    const product_response = await request(app)
      .post("/api/product")
      .set("Authorization", `Bearer ${seller_response.body.token}`)
      .send(product);
    console.log(product_response.error);
    expect(product_response.status).toBe(201);
    expect(product_response.body.message).toBe(
      "Product created successfully"
    );
    expect(product_response.body.product.productName).toEqual(
      product.productName
    );

    // create new buyer
    const buyer_response = await request(app)
      .post("/api/user/register")
      .send(buyer);
    expect(buyer_response.status).toBe(201);
    console.log("buyer", buyer_response.body);
    console.log("product", product_response.body.product._id);

    const amount = { deposit: 100 };
    const deposit_response = await request(app)
      .put("/api/user")
      .set("Authorization", `Bearer ${buyer_response.body.token}`)
      .send(amount);

    expect(deposit_response.status).toBe(200);
    expect(deposit_response.body.deposit).toBeGreaterThanOrEqual(
      amount.deposit
    );

    const order = { amount: 6 };
    // buy drink
    response = await request(app)
      .post(`/api/product/buy/${product_response.body.product._id}`)
      .set("Authorization", `Bearer ${buyer_response.body.token}`)
      .send(order);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `Insufficient Product Numbers. Currently max: ${product_response.body.product.amountAvailable}`
    );
  });
  it("should report 'Product not available' with error 400 when ordered product's available count is 0", async () => {
    // Create a new seller
    const seller_response = await request(app)
      .post("/api/user/register")
      .send(seller);
    expect(seller_response.status).toBe(201);
    console.log("seller", seller_response.body);

    const product = {
      productName: "cocacola",
      description: "black drink",
      cost: "5",
      amountAvailable: "0",
    };

    // create new product
    const product_response = await request(app)
      .post("/api/product")
      .set("Authorization", `Bearer ${seller_response.body.token}`)
      .send(product);
    console.log(product_response.error);
    expect(product_response.status).toBe(201);
    expect(product_response.body.message).toBe(
      "Product created successfully"
    );
    expect(product_response.body.product.productName).toEqual(
      product.productName
    );

    // create new buyer
    const buyer_response = await request(app)
      .post("/api/user/register")
      .send(buyer);
    expect(buyer_response.status).toBe(201);
    console.log("buyer", buyer_response.body);
    console.log("product", product_response.body.product._id);

    const amount = { deposit: 100 };
    const deposit_response = await request(app)
      .put("/api/user")
      .set("Authorization", `Bearer ${buyer_response.body.token}`)
      .send(amount);

    expect(deposit_response.status).toBe(200);
    expect(deposit_response.body.deposit).toBeGreaterThanOrEqual(
      amount.deposit
    );

    const order = { amount: 6 };
    // buy drink
    response = await request(app)
      .post(`/api/product/buy/${product_response.body.product._id}`)
      .set("Authorization", `Bearer ${buyer_response.body.token}`)
      .send(order);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(`Sorry this Product Is Not Available`);
  });

  it("should report 'Product not available' with error 400 when ordered product's available count is 0", async () => {
    // Create a new seller
    const seller_response = await request(app)
      .post("/api/user/register")
      .send(seller);
    expect(seller_response.status).toBe(201);
    console.log("seller", seller_response.body);

    const product = {
      productName: "cocacola",
      description: "black drink",
      cost: "5",
      amountAvailable: "9",
    };

    // create new product
    const product_response = await request(app)
      .post("/api/product")
      .set("Authorization", `Bearer ${seller_response.body.token}`)
      .send(product);
    console.log(product_response.error);
    expect(product_response.status).toBe(201);
    expect(product_response.body.message).toBe(
      "Product created successfully"
    );
    expect(product_response.body.product.productName).toEqual(
      product.productName
    );

    // create new buyer
    const buyer_response = await request(app)
      .post("/api/user/register")
      .send(buyer);
    expect(buyer_response.status).toBe(201);
    console.log("buyer", buyer_response.body);
    console.log("product", product_response.body.product._id);

    const amount = { deposit: 100 };
    const deposit_response = await request(app)
      .put("/api/user")
      .set("Authorization", `Bearer ${buyer_response.body.token}`)
      .send(amount);

    expect(deposit_response.status).toBe(200);
    expect(deposit_response.body.deposit).toBeGreaterThanOrEqual(
      amount.deposit
    );

    const order = { amount: 6 };
    // buy drink
    response = await request(app)
      .post(`/api/product/buy/${product_response.body.product._id}`)
      .set("Authorization", `Bearer ${buyer_response.body.token}`)
      .send(order);
    expect(response.status).toBe(200);
    console.log(response.body.change_description);
    expect(response.body.message).toBe(`Thank you. Your purchase was successful!`);
    expect(response.body.total_spent).toBe(`¢${product_response.body.product.cost * order.amount}`);
    expect(response.body.products_purchased).toBe(`${product_response.body.product.productName} [${order.amount} units]`);
    expect(response.body.change).toBe(`¢${deposit_response.body.deposit - (product_response.body.product.cost * order.amount)}`);
    expect(response.body.change_description).toEqual(expect.arrayContaining([ [ 50, 1 ], [ 20, 1 ] ]));
  });
});
