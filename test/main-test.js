describe('pos 全单满100减10块', function () {
    var allItems;
    var inputs;

    beforeEach(function () {
        allItems = loadAllItems();
        inputs = [
            'ITEM000000-3',
            'ITEM000001-5',
            'ITEM000003',
            'ITEM000003',
            'ITEM000006',
        ];
    });

    it('should print correct text', function () {

        spyOn(console, 'log');

        printReceipt(inputs);

        var expectText =
            '*<没钱赚商店>购物清单*\n' +
            '名称：可口可乐，数量：3瓶，单价：3.00(元)，小计：9.00(元)\n' +
            '名称：羽毛球，数量：5个，单价：1.00(元)，小计：5.00(元)\n' +
            '名称：苹果，数量：2斤，单价：5.50(元)，小计：11.00(元)\n' +
            '名称：篮球，数量：1个，单价：98.00(元)，小计：98.00(元)\n' +
            '-------------------------------------------------------------------------------\n' +
            '不参与优惠商品：名称：苹果，价格：11.00(元) 参与优惠总价：102.00(元)，优惠：10.00(元)\n' +
            '*******************************************************************************\n' +
            '-----------------------------\n' +
            '总计：113.00(元) 节省：10.00(元)\n' +
            '*****************************';

        expect(console.log).toHaveBeenCalledWith(expectText);
    });
});

describe('pos 全单不满100', function () {
    var allItems;
    var inputs;

    beforeEach(function () {
        allItems = loadAllItems();
        inputs = [
            'ITEM000000-3',
            'ITEM000001-5',
            'ITEM000003',
            'ITEM000003'
        ];
    });

    it('should print correct text', function () {

        spyOn(console, 'log');

        printReceipt(inputs);

        var expectText =
            '*<没钱赚商店>购物清单*\n' +
            '名称：可口可乐，数量：3瓶，单价：3.00(元)，小计：9.00(元)\n' +
            '名称：羽毛球，数量：5个，单价：1.00(元)，小计：5.00(元)\n' +
            '名称：苹果，数量：2斤，单价：5.50(元)，小计：11.00(元)\n' +
            '-----------------------------\n' +
            '总计：25.00(元)\n' +
            '*****************************';

        expect(console.log).toHaveBeenCalledWith(expectText);
    });
});