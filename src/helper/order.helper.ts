// src/helpers/order.helper.ts

type Person = {
    type: string;
};

type TourPrice = {
    adult: number;
    child: number;
};

export function countPersonByType(persons: Person[], type: string): number {
    return persons.reduce((count, person) => (person.type === type ? count + 1 : count), 0);
}

export function calculateTotalPrice(
    adultCount: number,
    childCount: number,
    price: TourPrice,
): number {
    const totalAdult = adultCount * price.adult;
    const totalChild = childCount * price.child;
    return totalAdult + totalChild;
}
