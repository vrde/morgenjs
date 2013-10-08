(function (register, load, hub) {

    var db = {

        '0': { title      : 'Item number 0',
               dt         : new Date(),
               description: 'This is an awesome item' },

        '1': { title      : 'Item number 1',
               dt         : new Date(),
               description: 'This is another awesome item' }
    };

    register('itemdetails', function (c) {
        var data = db[c.extras.id];

        c.render('itemdetails', data);
    });

}) (window.morgen.register,
    window.morgen.load,
    window.morgen.hub);

