
export function amountToWords(amount: number | string): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(num) || num < 0) {
        return "مبلغ غير صالح";
    }

    if (num === 0) {
        return "فقط صفر جنيهاً مصرياً لا غير";
    }

    const integerPart = Math.floor(num);
    const fractionalPart = Math.round((num - integerPart) * 100);

    const units = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"];
    const teens = ["عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر"];
    const tens = ["", "عشرة", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
    const hundreds = ["", "مائة", "مئتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];

    const convertThreeDigits = (n: number): string => {
        let result = [];
        if (n >= 100) {
            result.push(hundreds[Math.floor(n / 100)]);
            n %= 100;
        }
        if (n >= 20) {
            const unit = n % 10;
            const ten = Math.floor(n / 10);
            if (unit > 0) {
                if (result.length > 0) result.push("و");
                result.push(units[unit]);
                result.push("و");
            } else if (result.length > 0) {
                result.push("و");
            }
            result.push(tens[ten]);
        } else if (n >= 10) {
            if (result.length > 0) result.push("و");
            result.push(teens[n - 10]);
        } else if (n > 0) {
            if (result.length > 0) result.push("و");
            result.push(units[n]);
        }
        return result.join(" ");
    };

    const convert = (n: number): string => {
        if (n === 0) return "";

        let result = "";
        const billions = Math.floor(n / 1000000000);
        const millions = Math.floor((n % 1000000000) / 1000000);
        const thousands = Math.floor((n % 1000000) / 1000);
        const remainder = n % 1000;

        if (billions > 0) {
            if (billions === 1) result += "مليار";
            else if (billions === 2) result += "ملياران";
            else if (billions >= 3 && billions <= 10) result += convertThreeDigits(billions) + " مليارات";
            else result += convertThreeDigits(billions) + " ملياراً";
        }

        if (millions > 0) {
            if (result.length > 0) result += " و ";
            if (millions === 1) result += "مليون";
            else if (millions === 2) result += "مليونان";
            else if (millions >= 3 && millions <= 10) result += convertThreeDigits(millions) + " ملايين";
            else result += convertThreeDigits(millions) + " مليوناً";
        }

        if (thousands > 0) {
            if (result.length > 0) result += " و ";
            if (thousands === 1) result += "ألف";
            else if (thousands === 2) result += "ألفان";
            else if (thousands >= 3 && thousands <= 10) result += convertThreeDigits(thousands) + " آلاف";
            else result += convertThreeDigits(thousands) + " ألفاً";
        }
        
        if (remainder > 0) {
            if (result.length > 0) result += " و ";
            result += convertThreeDigits(remainder);
        }

        return result;
    }

    let integerWords = convert(integerPart);
    if (integerWords) {
        integerWords += " جنيهاً مصرياً";
    }

    let fractionalWords = "";
    if (fractionalPart > 0) {
        fractionalWords = convert(fractionalPart);
        if (fractionalWords) {
           fractionalWords += " قرشاً";
        }
    }

    let fullText = integerWords;
    if (integerWords && fractionalWords) {
        fullText += " و " + fractionalWords;
    } else if (fractionalWords) {
        fullText = fractionalWords;
    }

    return `فقط ${fullText} لا غير`;
}
