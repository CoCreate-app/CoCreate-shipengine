'use strict'
const api = require('@cocreate/api');
const request = require('request');

class CoCreateShipengine {
    constructor(wsManager) {
        this.name = 'shipengine';
        this.wsManager = wsManager;
        this.environment = 'test';
        this.API_KEY = null;
        this.init();

    }

    init() {
        if (this.wsManager) {
            this.wsManager.on(this.name, (socket, data) => this.sendDataShipEngine(socket, data));
        }
    }

    async sendDataShipEngine(socket, data) {
        let action = data['action'];
        const params = data['data'];
       
        try{
            let org = await api.getOrg(data, this.name);
            if (params.environment){
              environment = params['environment'];
              delete params['environment'];  
            } else {
              environment = org.apis[this.name].environment;
            }
            this.API_KEY =  org.apis[this.name][environment].API_KEY;
        }catch(e){
            console.log(this.name+" : Error Connect to api",e)
            return false;
        }
        
        try {
            let response
            switch (action) {
                case 'getCarriers':
                    await this.getCarriers();
                    break;
                case 'createShipment':
                    await this.createShipment(params);
                    break;
                case 'getPrice':
                    await this.getPrice(params);
                    break;
                case 'createLabel':
                    await this.createLabel(params);
                    break;
                case 'trackPackage':
                    await this.trackPackage(params);
                    break;
            }
            this.wsManager.send(socket, this.name, { action, response })

        } catch (error) {
        this.handleError(socket, action, error)
        }
    }

    handleError(socket, action, error) {
        const response = {
            'object': 'error',
            'data': error || error.response || error.response.data || error.response.body || error.message || error,
        };
        this.wsManager.send(socket, this.name, { action, response })
    }	

    async getCarriers() {
        const options = {
            'method': 'GET',
            'url': 'https://api.shipengine.com/v1/carriers',
            'headers': {
                'Host': 'api.shipengine.com',
                'API-Key': this.API_KEY
            }
        };
        
        const resData = await this.invoke(options);

        const response = {
            'object': 'list',
            'data': resData.carriers,
        };
        return response
    }

    async createShipment(data) {

        const reqData = data.data.shipments[0];

        const sendData = {
            "shipments": [
                {
                    "validate_address": reqData.validate,
                    "service_code": reqData.service_code,
                    "external_shipment_id": reqData.external_shipment_id,
                    "ship_to": reqData.ship_to[0],
                    "ship_from": reqData.ship_form[0],
                    "confirmation": "none",
                    "advanced_options": {},
                    "insurance_provider": "none",
                    "tags": [],
                    "packages": [
                        {
                            "weight": {
                                "value": 1,
                                "unit": "ounce"
                            }
                        }
                    ]
                }
            ]
        };
        
        const options = {
            'method': 'POST',
            'url': 'https://api.shipengine.com/v1/shipments',
            'headers': {
                'Host': 'api.shipengine.com',
                'API-Key': this.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendData)
        };

        const resData = await this.invoke(options);

        const response = {
            'object': 'list',
            'data': resData.shipments,
        };

        return response
    }

    async getPrice(data) {
        const reqData = data.data;
        const sendData = {
            "shipment_id": reqData.shipmentId,
            "rate_options": {
                "carrier_ids": [reqData.carrierId]

            }
        };
        
        const options = {
            'method': 'POST',
            'url': 'https://api.shipengine.com/v1/rates',
            'headers': {
                'Host': 'api.shipengine.com',
                'API-Key': this.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendData)

        };

        const resData = await this.invoke(options);

        const response = {
            'object': 'list',
            // 'data': resData.rate_response?.rates,
            'data': resData.rate_response.rates,
        };

        return response
    }

    async createLabel(data) {

        const reqData = data.data.shipments[0];

        const sendData = {
            "shipment": {
                "service_code": reqData.service_code,
                "ship_to": reqData.ship_to[0],
                "ship_from": reqData.ship_form[0],
                "packages": [
                    {
                        "weight": {
                            "value": 20,
                            "unit": "ounce"
                        },
                        "dimensions": {
                            "height": 6,
                            "width": 12,
                            "length": 24,
                            "unit": "inch"
                        }
                    }
                ]
            }
        }

        const options = {
            'method': 'POST',
            'url': 'https://api.shipengine.com/v1/labels',
            'headers': {
                'Host': 'api.shipengine.com',
                'API-Key': this.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendData)
        };

        const resData = await this.invoke(options);

        const response = {
            'object': 'list',
            'data': [resData],
        };

        return response
    }

    async trackPackage(data) {

        const reqData = data.data;

        const options = {
            'method': 'GET',
            'url': `https://api.shipengine.com/v1/labels/${reqData.labelId}/track`,
            'headers': {
                'Host': 'api.shipengine.com',
                'API-Key': this.API_KEY,
                'Cache-Control': 'no-cache'
            }
        };

        const resData = await this.invoke(options);

        const response = {
            'object': 'list',
            'data': [resData],
        };

        return response
    }

    invoke(options) {
        return new Promise((resolve, reject) => {
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                try {
                    const data = JSON.parse(body);
                    return resolve(data);
                } catch (err) {
                    return resolve(err);
                }
            });
        });
    }

}
module.exports = CoCreateShipengine;
