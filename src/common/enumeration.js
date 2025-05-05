
const enumeration = {
    editMode: {
        Add: 0,
        Edit: 1,
    },
    currency: {
        VND: 0,
        USD: 1,
        EUR: 2,
    },
    orderStatus: {
        pendingApproval: 0,
        approved: 1,
        awaitingShipment: 2,
        shipping: 3,
        shipped: 4,
        canceled: 5
    },
    comparisonOperator: {
        equal: 0,
        notEqual: 1,
        greaterThan: 2,
        lessThan: 3,
    },
    errorCode: {
        phoneNumberExisted: 422001,
        invalidSku: 422002,
        invalidMoney: 422003,
        invalidPhoneNumber: 422004,
        incorrectPassword: 422005
    }
};
export default enumeration;
