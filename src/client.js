import api from '@cocreate/api'

const CoCreateShipEngine = {
    name: 'shipengine',
    actions: {
        getCarriers: {},
        createShipment: {},
        getPrice: {},
        createLabel: {},
        trackPackage: {}
    }
}

api.init({
	name: CoCreateShipEngine.name, 
	module:	CoCreateShipEngine,
});

export default CoCreateShipEngine;