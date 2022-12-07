const typeDefs = `
 extend type StoreProduct {
    sellers: [Seller]
    link: String
    variations: String
  }

  type Installment {
    Value: Int
    InterestRate: Int
    TotalValuePlusInterestRate: Int
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
