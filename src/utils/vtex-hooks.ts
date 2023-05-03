import { useSession } from "src/sdk/session";
import {
  useProductsQuery,
  useProductsQueryPrefetch,
} from "src/sdk/product/useProductsQuery";
import { useProductLink } from "src/sdk/product/useProductLink";
import { useLazyQuery } from "src/sdk/graphql/useLazyQuery";
import { useBuyButton } from "src/sdk/cart/useBuyButton";
import { useCheckoutButton } from "src/sdk/cart/useCheckoutButton";
import { useRemoveButton } from "src/sdk/cart/useRemoveButton";
import { useCart } from "src/sdk/cart";
import { useUI } from "src/sdk/ui/Provider";

export default {
  useSession,
  useLazyQuery,
  useProductsQuery,
  useProductsQueryPrefetch,
  useProductLink,
  useBuyButton,
  useCheckoutButton,
  useRemoveButton,
  useCart,
  useUI,
};
