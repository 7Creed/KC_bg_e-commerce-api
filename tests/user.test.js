const app = require("../bin/www");

const request = require("supertest");
const mongoose = require("mongoose");
const { userCollection } = require("../models/user");
const { cartOrderCollection } = require("../models/cartOrder");

// const { productCollection } = require("../models/product");

beforeAll(async () => {
  await userCollection.deleteMany();
  await cartOrderCollection.deleteMany();
}, 30000);

describe("User Routes", () => {
  let userToken;
  let productId;

  // Register User
  test("Register a Customer", async () => {
    const response = await request(app).post("/v1/auth/register").send({
      fname: "UserOne",
      email: "user@example.com",
      password: "user123",
      role: "customer",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("customer created successfully");
  });

  // Login Customer
  test("Login a customer", async () => {
    const response = await request(app).post("/v1/auth/login").send({
      email: "user@example.com",
      password: "user123",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.userDetails).toBeTruthy();
    expect(response.body.userToken).toBeTruthy();
    expect(response.body.userDetails.role).toBe("customer");

    userToken = response.body.userToken;
  });

  // Customer view all products
  it("should view all products", async () => {
    const response = await request(app)
      .get("/v1/customer/viewAllProducts")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    // expect(response.body).toBeTruthy();
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);

    productId = response.body[0]._id;
  });

  // Customer view a single product
  it("should view a single product", async () => {
    const response = await request(app)
      .get(`/v1/customer/viewAProducts/${productId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(productId);
  });

  // CUstomer checkout and create and order
  it("should checkout and create an order", async () => {
    const response = await request(app)
      .post("/v1/customer/addToCart")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        items: [
          { productId: productId, quantity: 2 },
          //   { productId: "66b663459060431da7c7c92f", quantity: 1 },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Order created");
    expect(response.body.order).toHaveProperty("totalAmount");
  });

  afterAll(async () => {
    // await mongoose.connection.close();
    await mongoose.disconnect();
    app.close();
  });
});
