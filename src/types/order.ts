export class DistributionItem {
  amount: number = 0
  count: number = 0
}

export class Distribution {
  buy: DistributionItem = new DistributionItem()
  sell: DistributionItem = new DistributionItem()
}

export class ClientDistribution {
  legal: Distribution = new Distribution()
  real: Distribution = new Distribution()
}

export class OrderItem {
  amount: number = 0
  count: number = 0
  price: number = 0.0
}

export class OrderQueueItem {
  buy: OrderItem = new OrderItem()
  sell: OrderItem = new OrderItem()
}
