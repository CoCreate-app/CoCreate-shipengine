import api from '@cocreate/api'

const CoCreateShipEngine = {
    name: 'shipengine',
    endPoints: {
        getCarriers: {},
        createShipment: {},
        getPrice: {},
        createLabel: {},
        trackPackage: {}
    }
}

api.init(CoCreateShipEngine);

export default CoCreateShipEngine;