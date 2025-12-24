const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const Order = require("../models/order.model");

describe("Order API", () => {

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
  });

  afterEach(async () => {
    await Order.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should create an order", async () => {
    const res = await request(app)
      .post("/orders")
      .send({
        customer: "Test User",
        address: "Test City",
        items: [{ sku: "SKU-1", qty: 2, price: 100 }],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.totalAmount).toBe(200);
    expect(res.body.status).toBe("Pending");
  });

  it("should fetch orders with pagination", async () => {
    // seed data
    await Order.create({
      customer: "Seed User",
      address: "Seed City",
      items: [{ sku: "SKU-1", qty: 1, price: 100 }],
    });

    const res = await request(app).get("/orders");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.pagination).toBeDefined();
  });

  it("should update an order", async () => {
    // seed data
    const order = await Order.create({
      customer: "Update User",
      address: "Old City",
      items: [{ sku: "SKU-1", qty: 1, price: 100 }],
    });

    const res = await request(app)
      .put(`/orders/${order._id}`)
      .send({ address: "Updated City" });

    expect(res.statusCode).toBe(200);
    expect(res.body.address).toBe("Updated City");
  });

  it("should cancel an order", async () => {
    // seed data
    const order = await Order.create({
      customer: "Cancel User",
      address: "Cancel City",
      items: [{ sku: "SKU-1", qty: 1, price: 100 }],
    });

    const res = await request(app)
      .delete(`/orders/${order._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.order.status).toBe("Cancelled");
  });
});
