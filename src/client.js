import api from '@cocreate/api'

const CoCreateShipEngine = {
    id: 'shipengine',
    actions: [
        'getCarriers',
        'createShipment',
        'getPrice',
        'createLabel',
        'trackPackage',
    ],

    render_getCarriers: function (data) {
        console.log(data);
    },

    render_shipengineGetPrice: function (data) {
        console.log(data);
    },

    action_createShipment: function (element, data) {
        let container = element.closest("form");
        let shippingdata = api.getFormData('shipengine', 'createShipment', container);
        console.log(shippingdata);
        api.send('shipengine', 'createShipment', shippingdata);
    },

    action_getPrice: function (element, data) {
        let container = element.closest("form");
        let shippingdata = api.getFormData('shipengine', 'getPrice', container);
        console.log(shippingdata);
        api.send('shipengine', 'getPrice', shippingdata);
    },

    action_createLabel: function (element, data) {
        let container = element.closest("form");
        let shippingdata = api.getFormData('shipengine', 'createLabel', container);
        console.log(shippingdata);
        api.send('shipengine', 'createLabel', shippingdata);
    },

    action_trackPackage: function (element, data) {
        let container = element.closest("form");
        let shippingdata = api.getFormData('shipengine', 'trackPackage', container);
        console.log(shippingdata);
        api.send('shipengine', 'trackPackage', shippingdata);
    }
}


api.init({
	name: CoCreateShipEngine.id, 
	module:	CoCreateShipEngine,
});

export default CoCreateShipEngine;