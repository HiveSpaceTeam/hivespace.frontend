import enumeration from "./enumeration";
import i18n from "@/i18n/i18n";
const { t } = i18n.global

export default {
    capitalizeFirstLetter: function (str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    getDisplayedPrice: function (price, currency) {
        let displayedCurrency;
        if (currency === enumeration.currency.USD) {
            displayedCurrency = '$';
        } else if (currency === enumeration.currency.EUR) {
            displayedCurrency = '€';
        } else if (currency === enumeration.currency.VND) {
            displayedCurrency = '₫';
        } else {
            displayedCurrency = currency;
        }
        return displayedCurrency + price.toLocaleString("vi-VN");
    },

    getResourceValue: function (enumName, enumValue) {
        if (!enumeration[enumName]) return ''

        const propName = Object.keys(enumeration[enumName]).find(key => enumeration[enumName][key] === enumValue);

        if (!propName)
            return ''

        return t(`i18n${this.capitalizeFirstLetter(enumName)}.${propName}`)
    }

};;
