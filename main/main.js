function printReceipt(inputs) {
    var cartItems = buildCartItems(inputs);
    var receiptItems = buildReceiptItems(cartItems);
    var receipt = buildReceipt(receiptItems);
    print(receipt, receiptItems);
}

function print(receipt, receiptItems) {
    var expectText = '*<没钱赚商店>购物清单*\n';
    var goods = isPromotion(receiptItems);

    for (var i = 0; i < receipt.receiptItems.length; i++) {
        expectText += '名称：' + receipt.receiptItems[i].cartItem.name + '，' + '数量：'
            + receipt.receiptItems[i].cartItem.count + receipt.receiptItems[i].cartItem.unit
            + '，' + '单价：' + receipt.receiptItems[i].cartItem.price.toFixed(2) + '(元)' + '，'
            + '小计：' + receipt.receiptItems[i].subtotal.toFixed(2) + '(元)\n';
    }
    if (receipt.promItemPrice > 100) {
        expectText += '-------------------------------------------------------------------------------\n'
        for (var i = 0; i < goods.notPromItem.length; i++) {
            expectText += '不参与优惠商品：名称：' + goods.notPromItem[i].cartItem.name + '，' +
                '价格：' + goods.notPromItem[i].subtotal.toFixed(2) + '(元)';
        }
        expectText += ' 参与优惠总价：' + receipt.promItemPrice.toFixed(2) + '(元)，优惠：' +
            receipt.privilege.toFixed(2) + '(元)\n' +
            '*******************************************************************************\n'
            + '-----------------------------\n' +
            '总计：' + receipt.total.toFixed(2) + '(元)' + ' 节省：' + receipt.privilege.toFixed(2) + '(元)\n' +
            '*****************************';
    } else {
        expectText += '-----------------------------\n' +
            '总计：' + receipt.total.toFixed(2) + '(元)\n' +
            '*****************************';
    }

    console.log(expectText);
}

function isPromotion(receiptItems) {
    var promotionItems = [];
    var notPromotionItems = [];
    var promotions = loadPromotions();

    for (var i = 0; i < receiptItems.length; i++) {
        var existDash = receiptItems[i].cartItem.barcode.split("-");
        var isProm = false;

        promotions.forEach(function (promtion) {
            promtion.barcodes.forEach(function (barcode) {
                if (barcode === existDash[0]) {
                    promotionItems.push(receiptItems[i]);
                    isProm = true;
                }
            });
        });
        if (isProm === false) {
            notPromotionItems.push(receiptItems[i]);
        }
    }

    return {promItem: promotionItems, notPromItem: notPromotionItems};
}

function buildReceipt(receiptItems) {
    var receipt = {};
    var goods = isPromotion(receiptItems);
    var promItemPrice = 0;
    var notPromItemPrice = 0;

    for (var i = 0; i < goods.promItem.length; i++) {
        promItemPrice += goods.promItem[i].subtotal;
    }
    if (promItemPrice > 100) {
        promItemPrice = promItemPrice - (promItemPrice / 100).toFixed(0) * 10;
    }
    for (var i = 0; i < goods.notPromItem.length; i++) {
        notPromItemPrice += goods.notPromItem[i].subtotal;
    }
    receipt = {
        receiptItems: receiptItems, promItemPrice: promItemPrice,
        notPromItemPrice: notPromItemPrice, privilege: (promItemPrice / 100).toFixed(0) * 10,
        total: promItemPrice + notPromItemPrice
    };

    return receipt;
}

function buildReceiptItems(cartItems) {
    var receiptItems = [];
    for (var i = 0; i < cartItems.length; i++) {
        var cartItem = {};

        receiptItems.push({
            cartItem: {
                barcode: cartItems[i].item.barcode, name: cartItems[i].item.name,
                unit: cartItems[i].item.unit, price: cartItems[i].item.price,
                count: cartItems[i].count
            },
            subtotal: cartItems[i].item.price * cartItems[i].count
        });
    }

    return receiptItems;
}

function isExistDash(item, cartItems) {
    var existDash = item.barcode.split("-");


    for (var i = 0; i < cartItems.length; i++) {
        if (existDash[1]) {
            cartItems.push({item: item, count: existDash[1]});

            return cartItems;
        } else {
            if (existDash[0] === cartItems[i].item.barcode) {
                cartItems[i].count++;

                return cartItems;
            }
        }
    }
    if (existDash[1]) {
        cartItems.push({item: item, count: existDash[1]});
    } else {
        cartItems[cartItems.length] = {item: item, count: 1};
    }

    return cartItems;
}

function buildCartItems(inputs) {
    var items = buildItems(inputs);
    var cartItems = [];
    items.forEach(function (item) {
        cartItems = isExistDash(item, cartItems);
    });

    return cartItems;
}

function buildItems(inputs) {
    var allItems = loadAllItems();
    var items = [];

    inputs.forEach(function (input) {
        var existDash = input.split("-");
        for (var i = 0; i < allItems.length; i++) {
            if (existDash[0] === allItems[i].barcode) {
                items.push({
                    barcode: input, name: allItems[i].name,
                    unit: allItems[i].unit, price: allItems[i].price
                });
            }
        }
    });

    return items;
}
