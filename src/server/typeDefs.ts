const typeDefs = `
 extend type StoreProduct {
    sellers: [Seller]
    link: String
    variations: String
    data: String
  }

  type Installment {
    Value: Float
    InterestRate: Float
    TotalValuePlusInterestRate: Float
    NumberOfInstallments: Int
    PaymentSystemName: String
    PaymentSystemGroupName: String
    Name: String
  }

  type DiscountHighlight {
    name: String!
  }

  type Seller {
    sellerId: String
    sellerName: String
    addToCartLink: String
    sellerDefault: Boolean!
    Installments: [Installment!]
    Price: Float
    ListPrice: Float
    discountHighlights: [DiscountHighlight!]
    AvailableQuantity: Int
  }
`

export default typeDefs
