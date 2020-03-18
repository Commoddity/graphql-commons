import React from 'react';
import BillCard from './BillCard';

export default function Bills(props) {
  const bills = props.bills
    .sort((a, b) => new Date(b.introduced_date) - new Date(a.introduced_date))
    .filter((bill) => {
      return props.childCategory === 0
        ? bill
        : bill.categories.includes(props.childCategory);
    });

  const billCards = bills.map((bill) => {
    return (
      <BillCard
        key={bill.id}
        user={props.user}
        bill={bill}
        setUser={props.setUser}
      />
    );
  });

  return billCards;
}
