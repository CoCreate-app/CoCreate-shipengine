'use strict'
const api = require('@cocreate/api');
const request = require('request');

class CoCreateShipengine {
    constructor(wsManager) {
        this.module_id = 'shipengine';
        this.wsManager = wsManager;
        this.enviroment = 'test';
        this.API_KEY = null;
        this.init();

    }

    init() {
        if (this.wsManager) {
            this.wsManager.on(this.module_id, (socket, data) => this.sendDataShipEngine(socket, data));
        }
    }

    async sendDataShipEngine(socket, data) {
        let type = data['type'];
        const params = data['data'];
       
        try{
      	       let enviroment = typeof params['enviroment'] != 'undefined' ? params['enviroment'] : this.enviroment;
               let org_row = await api.getOrg(params,this.module_id);
               this.API_KEY =  org_row['apis.'+this.module_id+'.'+enviroment+'.API_KEY'];
      	 }catch(e){
      	   	console.log(this.module_id+" : Error Connect to api",e)
      	   	return false;
      	 }

        switch (type) {
            case 'getCarriers':
                await this.getCarriers(socket, type);
                break;
            case 'createShipment':
                await this.createShipment(socket, type, params);
                break;
            case 'getPrice':
                await this.getPrice(socket, type, params);
                break;
            case 'createLabel':
                await this.createLabel(socket, type, params);
                break;
            case 'trackPackage':
                await this.trackPackage(socket, type, params);
                break;
        }
    }

    async getCarriers(socket, type) {

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
        api.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id)
    }

    async createShipment(socket, type, data) {

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

        api.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
    }

    async getPrice(socket, type, data) {
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
            'data': resData.rate_response?rates,
        };

        api.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
    }

    async createLabel(socket, type, data) {

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

        api.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
    }

    async trackPackage(socket, type, data) {

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

        api.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
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
