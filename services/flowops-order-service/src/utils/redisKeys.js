const SERVICE = "flowops:order-service";
const VERSION = "v1";

module.exports = {
  ordersList: (page, limit) =>
    `${SERVICE}:${VERSION}:orders:list:page:${page}:limit:${limit}`,

  orderEntity: (orderId) =>
    `${SERVICE}:${VERSION}:orders:entity:${orderId}`,

  orderLock: (orderId) =>
    `${SERVICE}:${VERSION}:locks:order:${orderId}`,
};
