import { formatCurrency } from "../utils/purchaseUtils.js";

import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Row,
  Text,
} from "@react-email/components";


const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

export default function PurchaseReceiptEmail({ order }) {
  return (
    <Html>
      <Preview>View order receipt</Preview>
      <Head />
      <Body className="">
        <Container className="">
          <Heading>Purchase Receipt</Heading>
          <Section>
            <Row>
              <Column>
                <Text className="">Order ID</Text>
                <Text className="">{order.id.toString()}</Text>
              </Column>
              <Column>
                <Text className="">Purchase Date</Text>
                <Text className="mt-0 mr-4">
                  {dateFormatter.format(order.createdAt)}
                </Text>
              </Column>
              <Column>
                <Text className="">Price Paid</Text>
                <Text className="">{formatCurrency(order.totalPrice)}</Text>
              </Column>
            </Row>
          </Section>
          <Section className="">
            {order.orderItems.map((item) => {
              const { image, title, qty, price } = item;

              let test = image?.slice(0, 7);

              let path;

              if (test === "https:/") {
                path = image;
              } else if (test === "uploads") {
                path = `${import.meta.env.VITE_ASSET_URL}/${image}`;
              } else {
                path = `/images/${image}.jpg`;
              }

              return (
                <Row key={item.id} className="">
                  <Column className="">
                    <Img width="80" alt={item.name} className="" src={path} />
                  </Column>
                  <Column className="">
                    {title}x{qty}
                  </Column>
                  <Column align="right" className="">
                    {formatCurrency(price)}
                  </Column>
                </Row>
              );
            })}
            {[
              { name: "Items", price: order.itemsPrice },
              // { name: "Tax", price: order.taxPrice },
              { name: "Shipping", price: order.shippingPrice },
              { name: "Total", price: order.totalPrice },
            ].map(({ name, price }) => (
              <Row key={name} className="">
                <Column align="right">{name}:</Column>
                <Column align="right" width={70} className="align-top">
                  <Text className="m-0">{formatCurrency(price)}</Text>
                </Column>
              </Row>
            ))}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
