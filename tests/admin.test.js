// const app = require("../bin/www");
const app = require("../bin/www");

const request = require("supertest");
const mongoose = require("mongoose");
const { userCollection } = require("../models/user");
const { productCollection } = require("../models/product");

// userCollection;
// productCollection;

// let adminToken;
// let productId;

beforeAll(async () => {
  await userCollection.deleteMany();
  await productCollection.deleteMany();
});

describe("Admin Routes", () => {
  let adminToken;
  let productId;

  // Register Admin
  test("Register an Admin", async () => {
    const response = await request(app).post("/v1/auth/register").send({
      fname: "AdminUser",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("admin created successfully");
  });

  // Login Admin
  test("Login an admin", async () => {
    const response = await request(app).post("/v1/auth/login").send({
      email: "admin@example.com",
      password: "admin123",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.userDetails).toBeTruthy();
    expect(response.body.userToken).toBeTruthy();
    expect(response.body.userDetails.role).toBe("admin");

    adminToken = response.body.userToken;
  });

  // Admin Add a Product
  it("should add a product", async () => {
    const response = await request(app)
      .post("/v1/admin/addProducts")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Product 1",
        price: 29.99,
        description: "First Product Description",
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Product added");
    expect(response.body.productName).toBe("Product 1");
  });

  // Admin Add a second Product
  it("should add a second product", async () => {
    const response = await request(app)
      .post("/v1/admin/addProducts")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Product 2",
        price: 49.99,
        description: "Second Product Description",
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Product added");
    expect(response.body.productName).toBe("Product 2");
    productId = response.body._id;
  });

  // Admin Edit the second Product
  it("should edit the second product", async () => {
    const response = await request(app)
      .put(`/v1/admin/editProducts/${productId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Updated Product 2",
        price: 59.99,
        description: "Updated Description",
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Product updated");
    expect(response.body.productName).toBe("Updated Product 2");
  });

  // Admin Delete the second Product
  it("should delete the second product", async () => {
    const response = await request(app)
      .delete(`/v1/admin/deleteAProduct/${productId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Product deleted");
  });

  afterAll(async () => {
    // await mongoose.connection.close();
    await mongoose.disconnect();
    app.close();
  });
});
