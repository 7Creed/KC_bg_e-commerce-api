describe("Admin Routes", () => {
  let adminToken;
  let productId;
});

describe("This is a test for admin registration and login ", () => {
  test("Register an Admin", async () => {
    const response = await request(app).post("/v1/auth/register").send({
      firstName: "Admin",
      lastName: "Presh",
      email: "presh@btcmod.com",
      password: "12345",
    });
    await usersModel.findOneAndUpdate(
      { email: "presh@btcmod.com" },
      { isEmailVerified: true, role: "admin" },
      { new: true }
    );
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully");
  });

  test("Login an Admin", async () => {
    const response = await request(app).post("/v1/auth/login").send({
      email: "presh@btcmod.com",
      password: "12345",
    });

    adminToken = response.body.access_token;
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.user).toBeTruthy();
    expect(response.body.access_token).toBeTruthy();
    expect(response.body.user.role).toBe("admin");
    expect(response.body.user.isEmailVerified).toBe(true);
  });
});
