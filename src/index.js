import api from '@cocreate/api/src'
import {socket, crud} from '@cocreate/cocreatejs';

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
        let shippingdata = CoCreate.api.getFormData('shipengine', 'createShipment', container);
        console.log(shippingdata);
        CoCreate.api.send('shipengine', 'createShipment', shippingdata);
    },

    action_getPrice: function (element, data) {
        let container = element.closest("form");
        let shippingdata = CoCreate.api.getFormData('shipengine', 'getPrice', container);
        console.log(shippingdata);
        CoCreate.api.send('shipengine', 'getPrice', shippingdata);
    },

    action_createLabel: function (element, data) {
        let container = element.closest("form");
        let shippingdata = CoCreate.api.getFormData('shipengine', 'createLabel', container);
        console.log(shippingdata);
        CoCreate.api.send('shipengine', 'createLabel', shippingdata);
    },

    action_trackPackage: function (element, data) {
        let container = element.closest("form");
        let shippingdata = CoCreate.api.getFormData('shipengine', 'trackPackage', container);
        console.log(shippingdata);
        CoCreate.api.send('shipengine', 'trackPackage', shippingdata);
    }
}


api.init({
	name: CoCreateShipEngine.id, 
	module:	CoCreateShipEngine,
});

export default CoCreateShipengine;